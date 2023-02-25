import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { roles } from '../../middleware';
import { ErrorType } from '../../types';
import QueryManager, { FilterParams } from '../../utils/query';
import { Models } from '../../views/view';

export class InitiativeController {
  async create(request: Request, response: Response) {
    const fields = [
      'name',
      'code',
      'responsible_id',
      'budget_code',
      'unit_id',
      'perspective_id',
      'stage_id',
      'font_id',
      'goal_id',
      'mapp_id',
    ];

    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const ids: number[] = [];
    fields.forEach(field => {
      if (!field.includes('_id')) {
        return;
      }

      const id = request.body[field];
      if (!id) return;

      ids.push(Number(id));
    });

    if (ids.length !== 7) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.initiative.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    const body = { ...request.body, planning_id };

    try {
      const models = fields.map(field => {
        if (!field.includes('_id')) return;

        const name = field.split('_')[0] as Models;
        const bodyId = request.body[field];
        if (!bodyId) return;

        return { name: name, id: Number(bodyId) };
      });

      models.every(async model => {
        if (!model) return;

        let name = model.name;
        const { id } = model;

        name = (name as any) === 'responsible' ? 'user' : name;

        const entity = await (prisma[name] as any).findUnique({
          where: { id },
        });
        if (!entity) {
          response[name].error({ type: ErrorType.NOT_FOUND });
          return false;
        }

        return true;
      });

      if (request.file) {
        body.file = request.file.buffer;
      }

      if (request.userData.role_id === roles.low[roles.low.length - 1]) {
        const stage = await prisma.stage.findFirst({
          where: {
            name: {
              contains: 'Em Validação',
            },
          },
        });

        if (stage) {
          body.stage_id = stage.id;
        }

        const pendingInitiative = await prisma.pendingInitiative.create({
          data: body,
        });

        response.initiative.created(pendingInitiative);
        return;
      }

      const initiative = await prisma.initiative.create({
        data: body,
      });

      response.initiative.created(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.initiative.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    const filter: FilterParams = { planning_id };
    if (request.userData.unit_id) {
      filter.unit_id = request.userData.unit_id;
    }

    const queryManager = new QueryManager(request);
    const options = queryManager.build(filter);

    try {
      let initiatives, count;
      if (request.query.pagination) {
        const transaction = await prisma.$transaction([
          prisma.initiative.count({ where: options.where }),
          prisma.initiative.findMany(options),
        ]);

        count = transaction[0];
        initiatives = transaction[1];
      } else {
        initiatives = await prisma.initiative.findMany(options);
      }

      if (initiatives.length === 0) {
        response.initiative.error({ type: ErrorType.EMPTY });
        return;
      }

      const totalPages = queryManager.totalPages(count || -1);

      if (request.query.metrics) {
        const metrics = await Promise.all(
          initiatives.map(async initiative => {
            const activities = await prisma.activity.findMany({
              where: { initiative_id: initiative.id },
              include: { state: { select: { name: true } } },
            });

            let totalValue = 0;
            let dones = 0;

            if (activities.length > 0) {
              activities.forEach(activity => {
                totalValue += Number(activity.value);

                if (activity.state?.name === 'Concluído') {
                  dones++;
                }
              });
            }

            const executed =
              activities.length === 0 ? 0 : dones / activities.length;

            return {
              ...initiative,
              totalValue,
              executed,
              totalActivities: activities.length,
            };
          }),
        );

        response.initiative.many(metrics, totalPages);
        return;
      }

      response.initiative.many(initiatives, totalPages);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const queryManager = new QueryManager(request);
    const options = queryManager.build({ id: idNum });
    try {
      const initiative = await prisma.initiative.findFirst(options);
      if (!initiative) {
        response.initiative.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.initiative.show(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const initiative = await prisma.initiative.findUnique({
        where: { id: idNum },
      });
      if (!initiative) {
        response.initiative.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      if (request.userData.role_id === roles.low[roles.low.length - 1]) {
        const alreadyPending = await prisma.pendingInitiative.findFirst({
          where: { initiative_id: idNum },
        });
        if (alreadyPending) {
          response.initiative.error({ type: ErrorType.ALREADY_CHANGE_REQUEST });
          return;
        }

        const pendingBody = { ...initiative, ...request.body };
        const fields = ['id', 'created_at', 'updated_at'];
        fields.forEach(field => delete (pendingBody as any)[field]);

        const pending = await prisma.pendingInitiative.create({
          data: {
            ...pendingBody,
            initiative_id: initiative.id,
          },
        });

        response.initiative.show(pending);
        return;
      }

      const updateInitiative = await prisma.initiative.update({
        where: { id: idNum },
        data: request.body,
      });

      response.initiative.show(updateInitiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.initiative.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async getFile(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const initiative = await prisma.initiative.findFirst({
        where: { id: idNum },
      });
      if (!initiative) {
        response.initiative.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      if (!initiative.file) {
        response.initiative.error({ type: ErrorType.EMPTY_FILE });
        return;
      }

      response.initiative.file(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }
}

import { Request, Response } from 'express';
import { prisma } from '../../database/client';
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
      console.log(ids);
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.initiative.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

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

      const file = request.body.file ? request.body.file.buffer : undefined;

      const initiative = await prisma.initiative.create({
        data: {
          ...request.body,
          file,
          planning_id,
        },
      });

      response.initiative.created(initiative);
    } catch (e) {
      console.log(e);
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
      const initiatives = await prisma.initiative.findMany(options);
      if (initiatives.length === 0) {
        response.initiative.error({ type: ErrorType.EMPTY });
        return;
      }

      response.initiative.many(initiatives);
    } catch (e) {
      console.log(e);
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
    try {
      const initiative = await prisma.initiative.findUnique({
        where: { id: idNum },
      });
      if (!initiative) {
        response.initiative.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.initiative.show(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }
}

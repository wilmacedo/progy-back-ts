import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { roles } from '../../middleware';
import { ErrorType } from '../../types';
import QueryManager from '../../utils/query';

export default class ActivityController {
  async create(request: Request, response: Response) {
    const fields = [
      'name',
      'dateStart',
      'dateEnd',
      'responsible_id',
      'state_id',
      'initiative_id',
    ];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.activity.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    const body = { ...request.body, planning_id };
    if (request.body.dateEnd < request.body.dateStart) {
      response.activity.error({
        type: ErrorType.CUSTOM,
        code: 400,
        message: 'The end date must be greater than the start date.',
      });
      return;
    }

    fields.forEach(field => {
      if (field.includes('date')) {
        const converted = field
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(' ', '_');
        body[converted.toLowerCase() as keyof typeof body] = body[field];
        delete body[field];
      }
      if (!isNaN(body[field])) {
        body[field] = Number(body[field]);
      }
    });

    if (body.value) {
      body.value = Number.parseFloat(body.value);
    }

    if (request.file) {
      body.file = request.file.buffer;
    }

    try {
      if (request.userData.role_id === roles.low[roles.low.length - 1]) {
        const activity = await prisma.pendingActivity.create({ data: body });

        response.activity.show(activity);
        return;
      }

      const activity = await prisma.activity.create({ data: body });

      response.activity.show(activity);
    } catch (e) {
      console.log(e);
      response.activity.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.activity.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    let filter: any = {};
    if (request.userData.unit_id) {
      const initiatives = await prisma.initiative.findMany({
        where: { unit_id: request.userData.unit_id },
      });
      if (initiatives.length === 0) {
        response.activity.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Initiative not found',
        });
        return;
      }

      const ids = initiatives.map(initiative => initiative.id);
      filter = { id: { in: ids } };
    }

    const queryManager = new QueryManager(request);
    const options = queryManager.build(filter);

    try {
      const activities = await prisma.activity.findMany(options);
      if (activities.length === 0) {
        response.activity.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.activity.many(activities);
    } catch (e) {
      response.activity.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const queryManager = new QueryManager(request);
    const options = queryManager.build({ id: idNum });
    try {
      const activity = await prisma.activity.findFirst(options);
      if (!activity) {
        response.activity.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.activity.show(activity);
    } catch (e) {
      response.activity.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const activity = await prisma.activity.findUnique({
        where: { id: idNum },
      });
      if (!activity) {
        response.activity.error({ type: ErrorType.MISSING_FIELD });
        return;
      }

      if (request.userData.role_id === roles.low[roles.low.length - 1]) {
        const alreadyPending = await prisma.pendingActivity.findFirst({
          where: { activity_id: idNum },
        });
        if (alreadyPending) {
          response.activity.error({ type: ErrorType.ALREADY_CHANGE_REQUEST });
          return;
        }

        const pendingBody = { ...activity, ...request.body };
        const fields = ['id', 'created_at', 'updated_at'];
        fields.forEach(field => delete pendingBody[field]);

        const pending = await prisma.pendingActivity.create({
          data: { ...pendingBody, activity_id: activity.id },
        });

        response.activity.show(pending);
        return;
      }

      const updateActivity = await prisma.activity.update({
        where: { id: idNum },
        data: request.body,
      });

      response.activity.show(updateActivity);
    } catch (e) {
      response.activity.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.activity.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.activity.error(e);
    }
  }

  async getFile(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const activity = await prisma.activity.findFirst({
        where: { id: idNum },
      });
      if (!activity) {
        response.activity.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      if (!activity.file) {
        response.activity.error({ type: ErrorType.EMPTY_FILE });
        return;
      }

      response.activity.file(activity);
    } catch (e) {
      response.activity.error(e);
    }
  }
}

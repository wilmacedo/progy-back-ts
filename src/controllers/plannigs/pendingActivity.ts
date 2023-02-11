import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export default class PendingActivityController {
  async findMany(_: Request, response: Response) {
    try {
      const activities = await prisma.pendingActivity.findMany();
      if (activities.length === 0) {
        response.activity.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Pending activities are empty',
        });
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
    try {
      const activity = await prisma.pendingActivity.findUnique({
        where: { id: idNum },
      });
      if (!activity) {
        response.activity.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Pending activity not found',
        });
        return;
      }

      response.activity.show(activity);
    } catch (e) {
      response.activity.error(e);
    }
  }

  async accept(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const pending = await prisma.pendingActivity.findUnique({
        where: { id: idNum },
      });
      if (!pending) {
        response.activity.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Pending activity not found',
        });
        return;
      }

      const body = { ...pending };
      const fields = ['id', 'activity_id', 'created_at', 'updated_at'];
      fields.forEach(field => delete (body as any)[field]);

      // TODO: Review all flow of review/homologation and updates
      if (!pending.activity_id) {
        const activity = await prisma.activity.create({ data: body });
        await prisma.pendingActivity.delete({ where: { id: idNum } });

        response.activity.show(activity);
        return;
      }

      const updateActivity = await prisma.activity.update({
        where: { id: pending.activity_id },
        data: body,
      });

      response.activity.show(updateActivity);
    } catch (e) {
      response.activity.error(e);
    }
  }

  async decline(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.activity.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.pendingActivity.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.activity.error(e);
    }
  }
}

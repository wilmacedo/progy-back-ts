import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export default class PendingInitiativeController {
  async findMany(_: Request, response: Response) {
    try {
      const initiatives = await prisma.pendingInitiative.findMany();
      if (initiatives.length === 0) {
        response.initiative.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Pending initiatives are empty',
        });
        return;
      }

      response.initiative.many(initiatives);
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
    try {
      const initiative = await prisma.pendingInitiative.findUnique({
        where: { id: idNum },
      });
      if (!initiative) {
        response.initiative.error({
          type: ErrorType.CUSTOM,
          code: 404,
          message: 'Pending initiative not found',
        });
        return;
      }

      response.initiative.show(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }
}

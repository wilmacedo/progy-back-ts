import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export default class PendingInitiativeController {
  async findMany(_: Request, response: Response) {
    try {
      const initiatives = await prisma.pendingInitiative.findMany();
      if (initiatives.length === 0) {
        response.initiative.error({
          type: ErrorType.CUSTOM,
          statusCode: 404,
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
          statusCode: 404,
          message: 'Pending initiative not found',
        });
        return;
      }

      response.initiative.show(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async accept(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const pending = await prisma.pendingInitiative.findUnique({
        where: { id: idNum },
      });
      if (!pending) {
        response.initiative.error({
          type: ErrorType.CUSTOM,
          statusCode: 404,
          message: 'Pending initiative not found',
        });
        return;
      }

      if (!pending.initiative_id) {
        const stage = await prisma.stage.findFirst({
          where: { name: { contains: 'Homologação' } },
        });
        if (!stage) {
          response.initiative.error({
            type: ErrorType.CUSTOM,
            statusCode: 404,
            message: 'Could not find stage "Homologação"',
          });
          return;
        }

        const initiative = await prisma.pendingInitiative.update({
          where: { id: pending.id },
          data: {
            stage_id: stage.id,
          },
        });

        response.initiative.show(initiative);
        return;
      }

      const body = { ...pending };
      const fields = ['id', 'initiative_id', 'created_at', 'updated_at'];
      fields.forEach(field => delete (body as any)[field]);

      const initiative = await prisma.initiative.update({
        where: { id: pending.initiative_id },
        data: body,
      });

      await prisma.pendingInitiative.delete({ where: { id: idNum } });

      response.initiative.show(initiative);
    } catch (e) {
      response.initiative.error(e);
    }
  }

  async decline(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.initiative.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.pendingInitiative.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.initiative.error(e);
    }
  }
}

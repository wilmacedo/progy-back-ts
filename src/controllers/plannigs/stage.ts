import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class StageController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.stage.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.stage.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const stage = await prisma.stage.create({
        data: { ...request.body, planning_id },
      });

      response.stage.show(stage);
    } catch (e) {
      response.stage.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.stage.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const stages = await prisma.stage.findMany({ where: { planning_id } });
      if (stages.length === 0) {
        response.stage.error({ type: ErrorType.EMPTY });
        return;
      }

      response.stage.many(stages);
    } catch (e) {
      response.stage.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.stage.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const stage = await prisma.stage.findUnique({ where: { id: idNum } });
      if (!stage) {
        response.stage.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.stage.show(stage);
    } catch (e) {
      response.stage.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.stage.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateStage = await prisma.stage.update({
        where: { id: idNum },
        data: request.body,
      });

      response.stage.show(updateStage);
    } catch (e) {
      response.stage.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.stage.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.stage.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.stage.error(e);
    }
  }
}

import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class PerspectiveController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.perspective.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.perspective.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const perspective = await prisma.perspective.create({
        data: { ...request.body, planning_id },
      });

      response.perspective.show(perspective);
    } catch (e) {
      response.perspective.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.perspective.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const perspectives = await prisma.perspective.findMany({
        where: { planning_id },
      });
      if (perspectives.length === 0) {
        response.perspective.error({ type: ErrorType.EMPTY });
        return;
      }

      response.perspective.many(perspectives);
    } catch (e) {
      response.perspective.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.perspective.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const perspective = await prisma.perspective.findUnique({
        where: { id: idNum },
      });
      if (!perspective) {
        response.perspective.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.perspective.show(perspective);
    } catch (e) {
      response.perspective.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.perspective.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updatePerspective = await prisma.perspective.update({
        where: { id: idNum },
        data: request.body,
      });

      response.perspective.show(updatePerspective);
    } catch (e) {
      response.perspective.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.perspective.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.perspective.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.perspective.error(e);
    }
  }
}

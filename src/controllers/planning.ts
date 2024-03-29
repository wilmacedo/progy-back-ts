import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { roles } from '../middleware';
import { ErrorType } from '../types';

export class PlanningController {
  async create(request: Request, response: Response) {
    const fields = ['name', 'institution_id'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.planning.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    try {
      const planning = await prisma.planning.create({
        data: request.body,
      });

      response.planning.created(planning);
    } catch (e) {
      response.planning.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    try {
      const options = {
        include: { institution: { select: { name: true } } },
        where: {},
      };
      if (request.userData.role_id !== roles.high[0]) {
        options.where = { institution_id: request.userData.institution_id };
      }

      const plannings = await prisma.planning.findMany(options);
      if (plannings.length === 0) {
        response.planning.error({ type: ErrorType.EMPTY });
        return;
      }

      response.planning.many(plannings);
    } catch (e) {
      response.planning.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.planning.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const planning = await prisma.planning.findUnique({
        where: { id: idNum },
      });
      if (!planning) {
        response.planning.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.planning.show(planning);
    } catch (e) {
      response.planning;
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.planning.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updatePlanning = await prisma.planning.update({
        where: { id: idNum },
        data: request.body,
      });

      response.planning.show(updatePlanning);
    } catch (e) {
      response.planning.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.planning.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.planning.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.planning.error(e);
    }
  }
}

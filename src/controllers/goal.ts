import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export class GoalController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.goal.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.goal.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const goal = await prisma.goal.create({
        data: { ...request.body, planning_id },
      });

      response.goal.show(goal);
    } catch (e) {
      response.goal.error(e);
    }
  }

  async findMany(_: Request, response: Response) {
    try {
      const goals = await prisma.goal.findMany();
      if (goals.length === 0) {
        response.goal.error({ type: ErrorType.EMPTY });
        return;
      }

      response.goal.show(goals);
    } catch (e) {
      response.goal.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.goal.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const goal = await prisma.goal.findUnique({ where: { id: idNum } });
      if (!goal) {
        response.goal.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.goal.show(goal);
    } catch (e) {
      response.goal.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.goal.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateGoal = await prisma.goal.update({
        where: { id: idNum },
        data: request.body,
      });

      response.goal.show(updateGoal);
    } catch (e) {
      response.goal.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.goal.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.goal.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.goal.error(e);
    }
  }
}

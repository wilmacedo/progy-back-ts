import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class StateController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.state.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.state.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const state = await prisma.state.create({
        data: { ...request.body, planning_id },
      });

      response.state.created(state);
    } catch (e) {
      response.state.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.state.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const states = await prisma.state.findMany({ where: { planning_id } });
      if (states.length === 0) {
        response.state.error({ type: ErrorType.EMPTY });
        return;
      }

      response.state.many(states);
    } catch (e) {
      response.state.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.state.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const state = await prisma.state.findUnique({ where: { id: idNum } });
      if (!state) {
        response.state.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.state.show(state);
    } catch (e) {
      response.state.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.state.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateState = await prisma.state.update({
        where: { id: idNum },
        data: request.body,
      });

      response.state.show(updateState);
    } catch (e) {
      response.state.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.state.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.state.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.state.error(e);
    }
  }
}

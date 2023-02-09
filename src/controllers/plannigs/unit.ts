import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class UnitController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.unit.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.unit.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const unit = await prisma.unit.create({
        data: { ...request.body, planning_id },
      });

      response.unit.created(unit);
    } catch (e) {
      response.unit.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.unit.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const units = await prisma.unit.findMany({ where: { planning_id } });
      if (units.length === 0) {
        response.unit.error({ type: ErrorType.EMPTY });
        return;
      }

      response.unit.many(units);
    } catch (e) {
      response.unit.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.unit.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const unit = await prisma.unit.findUnique({ where: { id: idNum } });
      if (!unit) {
        response.unit.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.unit.show(unit);
    } catch (e) {
      response.unit.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.unit.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateUnit = await prisma.unit.update({
        where: { id: idNum },
        data: request.body,
      });

      response.unit.show(updateUnit);
    } catch (e) {
      response.unit.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.unit.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.unit.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.unit.error(e);
    }
  }
}

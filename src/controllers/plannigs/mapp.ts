import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class MappController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.mapp.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.mapp.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const mapp = await prisma.mapp.create({
        data: { ...request.body, planning_id },
      });

      response.mapp.created(mapp);
    } catch (e) {
      response.mapp.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.mapp.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const mapps = await prisma.mapp.findMany({ where: { planning_id } });
      if (mapps.length === 0) {
        response.mapp.error({ type: ErrorType.EMPTY });
        return;
      }

      response.mapp.many(mapps);
    } catch (e) {
      response.mapp.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.mapp.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const mapp = await prisma.mapp.findUnique({ where: { id: idNum } });
      if (!mapp) {
        response.mapp.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.mapp.show(mapp);
    } catch (e) {
      response.mapp.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.mapp.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateMapp = await prisma.mapp.update({
        where: { id: idNum },
        data: request.body,
      });

      response.mapp.show(updateMapp);
    } catch (e) {
      response.mapp.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.mapp.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.mapp.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.mapp.error(e);
    }
  }
}

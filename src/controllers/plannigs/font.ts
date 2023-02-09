import { Request, Response } from 'express';
import { prisma } from '../../database/client';
import { ErrorType } from '../../types';

export class FontController {
  async create(request: Request, response: Response) {
    const fields = ['name', 'code', 'date', 'value', 'otherValue'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.font.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { planning_id } = request;
    if (!planning_id) {
      response.font.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    const data = {
      ...request.body,
      date: new Date(request.body.date),
      planning_id,
      other_value: request.body.otherValue,
    };
    delete data.otherValue;

    try {
      const font = await prisma.font.create({
        data: data,
      });

      response.font.created(font);
    } catch (e) {
      response.font.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const { planning_id } = request;
    if (!planning_id) {
      response.font.error({ type: ErrorType.NOT_FOUND_PLANNING });
      return;
    }

    try {
      const fonts = await prisma.font.findMany({ where: { planning_id } });
      if (fonts.length === 0) {
        response.font.error({ type: ErrorType.EMPTY });
        return;
      }

      response.font.many(fonts);
    } catch (e) {
      response.font.error(e);
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.font.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const font = await prisma.font.findUnique({ where: { id: idNum } });
      if (!font) {
        response.font.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.font.show(font);
    } catch (e) {
      response.font.error(e);
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.font.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateFont = await prisma.font.update({
        where: { id: idNum },
        data: request.body,
      });

      response.font.show(updateFont);
    } catch (e) {
      response.font.error(e);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.font.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.font.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      response.font.error(e);
    }
  }
}

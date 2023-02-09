import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export class Institution {
  async create(request: Request, response: Response) {
    const fields = ['name', 'code'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { name, code } = request.body;

    const institution = await prisma.institution.create({
      data: {
        name,
        code,
      },
    });

    response.institution.show(institution);
  }

  async findMany(_: Request, response: Response) {
    const insitutions = await prisma.institution.findMany();
    if (insitutions.length === 0) {
      response.institution.error({ type: ErrorType.EMPTY });
      return;
    }

    response.institution.many(insitutions);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const institution = await prisma.institution.findUnique({
      where: { id: idNum },
    });
    if (!institution) {
      response.institution.error({ type: ErrorType.NOT_FOUND });
      return;
    }

    response.institution.show(institution);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const updateInstitution = await prisma.institution.update({
      where: { id: idNum },
      data: request.body,
    });

    response.institution.show(updateInstitution);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    await prisma.institution.delete({ where: { id: idNum } });

    response.status(204).json();
  }
}

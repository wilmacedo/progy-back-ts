import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export class InstitutionController {
  async create(request: Request, response: Response) {
    const fields = ['name', 'code'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    try {
      const institution = await prisma.institution.create({
        data: request.body,
      });

      response.institution.show(institution);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.institution.error(e);
      }
    }
  }

  async findMany(_: Request, response: Response) {
    try {
      const insitutions = await prisma.institution.findMany();
      if (insitutions.length === 0) {
        response.institution.error({ type: ErrorType.EMPTY });
        return;
      }

      response.institution.many(insitutions);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.institution.error(e);
      }
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: idNum },
      });
      if (!institution) {
        response.institution.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.institution.show(institution);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.institution.error(e);
      }
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateInstitution = await prisma.institution.update({
        where: { id: idNum },
        data: request.body,
      });

      response.institution.show(updateInstitution);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.institution.error(e);
      }
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.institution.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.institution.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.institution.error(e);
      }
    }
  }
}

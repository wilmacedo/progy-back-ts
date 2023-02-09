import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export class RoleController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    try {
      const role = await prisma.role.create({ data: request.body });

      response.role.show(role);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.role.error(e);
      }
    }
  }

  async findMany(_: Request, response: Response) {
    try {
      const roles = await prisma.role.findMany();
      if (roles.length === 0) {
        response.role.error({ type: ErrorType.EMPTY });
        return;
      }

      response.role.many(roles);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.role.error(e);
      }
    }
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const role = await prisma.role.findUnique({ where: { id: idNum } });
      if (!role) {
        response.role.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.role.show(role);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.role.error(e);
      }
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateRole = await prisma.role.update({
        where: { id: idNum },
        data: request.body,
      });

      response.role.show(updateRole);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.role.error(e);
      }
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.role.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.role.error(e);
      }
    }
  }
}

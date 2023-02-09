import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export interface RoleData {
  id: number;
  name: string;
}

export class RoleController {
  async create(request: Request, response: Response) {
    const fields = ['name'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const { name } = request.body;

    const role = await prisma.role.create({
      data: {
        name,
      },
    });

    response.role.show(role);
  }

  async findMany(_: Request, response: Response) {
    const roles = await prisma.role.findMany();
    if (roles.length === 0) {
      response.role.error({ type: ErrorType.EMPTY });
      return;
    }

    response.role.many(roles);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const role = await prisma.role.findUnique({ where: { id: idNum } });
    if (!role) {
      response.role.error({ type: ErrorType.NOT_FOUND });
      return;
    }

    response.role.show(role);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const updateRole = await prisma.role.update({
      where: { id: idNum },
      data: request.body,
    });

    response.role.show(updateRole);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    await prisma.role.delete({ where: { id: idNum } });

    response.status(204).json();
  }
}

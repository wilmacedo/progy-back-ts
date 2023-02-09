import { Request, Response } from 'express';
import { prisma } from '../database/client';

export class RoleController {
  async create(request: Request, response: Response) {
    const { name } = request.body;

    const role = await prisma.role.create({
      data: {
        name,
      },
    });

    return response.status(200).json(role);
  }

  async findMany(_: Request, response: Response) {
    const roles = await prisma.role.findMany();

    return response.status(200).json(roles);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNum = Number(id);
    const role = await prisma.role.findUnique({ where: { id: idNum } });
    if (!role) {
      response.status(404).json({ error: 'No one role found with this id' });
      return;
    }

    response.status(200).json(role);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNum = Number(id);
    const updateUser = await prisma.role.update({
      where: { id: idNum },
      data: request.body,
    });

    response.status(200).json(updateUser);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNum = Number(id);
    await prisma.role.delete({ where: { id: idNum } });

    response.status(204).json();
  }
}

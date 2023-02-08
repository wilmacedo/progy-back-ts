import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export class RoleController {
  async create(request: Request, response: Response) {
    const { name } = request.body;

    const role = await prismaClient.role.create({
      data: {
        name,
      },
    });

    return response.json(role);
  }

  async findMany(_: Request, response: Response) {
    const roles = await prismaClient.role.findMany();

    return response.json(roles);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNum = Number(id);
    const role = await prismaClient.role.findUnique({ where: { id: idNum } });
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
    const updateUser = await prismaClient.role.update({
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
    await prismaClient.role.delete({ where: { id: idNum } });

    response.status(204).json();
  }
}

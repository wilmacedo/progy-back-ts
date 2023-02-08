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
}

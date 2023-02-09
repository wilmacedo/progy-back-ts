import { Request, Response } from 'express';
import { prisma } from '../database/client';

export class Institution {
  async create(request: Request, response: Response) {
    const { name, code } = request.body;

    const institution = await prisma.institution.create({
      data: {
        name,
        code,
      },
    });

    return response.json(institution);
  }
}

import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export class Institution {
  async create(request: Request, response: Response) {
    const { name, code } = request.body;

    const institution = await prismaClient.institution.create({
      data: {
        name,
        code,
      },
    });

    return response.json(institution);
  }
}

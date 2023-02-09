import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

export class Institution {
  async create(request: Request, response: Response) {
    const fields = ['name', 'code'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.role.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

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

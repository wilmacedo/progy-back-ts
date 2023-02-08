import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export class User {
  async create(request: Request, response: Response) {
    const { name, password, email, institution_id, role_id } = request.body;

    const user = await prismaClient.user.create({
      data: {
        name,
        password,
        email,
        institution_id,
        role_id,
      },
    });

    return response.json(user);
  }
}

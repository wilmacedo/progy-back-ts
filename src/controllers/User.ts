import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export interface UserData {
  id: number;
  name: string;
  email: string;
  role_id: number;
  institution_id: number;
}

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

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNumber = Number(id);

    const user = await prismaClient.user.findUnique({
      where: { id: idNumber },
    });
    if (!user) {
      response.status(400).json({ error: 'No user found for this id' });
      return;
    }

    response.status(200).json(user);
  }
}

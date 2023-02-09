import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import bcrypt from 'bcrypt';

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

    const encryptPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    const user = await prismaClient.user.create({
      data: {
        name,
        password: encryptPassword,
        email,
        institution_id,
        role_id,
      },
    });

    return response.status(200).json(user);
  }

  async findMany(_: Request, response: Response) {
    const users = await prismaClient.user.findMany();

    return response.status(200).json(users);
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

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.status(400).json({ error: 'ID is missing' });
      return;
    }

    const idNum = Number(id);
    const updateUser = await prismaClient.user.update({
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
    await prismaClient.user.delete({ where: { id: idNum } });

    response.status(204).json();
  }
}

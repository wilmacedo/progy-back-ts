import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthData } from '../types/auth';

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

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      response.status(404).json({ error: 'User not found' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      response.status(401).json({ error: 'Password not match' });
      return;
    }

    const userData: AuthData = {
      id: user.id,
      role_id: user.role_id,
      institution_id: user.institution_id,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET as string);

    response.status(200).json({
      role: user.role_id,
      token,
      institution_id: user.institution_id,
      // unit_id: user.unit_id,
    });
  }
}

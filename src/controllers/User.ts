import { Request, Response } from 'express';
import { prisma } from '../database/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthData } from '../types/auth';
import { ErrorType } from '../types';

export interface UserData {
  id: number;
  name: string;
  email: string;
  role_id: number;
  institution_id: number;
}

export class User {
  async create(request: Request, response: Response) {
    const fields = ['name', 'password', 'email', 'institution_id', 'role_id'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const params = request.body;

    const encryptPassword = await bcrypt.hash(
      params.password,
      bcrypt.genSaltSync(10),
    );
    params.password = encryptPassword;

    const user = await prisma.user.create({
      data: params,
    });

    return response.user.show(user);
  }

  async findMany(_: Request, response: Response) {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      response.user.error({ type: ErrorType.EMPTY });
      return;
    }

    return response.user.many(users);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNumber = Number(id);

    const user = await prisma.user.findUnique({
      where: { id: idNumber },
    });
    if (!user) {
      response.user.error({ type: ErrorType.NOT_FOUND });
      return;
    }

    response.user.show(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    const updateUser = await prisma.user.update({
      where: { id: idNum },
      data: request.body,
    });

    response.user.show(updateUser);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    await prisma.user.delete({ where: { id: idNum } });

    response.status(204).json();
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      response.user.error({ type: ErrorType.NOT_FOUND });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      response.user.error({ code: 401, message: 'Password not match' });
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

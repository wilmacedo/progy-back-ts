import { Request, Response } from 'express';
import { prisma } from '../database/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthData } from '../types/auth';
import { ErrorType } from '../types';
import { Prisma } from '@prisma/client';

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

    try {
      const user = await prisma.user.create({
        data: params,
      });

      response.user.show(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async findMany(_: Request, response: Response) {
    const users = await prisma.user.findMany({
      include: {
        institution: { select: { id: true, name: true, code: true } },
      },
    });
    if (users.length === 0) {
      response.user.error({ type: ErrorType.EMPTY });
      return;
    }

    response.user.many(users);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNumber = Number(id);

    try {
      const user = await prisma.user.findUnique({
        where: { id: idNumber },
        include: {
          institution: { select: { id: true, name: true, code: true } },
        },
      });
      if (!user) {
        response.user.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      response.user.show(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      const updateUser = await prisma.user.update({
        where: { id: idNum },
        data: request.body,
      });

      response.user.show(updateUser);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    if (!id) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const idNum = Number(id);
    try {
      await prisma.user.delete({ where: { id: idNum } });

      response.status(204).json();
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async me(request: Request, response: Response) {
    const { id } = request.userData;

    if (isNaN(id)) {
      response.user.error({
        type: ErrorType.CUSTOM,
        code: 400,
        message: 'Invalid token',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      response.user.show(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }

  async updatePassword(request: Request, response: Response) {
    const { id } = request.userData;
    if (!id || isNaN(id)) {
      response.user.error({
        type: ErrorType.CUSTOM,
        code: 400,
        message: 'Invalid token',
      });
      return;
    }

    const { currentPassword, newPassword } = request.body;
    if (!currentPassword || !newPassword) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    if (newPassword.length < 6) {
      response.user.error({
        type: ErrorType.CUSTOM,
        code: 400,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        response.user.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!passwordMatch) {
        response.user.error({
          type: ErrorType.CUSTOM,
          code: 401,
          message: 'Password not match',
        });
        return;
      }

      const encryptPassword = await bcrypt.hash(
        newPassword,
        bcrypt.genSaltSync(10),
      );

      const updateUser = await prisma.user.update({
        where: { id },
        data: {
          password: encryptPassword,
        },
      });

      response.user.show(updateUser);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        response.user.error(e);
      }
    }
  }
}

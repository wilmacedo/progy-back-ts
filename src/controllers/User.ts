import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateMail } from 'utils';
import { prisma } from '../database/client';
import { JobType } from '../jobs/types';
import Queue from '../lib/queue';

import { alias } from '../middleware/roles';
import { ErrorType } from '../types';
import { AuthData } from '../types/auth';
import QueryManager from '../utils/query';

export class User {
  async create(request: Request, response: Response) {
    const fields = ['name', 'password', 'email', 'institution_id', 'role_id'];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const params = request.body;
    try {
      const role = await prisma.role.findUnique({
        where: { id: params.role_id },
      });
      if (!role) {
        response.role.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      const encryptPassword = await bcrypt.hash(
        params.password,
        bcrypt.genSaltSync(10),
      );
      params.password = encryptPassword;

      const hasExist = await prisma.user.findUnique({
        where: { email: params.email },
      });
      if (hasExist) {
        response.user.error({ type: ErrorType.EMAIL_ALREADY_USED });
        return;
      }

      const user = await prisma.user.create({
        data: params,
      });

      await prisma.confirmedEmail.create({
        data: {
          user_id: user.id,
        },
      });

      // Queue.add(JobType.REGISTRATION_ACCOUNT, user);

      response.user.created(user);
    } catch (e) {
      response.user.error(e);
    }
  }

  async findMany(request: Request, response: Response) {
    const queryManager = new QueryManager(request);
    const filter = queryManager.filter();

    try {
      const users = await prisma.user.findMany({
        include: {
          institution: { select: { id: true, name: true, code: true } },
          Role: { select: { name: true } },
        },
        where: filter,
      });
      if (users.length === 0) {
        response.user.error({ type: ErrorType.EMPTY });
        return;
      }

      response.user.many(users);
    } catch (e) {
      response.user.error(e);
    }
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
      response.user.error(e);
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
      response.user.error(e);
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
      response.user.error(e);
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        response.user.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        response.user.error({ code: 401, message: 'Password not match' });
        return;
      }

      const role_id = user.role_id || alias[user.role || ''];

      const userData: AuthData = {
        id: user.id,
        role_id,
        ...(user.institution_id && { institution_id: user.institution_id }),
        ...(user.unit_id && { unit_id: user.unit_id }),
      };
      const token = jwt.sign(userData, process.env.JWT_SECRET as string);

      response.status(200).json({
        data: {
          role_id,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (e) {
      response.user.error(e);
    }
  }

  async me(request: Request, response: Response) {
    const { id } = request.userData;

    if (isNaN(id)) {
      response.user.error({
        type: ErrorType.CUSTOM,
        statusCode: 400,
        message: 'Invalid token',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      response.user.show(user);
    } catch (e) {
      response.user.error(e);
    }
  }

  async updatePassword(request: Request, response: Response) {
    const { id } = request.userData;
    if (!id || isNaN(id)) {
      response.user.error({
        type: ErrorType.CUSTOM,
        statusCode: 400,
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
        statusCode: 400,
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
          statusCode: 401,
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
      response.user.error(e);
    }
  }

  async sendInvite(request: Request, response: Response) {
    const { email, institution_id, role_id } = request.body;
    if (!email || !validateMail(email)) {
      response.user.error({ type: ErrorType.EMAIL_NOT_VALID });
      return;
    }

    if (!institution_id || Number(institution_id) < 1) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    if (!role_id || Number(institution_id) < 1) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      response.user.error({ type: ErrorType.EMAIL_ALREADY_USED });
      return;
    }

    Queue.add(JobType.SEND_INVITE, { email, institution_id, role_id });

    response.status(200).json({ data: 'Successfully sended email' });
  }
}

import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';
import { alias } from './roles';

const permission = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const user = await prisma.user.findUnique({
    where: { id: request.userData.id },
  });
  if (!user) {
    response.user.error({ type: ErrorType.CORRUPTED_TOKEN });
    return;
  }

  const roleId = user.role_id || alias[user.role];

  if (roleId === 4 || roleId === 3) {
    next();
    return;
  }

  if (user.institution_id === request.userData.institution_id) {
    next();
    return;
  }

  response.user.error({ type: ErrorType.PERMISSION });
};

export { permission };

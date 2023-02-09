import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/client';
import { ErrorType } from '../types';

const permission = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const user = await prisma.user.findUnique({
    where: { id: request.userData.id },
  });
  if (!user) {
    response.user.error({ type: ErrorType.NOT_FOUND });
    return;
  }

  if (user.role_id === 4 || user.role_id === 3) {
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

import { NextFunction, Request, Response } from 'express';
import { ErrorType } from '../types';

const verify =
  (roles: number[]) =>
  async (request: Request, response: Response, next: NextFunction) => {
    const { role_id } = request.userData;
    let valid = false;

    roles.forEach(role => {
      if (role === role_id) valid = true;
    });

    if (valid) {
      next();
      return;
    }

    response.user.error({ type: ErrorType.PERMISSION });
  };

export { verify };

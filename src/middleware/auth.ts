import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthData } from '../types/auth';

export class AuthController {
  async verify(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;
    if (!authorization) {
      response.status(401).json({ error: 'Token not provided' });
      return;
    }

    const [, token] = authorization.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      const { id, role_id } = decoded as AuthData;

      if (!id || !role_id) {
        response.status(401).json({ error: 'Error on provided token' });
        return;
      }

      request.userData = decoded as AuthData;

      next();
    } catch (e) {
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}

// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

//   try {
//     let { id, role, institution_id, unit_id } = await promisify(jwt.verify)(
//       token,
//       process.env.SECRET,
//     );

//     if (!id || !role)
//       return response.status(401).json({ error: 'Token not provided' });

//     request.user = { id, role, institution_id, unit_id };

//     next();
//   } catch (error) {
//     return response.status(500).json({ error: 'Internal server error' });
//   }
// };

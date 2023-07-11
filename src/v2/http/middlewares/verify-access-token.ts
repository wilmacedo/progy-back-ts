import { env } from '@/env';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AccessTokenData } from './token-type';

export async function verifyAccessToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(401).json({ message: 'Token not provided' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const decodedData = decoded as AccessTokenData;
    if (typeof decodedData !== 'object') {
      return response.status(401).json({ message: 'Token not provided' });
    }

    request.userData = decodedData;

    next();
  } catch (error) {
    return error;
  }
}

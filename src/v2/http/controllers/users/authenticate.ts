import { env } from '@/env';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { MakeAuthenticateCase } from '@/use-cases/factories/make-authenticate-case';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export async function authenticate(request: Request, response: Response) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = MakeAuthenticateCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const data = {
      id: user.id,
      role_id: user.role_id,
    };

    const accessToken = jwt.sign(data, env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '30d',
    });

    response.cookie('progy@refreshToken', refreshToken, {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      expires,
    });

    response.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return response.status(401).json({ message: error.message });
    }

    return error;
  }
}

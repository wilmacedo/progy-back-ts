import { UserAlreadyExists } from '@/v2/use-cases/errors/user-already-exists-error';
import { MakeRegisterCase } from '@/v2/use-cases/factories/make-register-case';
import { Request, Response } from 'express';
import { z } from 'zod';

export async function register(request: Request, response: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    institution_id: z.number().min(0).optional(),
    role_id: z.number().min(0).optional(),
  });

  const { name, email, password, institution_id, role_id } =
    registerBodySchema.parse(request.body);

  try {
    const registerUseCase = MakeRegisterCase();

    await registerUseCase.execute({
      name,
      email,
      password,
      institution_id,
      role_id,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return response.status(409).json({ message: error.message });
    }

    return error;
  }

  return response.sendStatus(201);
}

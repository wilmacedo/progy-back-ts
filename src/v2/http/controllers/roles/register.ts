import { MakeRegisterRoleCase } from '@/use-cases/factories/make-register-role-case';
import { Request, Response } from 'express';
import { z } from 'zod';

export async function register(request: Request, response: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
  });

  const { name } = registerBodySchema.parse(request.body);

  try {
    const registerRoleUseCase = MakeRegisterRoleCase();

    await registerRoleUseCase.execute({ name });
  } catch (error) {
    return error;
  }

  return response.sendStatus(201);
}

import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { RegisterUserUseCase } from '../user/register';

export function MakeRegisterUserCase() {
  const userRepository = new PrismaUserRepository();
  const registeUserUseCase = new RegisterUserUseCase(userRepository);

  return registeUserUseCase;
}

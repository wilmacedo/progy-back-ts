import { PrismaUserRepository } from '@/v2/repositories/prisma/prisma-user-repository';
import { RegisterUseCase } from '../register';

export function MakeRegisterCase() {
  const userRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(userRepository);

  return registerUseCase;
}

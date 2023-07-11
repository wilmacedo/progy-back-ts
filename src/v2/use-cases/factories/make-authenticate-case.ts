import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { AuthenticateUseCase } from '../user/authenticate';

export function MakeAuthenticateCase() {
  const userRepository = new PrismaUserRepository();
  const authenticateUseCase = new AuthenticateUseCase(userRepository);

  return authenticateUseCase;
}

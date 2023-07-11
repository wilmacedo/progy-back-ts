import { PrismaRoleRepository } from '@/repositories/prisma/prisma-role-repository';
import { RegisterRoleUseCase } from '../role/register';

export function MakeRegisterRoleCase() {
  const roleRepository = new PrismaRoleRepository();
  const registerRoleUseCase = new RegisterRoleUseCase(roleRepository);

  return registerRoleUseCase;
}

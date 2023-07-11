import { RoleRepository } from '@/repositories/RoleRepository';
import { Role } from '@prisma/client';

interface RegisterRoleUseCaseRequest {
  name: string;
}

interface RegisterRoleUseCaseResponse {
  role: Role;
}

export class RegisterRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  async execute({
    name,
  }: RegisterRoleUseCaseRequest): Promise<RegisterRoleUseCaseResponse> {
    const role = await this.roleRepository.create({ name });

    return { role };
  }
}

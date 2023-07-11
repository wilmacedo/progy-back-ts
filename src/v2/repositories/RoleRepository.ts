import { Prisma, Role } from '@prisma/client';

export interface RoleRepository {
  findById(id: number): Promise<Role | null>;
  create(data: Prisma.RoleCreateInput): Promise<Role>;
}

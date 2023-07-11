import { prisma } from '@/lib/prisma';
import { Prisma, Role } from '@prisma/client';
import { RoleRepository } from '../RoleRepository';

export class PrismaRoleRepository implements RoleRepository {
  async findById(id: number): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    return role;
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    const role = await prisma.role.create({ data });

    return role;
  }
}

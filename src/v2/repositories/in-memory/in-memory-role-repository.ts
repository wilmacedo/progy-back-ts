import { Prisma, Role } from '@prisma/client';
import { RoleRepository } from '../RoleRepository';

export class InMemoryRoleRepository implements RoleRepository {
  roles: Role[] = [];

  async findById(id: number): Promise<Role | null> {
    const role = this.roles.find(role => role.id === id);

    return role || null;
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    let id = 1;
    if (this.roles.length > 0) {
      id = this.roles[this.roles.length - 1].id + 1;
    }

    const role: Role = {
      id,
      name: data.name,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.roles.push(role);

    return role;
  }
}

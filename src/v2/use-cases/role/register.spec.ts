import { InMemoryRoleRepository } from '@/repositories/in-memory/in-memory-role-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterRoleUseCase } from './register';

let roleRepository: InMemoryRoleRepository;
let sut: RegisterRoleUseCase;

describe('Register role case', () => {
  beforeEach(() => {
    roleRepository = new InMemoryRoleRepository();
    sut = new RegisterRoleUseCase(roleRepository);
  });

  it('should be able to register an role', async () => {
    const { role } = await sut.execute({
      name: 'Admin',
    });

    expect(role.name).toEqual('Admin');
  });
});

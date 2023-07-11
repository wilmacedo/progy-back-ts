import { compare } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository';
import { UserAlreadyExists } from '../errors/user-already-exists-error';
import { RegisterUserUseCase } from './register';

let userRepository: InMemoryUserRepository;
let sut: RegisterUserUseCase;

describe('Register user case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUserUseCase(userRepository);
  });

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      email: 'wil.macedo.sa@gmail.com',
      name: 'Wil Macedo',
      password: '123456',
    });

    expect(user.id).toEqual(1);
  });

  it('should hash user password on registration', async () => {
    const password = '123456';

    const { user } = await sut.execute({
      email: 'wil.macedo.sa@gmail.com',
      name: 'Wil Macedo',
      password,
    });

    const isHashed = await compare(password, user.password);

    expect(isHashed).toBe(true);
  });

  it('should not be able to register with same email', async () => {
    const email = 'wil.macedo.sa@gmail.com';

    await sut.execute({
      name: 'Wil Macedo',
      email,
      password: '123456',
    });

    expect(
      sut.execute({
        name: 'Wil Macedo',
        email,
        password: '123456',
      }),
    ).rejects.toThrow(UserAlreadyExists);
  });
});

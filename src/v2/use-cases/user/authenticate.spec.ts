import { hash } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { AuthenticateUseCase } from './authenticate';

let userRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe('Register user case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it('should be able to authenticate', async () => {
    await userRepository.create({
      email: 'wil.macedo.sa@gmail.com',
      name: 'Wil Macedo',
      password: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'wil.macedo.sa@gmail.com',
      password: '123456',
    });

    expect(user.email).toEqual('wil.macedo.sa@gmail.com');
  });

  it('should be not able to authenticate with wrong email', async () => {
    await userRepository.create({
      email: 'wil.macedo.sa@gmail.com',
      name: 'Wil Macedo',
      password: await hash('123456', 6),
    });

    expect(
      sut.execute({
        email: 'wil@gmail.com',
        password: '123456',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should be not able to authenticate with wrong password', async () => {
    await userRepository.create({
      email: 'wil.macedo.sa@gmail.com',
      name: 'Wil Macedo',
      password: await hash('123456', 6),
    });

    expect(
      sut.execute({
        email: 'wil.macedo.sa@gmail.com',
        password: '12345',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});

import { UserRepository } from '@/repositories/UserRepository';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}

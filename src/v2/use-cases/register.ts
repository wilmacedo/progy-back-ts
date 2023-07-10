import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { UserAlreadyExists } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  institution_id?: number;
  role_id?: number;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return { user };
  }
}

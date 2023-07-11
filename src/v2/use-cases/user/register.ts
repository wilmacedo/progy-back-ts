import { UserRepository } from '@/repositories/UserRepository';
import { UserAlreadyExists } from '@/use-cases/errors/user-already-exists-error';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

interface RegisterUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  institution_id?: number;
  role_id?: number;
}

interface RegisterUserUseCaseResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
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

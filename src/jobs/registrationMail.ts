import { User } from '@prisma/client';
import { Mail } from '../lib/mail';
import Job from './job';
import { JobType } from './types';

export default class RegistrationMail extends Job<User> {
  constructor() {
    super(JobType.REGISTRATION_ACCOUNT);
  }

  handle(data: User): void {
    const mail = new Mail();
    const { name, email } = data;

    mail.sendMail({
      to: { name, email },
      subject: 'Confirmação de e-mail',
      title: 'Confirme seu e-mail',
      description:
        'Falta pouco! Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.',
      button: 'confirmar',
      link: 'https://localhost:3000',
    });
  }
}

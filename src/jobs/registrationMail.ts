import { User } from '@prisma/client';
import { prisma } from '../database/client';
import { Mail } from '../lib/mail';
import { Cryptograph } from '../utils/cryptograph';
import Job from './job';
import { JobType } from './types';

export default class RegistrationMail extends Job<User> {
  constructor() {
    super(JobType.REGISTRATION_ACCOUNT);
  }

  handle(data: User): void {
    const mail = new Mail();
    const cryptograph = new Cryptograph();
    const { name, email } = data;

    const encrypted = cryptograph.encrypt({ user_id: data.id });
    if (!encrypted) {
      throw new Error('Failed on encrypt registration account data');
    }

    prisma.confirmedEmail.create({ data: { user_id: data.id } }).then(data => {
      console.log(data);
    });

    mail.sendMail({
      to: { name, email },
      subject: 'Confirmação de e-mail',
      title: 'Confirme seu e-mail',
      description:
        'Falta pouco! Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.',
      button: 'confirmar',
      link: 'http://localhost:3333/email/verify?token=' + encrypted,
    });
  }
}

import { User } from '@prisma/client';
import { Mail } from 'lib/mail';
import { Cryptograph } from 'utils/cryptograph';
import Job from './job';
import { JobType } from './types';

export default class SendInviteMail extends Job<User> {
  constructor() {
    super(JobType.SEND_INVITE);
  }

  handle(data: User): void {
    const mail = new Mail();
    const cryptograph = new Cryptograph();
    const { email, institution_id, role_id } = data;

    const date = new Date();
    date.setDate(date.getDate() + 1);

    const encrypted = cryptograph.encrypt({
      email,
      institution_id,
      role_id,
      expiration: date.getTime(),
    });
    if (!encrypted) {
      throw new Error('Failed on encrypt invite data');
    }

    mail.sendMail({
      to: { name: 'Convidado', email },
      subject: 'Convite para participar de um planejamento',
      title: 'Confirme sua participação',
      description:
        'Você foi convidado para participar de um planejamento! Clique no botão abaixo para confirmação seu nome e senha e ative sua conta',
      button: 'participar',
      link: 'http://localhost:3333/email/invite/redirect?token=' + encrypted,
    });
  }
}

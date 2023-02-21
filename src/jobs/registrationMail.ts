import { User } from '@prisma/client';
import { Mail } from '../lib/mail';

interface RegistrationMailProps {
  user: User;
}

const handle = async ({ user }: RegistrationMailProps) => {
  const mail = new Mail();

  mail.sendMail({
    to: {
      name: user.name,
      email: user.email,
    },
    subject: 'Confirmação de e-mail',
    title: 'Confirme seu e-mail',
    description:
      'Falta pouco! Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.',
    button: 'confirmar',
    link: 'https://localhost:3000',
  });
};

export default {
  key: 'RegistrationMail',
  handle,
};

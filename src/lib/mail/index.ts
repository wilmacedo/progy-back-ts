import nodemailer, { Transporter } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import { fileURLToPath } from 'url';
import { SMTP_CONFIG } from '../../config/smtp';

interface MailOptions {
  subject: string;
  to: {
    name: string;
    email: string;
  };
  title: string;
  description: string;
  action?: string;
  link: string;
  button: string;
}

export class Mail {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport(SMTP_CONFIG);
  }

  generateOptions(): hbs.NodemailerExpressHandlebarsOptions {
    return {
      viewEngine: {
        extname: '.html',
        partialsDir: path.resolve('./src/lib/mail/templates'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./src/lib/mail/templates'),
      extName: '.html',
    };
  }

  async sendMail(options: MailOptions) {
    this.transporter.use('compile', hbs(this.generateOptions()));

    const { name, email } = options.to;

    const messageInfo = {
      from: `PROGY <no-reply@progy.com.br>`,
      to: `${name} <${email}>`,
      template: 'index',
      subject: options.subject,
      attachments: [
        {
          filename: 'logo.png',
          path:
            path.dirname(fileURLToPath(import.meta.url)) + '/images/logo.png',
          cid: 'logo',
        },
      ],
      context: { ...options },
    };

    return this.transporter.sendMail(messageInfo);
  }
}

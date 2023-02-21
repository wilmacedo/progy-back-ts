import { config } from 'dotenv';
config();

const SMTP_CONFIG = {
  // service: 'gmail',
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

export { SMTP_CONFIG };

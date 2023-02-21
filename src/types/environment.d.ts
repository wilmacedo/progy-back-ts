declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT?: string;
      JWT_SECRET: string;
      MAIL_USER: string;
      MAIL_PASS: string;
      MAIL_HOST: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};

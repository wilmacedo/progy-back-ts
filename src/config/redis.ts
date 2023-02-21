import { QueueOptions } from 'bull';
import dotenv from 'dotenv';
dotenv.config();

export const redisConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

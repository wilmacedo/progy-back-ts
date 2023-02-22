import Queue from 'bull';
import { redisConfig } from '../config/redis';
import { JobQueue, JobType } from './types';

export default abstract class Job<T> {
  key: JobType;

  constructor(key: JobType) {
    this.key = key;
  }

  abstract handle(data: T): void;

  buildQueue(): JobQueue<T> {
    return {
      bull: new Queue<T>(this.key, redisConfig),
      name: this.key,
      handle: this.handle,
    };
  }
}

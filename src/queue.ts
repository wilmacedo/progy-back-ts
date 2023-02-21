import * as dotenv from 'dotenv';
import Queue from './lib/queue';
dotenv.config();

Queue.process();

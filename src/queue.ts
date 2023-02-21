import * as dotenv from 'dotenv';
import registrationMail from './jobs/registrationMail';
dotenv.config();

import mailQueue from './lib/queue';

mailQueue.process(job => {
  registrationMail.handle(job.data as any);
});

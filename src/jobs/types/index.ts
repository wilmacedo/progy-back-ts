import Queue from 'bull';

export enum JobType {
  REGISTRATION_ACCOUNT = 'RegistrationAccount',
  SEND_INVITE = 'SendInvite',
}

export interface JobQueue<T> {
  bull: Queue.Queue<T>;
  name: JobType;
  handle: (data: T) => void;
}

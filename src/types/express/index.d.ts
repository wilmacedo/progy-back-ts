import { AuthData } from '../auth';

declare global {
  namespace Express {
    interface Request {
      userData: AuthData;
    }
  }
}

export {};

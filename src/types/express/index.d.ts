import { ViewResponse } from '../../views/utils';
import { AuthData } from '../auth';

declare global {
  namespace Express {
    interface Request {
      userData: AuthData;
    }

    interface Response {
      user: ViewResponse;
    }
  }
}

export {};

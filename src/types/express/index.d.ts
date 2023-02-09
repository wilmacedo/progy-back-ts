import { ViewResponse } from '../../views/utils';
import { AuthData } from '../auth';

declare global {
  namespace Express {
    interface Request {
      userData: AuthData;
      planning_id?: number;
    }

    interface Response {
      user: ViewResponse;
      role: ViewResponse;
      institution: ViewResponse;
      goal: ViewResponse;
      planning: ViewResponse;
    }
  }
}

export {};

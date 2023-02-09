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
      form: ViewResponse;
      state: ViewResponse;
      stage: ViewResponse;
      unit: ViewResponse;
      font: ViewResponse;
      perspective: ViewResponse;
      mapp: ViewResponse;
    }
  }
}

export {};

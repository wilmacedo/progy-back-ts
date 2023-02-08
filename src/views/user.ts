import { NextFunction, Request } from 'express';
import { UserData } from '../controllers/User';
import { ResponseView } from '../types';
import { error, ResponseData } from './utils';

const one = (data: UserData): ResponseData<UserData> => {
  return { data };
};

const view = (
  _: Request,
  response: ResponseView<UserData>,
  next: NextFunction,
) => {
  response.view = {
    error: error(response, 'user'),
    created: (data: UserData) => response.status(201).json(one(data)),
    show: (data: UserData) => response.status(200).json(one(data)),
  };

  next();
};

export default view;

import { NextFunction, Request, Response } from 'express';
import { UserData } from '../controllers/user';
import { error, ResponseData } from './utils';

const one = ({
  id,
  name,
  email,
  role_id,
  institution_id,
}: UserData): ResponseData<UserData> => {
  return { data: { id, name, email, role_id, institution_id } };
};

const many = (data: UserData[]) => {
  return { data: data.map(item => one(item).data), total: data.length };
};

const view = (_: Request, response: Response, next: NextFunction) => {
  response.user = {
    error: error(response, 'user'),
    created: (data: UserData) => response.status(201).json(one(data)),
    show: (data: UserData) => response.status(200).json(one(data)),
    many: (data: UserData[]) => response.status(200).json(many(data)),
  };

  next();
};

export default view;

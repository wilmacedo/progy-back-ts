import { NextFunction, Request, Response } from 'express';
import { RoleData } from '../controllers/role';
import { error, ResponseData } from './utils';

const one = ({ id, name }: RoleData): ResponseData<RoleData> => {
  return { data: { id, name } };
};

const many = (data: RoleData[]) => {
  return { data: data.map(item => one(item).data), total: data.length };
};

const view = (_: Request, response: Response, next: NextFunction) => {
  response.role = {
    error: error(response, 'role'),
    created: (data: RoleData) => response.status(201).json(one(data)),
    show: (data: RoleData) => response.status(200).json(one(data)),
    many: (data: RoleData[]) => response.status(200).json(many(data)),
  };

  next();
};

export default view;

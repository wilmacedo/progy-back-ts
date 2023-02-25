import { NextFunction, Request, Response } from 'express';
import { error } from './utils';

export type Models =
  | 'user'
  | 'role'
  | 'institution'
  | 'goal'
  | 'planning'
  | 'state'
  | 'stage'
  | 'unit'
  | 'font'
  | 'perspective'
  | 'mapp'
  | 'initiative'
  | 'activity';

type ViewModels = Models | 'form';

export interface ViewData {
  modelName: ViewModels;
  fields: string[];
}

interface ViewCreatorData extends ViewData {
  request: Request;
  response: Response;
  next: NextFunction;
}

const one = <ModelData>(data: ModelData, fields: string[]) => {
  let item = {};
  fields.forEach(field => {
    const value = data[field as keyof ModelData];
    if (value || value === 0) {
      item = { ...item, ...{ [field]: value } };
    }
  });

  return { data: item };
};

const many = <ModelData>(
  data: ModelData[],
  fields: string[],
  totalPages?: number,
) => {
  return {
    data: data.map(item => one(item, fields).data),
    total: data.length,
    ...(totalPages && { totalPages }),
  };
};

const buffer = <ModelData>(data: ModelData) => ({
  data: {
    file: Buffer.from((data as any).file).toString('base64'),
  },
});

const view = <ModelData>({
  response,
  next,
  modelName,
  fields,
}: ViewCreatorData) => {
  response[modelName] = {
    error: error(response, modelName),
    created: (data: ModelData) => response.status(201).json(one(data, fields)),
    show: (data: ModelData) => response.status(200).json(one(data, fields)),
    many: (data: ModelData[], totalPages?: number) =>
      response.status(200).json(many(data, fields, totalPages)),
    file: (data: ModelData) => response.status(200).json(buffer(data)),
  };

  next();
};

export default view;

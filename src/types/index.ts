import { Response } from 'express';

export enum ErrorType {
  MISSING_FIELD,
  NOT_FOUND,
  NOT_FOUND_PLANNING,
  EMPTY,
  PERMISSION,
  CUSTOM,
}

export interface ResponseError {
  type: ErrorType;
  code?: number;
  message?: string;
}

interface View<ModelData> {
  error: (error: ResponseError) => void;
  created: (data: ModelData) => void;
  show: (data: ModelData) => void;
}

export interface ResponseView<ModelData> extends Response {
  view: View<ModelData>;
}

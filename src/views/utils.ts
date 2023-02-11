import { Response } from 'express';
import { ErrorType, ResponseError } from '../types';
import { capitalize } from '../utils';

export interface ViewResponse {
  error: (error: ResponseError | any) => void;
  created: (data: any) => void;
  show: (data: any) => void;
  many: (data: any) => void;
  file: (data: any) => void;
}

export interface ResponseData<ModelData> {
  data: ModelData | ModelData[];
  total?: number;
}

const error =
  (response: Response, name: string) => (error: ResponseError | any) => {
    const { type } = error;

    if (error.code && typeof error.code !== 'string') {
      response.status(error.code).json({ error: error.message });
      return;
    }

    let code, message;

    if (typeof error.code === 'string') {
      switch (error.code) {
        case 'P2025':
          code = 404;
          message = capitalize(name) + ' not found';
          break;
        default:
          code = 500;
          message = error.message;
      }

      response.status(code).json({ error: message });
    }

    if (error.type === undefined) {
      response.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    switch (type) {
      case ErrorType.MISSING_FIELD:
        code = 400;
        message = 'One or more fields in the body are missing';
        break;
      case ErrorType.NOT_FOUND:
        code = 404;
        message = capitalize(name) + 's not found';
        break;
      case ErrorType.NOT_FOUND_PLANNING:
        code = 404;
        message = 'Planning not found';
        break;
      case ErrorType.EMPTY_FILE:
        code = 404;
        message = 'File is empty';
        break;
      case ErrorType.EMPTY:
        code = 404;
        message = capitalize(name) + 's are empty';
        break;
      case ErrorType.ALREADY_CHANGE_REQUEST:
        code = 406;
        message = capitalize(name) + ' already registed for homologation';
        break;
      case ErrorType.PERMISSION:
        code = 403;
        message = 'Unauthorized request';
        break;
      case ErrorType.CUSTOM:
        code = Number(error.code);
        message = error.message;
        break;
      default:
        code = 500;
        message = error.message;
    }

    response.status(code).json({ error: message });
  };

export { error };

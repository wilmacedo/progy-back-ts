import { Response } from 'express';
import { ErrorType, ResponseError } from '../types';
import { capitalize } from '../utils';

export interface ViewResponse {
  error: (error: ResponseError | any) => void;
  created: (data: any) => void;
  show: (data: any) => void;
  many: (data: any, totalPages?: number) => void;
  file: (data: any) => void;
}

export interface ResponseData<ModelData> {
  data: ModelData | ModelData[];
  total?: number;
}

interface CategoryError {
  [key: number]: ErrorType[];
}

const codeGen = (errorType: ErrorType) => {
  const categories: CategoryError = {
    1: [
      ErrorType.MISSING_FIELD,
      ErrorType.ALREADY_CHANGE_REQUEST,
      ErrorType.EMAIL_ALREADY_USED,
      ErrorType.EMAIL_NOT_VALID,
    ],
    2: [
      ErrorType.NOT_FOUND,
      ErrorType.NOT_FOUND_PLANNING,
      ErrorType.EMPTY_FILE,
      ErrorType.EMPTY,
    ],
    3: [ErrorType.PERMISSION, ErrorType.CORRUPTED_TOKEN],
  };

  for (const key in categories) {
    if (categories[key].includes(errorType)) {
      const index = categories[key].indexOf(errorType);

      return `E${key}0${String(index).padStart(2, '0')}`;
    }
  }
};

const error =
  (response: Response, name: string) => (error: ResponseError | any) => {
    const { type } = error;

    if (error.code && typeof error.code !== 'string') {
      response.status(error.code).json({ error: error.message });
      return;
    }

    let statusCode, message;

    if (typeof error.code === 'string') {
      switch (error.code) {
        case 'P2025':
          statusCode = 404;
          message = capitalize(name) + ' not found';
          break;
        default:
          statusCode = 500;
          message = error.message;
      }

      response.status(statusCode).json({ error: message });
    }

    if (error.type === undefined) {
      response.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    switch (type) {
      case ErrorType.MISSING_FIELD:
        statusCode = 400;
        message = 'One or more fields in the body are missing';
        break;
      case ErrorType.NOT_FOUND:
        statusCode = 404;
        message = capitalize(name) + 's not found';
        break;
      case ErrorType.NOT_FOUND_PLANNING:
        statusCode = 404;
        message = 'Planning not found';
        break;
      case ErrorType.EMPTY_FILE:
        statusCode = 404;
        message = 'File is empty';
        break;
      case ErrorType.EMPTY:
        statusCode = 404;
        message = capitalize(name) + 's are empty';
        break;
      case ErrorType.ALREADY_CHANGE_REQUEST:
        statusCode = 406;
        message = capitalize(name) + ' already registed for homologation';
        break;
      case ErrorType.PERMISSION:
        statusCode = 403;
        message = `Unauthorized request`;
        break;
      case ErrorType.CORRUPTED_TOKEN:
        statusCode = 403;
        message = 'Token expired or corrupted';
        break;
      case ErrorType.EMAIL_ALREADY_USED:
        statusCode = 409;
        message = 'Email already in use';
        break;
      case ErrorType.CUSTOM:
        statusCode = Number(error.statusCode);
        message = error.message;
        break;
      default:
        statusCode = 500;
        message = error.message;
    }

    response.status(statusCode).json({ error: message, code: codeGen(type) });
  };

export { error };

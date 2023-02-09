export enum ErrorType {
  MISSING_FIELD,
  NOT_FOUND,
  NOT_FOUND_PLANNING,
  EMPTY,
  PERMISSION,
  CUSTOM,
}

export interface ResponseError {
  type?: ErrorType;
  code?: number | string;
  message?: string;
}

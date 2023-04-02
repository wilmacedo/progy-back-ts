export enum ErrorType {
  // CATEGORY 1
  MISSING_FIELD,
  ALREADY_CHANGE_REQUEST,
  EMAIL_ALREADY_USED,
  EMAIL_ALREADY_CONFIRMED,
  EMAIL_NOT_VALID,

  // CATEGORY 2
  NOT_FOUND,
  NOT_FOUND_PLANNING,
  EMPTY_FILE,
  EMPTY,

  // CATEGORY 3
  PERMISSION,
  CORRUPTED_TOKEN,

  // NOT CATEGORIZED
  CUSTOM,
}

export interface ResponseError {
  type?: ErrorType;
  statusCode?: number | string;
  message?: string;
  code?: string;
}

export enum ErrorType {
  // CATEGORY 1
  MISSING_FIELD,
  ALREADY_CHANGE_REQUEST,

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

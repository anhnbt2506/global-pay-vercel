import { ErrorResponse } from '@ayp/typings/commons';

export const isErrorResponse = (param: unknown): param is ErrorResponse =>
  param instanceof Object && param.hasOwnProperty('error');

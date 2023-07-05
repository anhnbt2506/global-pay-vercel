import { isValid, parse } from 'date-fns';

export const isDateValid = (value: string): boolean =>
  isValid(parse(value.trim(), 'yyyy-MM-dd', new Date()));

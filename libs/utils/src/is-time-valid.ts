import { isValid, parse } from 'date-fns';

export const isTimeValid = (value: string): boolean =>
  ['HH:mm:ss', 'HH:mm'].some((format) =>
    isValid(parse(value.trim(), format, new Date()))
  );

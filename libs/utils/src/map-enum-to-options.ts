import { Enum } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';

export const mapEnumToOptions = <T extends string | number>(
  enumeration: Enum<unknown>,
  labelPrefix: string
): Option<T>[] =>
  Object.keys(enumeration).map((item) => ({
    id: item as T,
    label: `${labelPrefix}${item}`,
  }));

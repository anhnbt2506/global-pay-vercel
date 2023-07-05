import { Query } from '@ayp/typings/commons';

export const constructDataGridExportParameters = <
  A extends string,
  F extends string,
  S extends string
>({
  filters = [],
  attributes = [],
  sortBy = '',
}: Omit<Query<A, F, S>, 'page' | 'pageSize'>) => ({
  attributes: attributes.join(';'),
  filters: filters.join(';'),
  sortBy,
});

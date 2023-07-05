import { Query } from '@ayp/typings/commons';

export const constructQuery = <
  Q extends string,
  F extends string,
  S extends string
>({
  filters = [],
  attributes = [],
  page,
  pageSize,
  sortBy,
}: Query<Q, F, S>): string =>
  new URLSearchParams({
    page: page?.toString() ?? '',
    pageSize: pageSize?.toString() ?? '',
    attributes: attributes.join(';'),
    filters: filters.join(';'),
    sortBy: sortBy?.toString() ?? '',
  }).toString();

export enum StringOperator {
  // MUI
  CONTAINS = 'contains',
  EQUALS = 'equals',

  // Custom
  NOT_EQUALS = 'notEquals',
}

export enum SingleSelectOperator {
  IS = 'is',
}

export enum DateOperator {
  IS = 'is',
  IS_AFTER = 'after',
  IS_BEFORE = 'before',
}

export type FilterOperator =
  | StringOperator
  | SingleSelectOperator
  | DateOperator;

export type Filter<T extends string> =
  | `${T | `${T}:${string}`},${FilterOperator},${string}`
  | '';

export enum SortByOperator {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortBy<T extends string> =
  | `${T | `${T}:${string}` | `${T}.${string}:${string}`},${SortByOperator}`
  | '';

export type Attribute<A extends string> =
  | A
  | `${A}:${string}`
  | `${A}.${string}:${string}`;

export interface Query<A extends string, F extends string, S extends string> {
  attributes?: Attribute<A>[];
  filters?: Filter<F>[];
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<S>;
}

export interface QueryMeta {
  page: number;
  pageSize: number;
  rowCount: number;
}

export interface RowsState {
  page: number;
  pageSize: number;
}

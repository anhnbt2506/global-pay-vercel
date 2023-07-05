import type { GridFilterModel } from '@mui/x-data-grid';
import { Filter, FilterOperator } from '@ayp/typings/commons';

export const constructFilter = <T extends string>(
  filterModel: GridFilterModel
): Filter<T> => {
  const { field, operator, value } = filterModel.items[0];

  return value || typeof value === 'number'
    ? `${field as T},${operator as FilterOperator},${value}`
    : '';
};

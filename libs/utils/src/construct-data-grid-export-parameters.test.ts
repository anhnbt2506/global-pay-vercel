import { SortByOperator } from '@ayp/typings/commons';

import { constructDataGridExportParameters } from './construct-data-grid-export-parameters';

describe('constructDataGridExportParameters', () => {
  it('should return object match with constructDataGridExportParameters', () => {
    expect(
      constructDataGridExportParameters({
        attributes: ['id', 'name'],
        filters: ['name,contains,Hazard'],
        sortBy: `createdAt,${SortByOperator.DESC}`,
      })
    ).toEqual({
      attributes: 'id;name',
      filters: 'name,contains,Hazard',
      sortBy: `createdAt,${SortByOperator.DESC}`,
    });
  });

  it('should return object which properties is empty', () => {
    expect(constructDataGridExportParameters({})).toEqual({
      attributes: '',
      filters: '',
      sortBy: '',
    });
  });
});

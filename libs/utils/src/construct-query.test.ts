import { SortByOperator } from '@ayp/typings/commons';

import { constructQuery } from './construct-query';

describe('constructQuery', () => {
  it('should return string match with constructQuery', () => {
    expect(
      constructQuery({
        page: 2,
        pageSize: 20,
        attributes: ['id', 'name'],
        filters: ['name,contains,Hazard'],
        sortBy: `createdAt,${SortByOperator.DESC}`,
      })
    ).toEqual(
      'page=2&pageSize=20&attributes=id%3Bname&filters=name%2Ccontains%2CHazard&sortBy=createdAt%2Cdesc'
    );
  });

  it('should return string match with constructQuery', () => {
    expect(constructQuery({})).toEqual(
      'page=&pageSize=&attributes=&filters=&sortBy='
    );
  });
});

import { SingleSelectOperator, StringOperator } from '@ayp/typings/commons';
import { constructFilter } from './construct-filter';

describe('constructFilter', () => {
  it('should return string that match Filter interface', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'name',
            operator: StringOperator.CONTAINS,
            value: 'Hazard',
          },
        ],
      })
    ).toBe('name,contains,Hazard');
  });

  it('should return string that match Filter interface', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'name',
            operator: StringOperator.CONTAINS,
            value: 'Hazard',
          },
          {
            id: 2,
            field: 'address',
            operator: StringOperator.NOT_EQUALS,
            value: 'Ha Noi',
          },
        ],
      })
    ).toBe('name,contains,Hazard');
  });

  it('should return string that matches Filter interface', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'name',
            operator: StringOperator.EQUALS,
            value: 'Salah',
          },
          {
            id: 2,
            field: 'address',
            operator: StringOperator.NOT_EQUALS,
          },
        ],
      })
    ).toBe('name,equals,Salah');
  });

  it('should return string that matches Filter interface', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'isPermitRequired',
            operator: SingleSelectOperator.IS,
            value: 0,
          },
        ],
      })
    ).toBe('isPermitRequired,is,0');
  });

  it('should return empty string', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'name',
            operator: StringOperator.CONTAINS,
          },
        ],
      })
    ).toBe('');
  });

  it('should return empty string', () => {
    expect(
      constructFilter({
        items: [
          {
            id: 1,
            field: 'name',
            operator: StringOperator.CONTAINS,
          },
          {
            id: 2,
            field: 'address',
            operator: StringOperator.NOT_EQUALS,
            value: 'Ha Noi',
          },
        ],
      })
    ).toBe('');
  });
});

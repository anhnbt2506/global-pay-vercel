import { mapFilterObject } from './map-filter-object';

describe('filterObject', () => {
  it('should return correct object for nullish check filter', () => {
    const filterFunction = (value: unknown) => value !== null;
    expect(
      mapFilterObject(
        {
          name: 'name',
          grade: null,
          address: '',
        },
        undefined,
        filterFunction
      )
    ).toEqual({
      name: 'name',
      address: '',
    });
    expect(mapFilterObject({}, undefined, filterFunction)).toEqual({});
  });

  it('should return correct object for empty string check filter', () => {
    const filterFunction = (value: unknown) => value !== '';

    expect(
      mapFilterObject(
        {
          name: 'name',
          grade: null,
          address: '',
        },
        undefined,
        filterFunction
      )
    ).toEqual({
      name: 'name',
      grade: null,
    });
  });

  it('should return correct object when map function given', () => {
    expect(
      mapFilterObject(
        {
          name: 'name',
          grade: null,
          address: '',
        },
        (value) => (value ? value : null)
      )
    ).toEqual({
      name: 'name',
      grade: null,
      address: null,
    });

    expect(
      mapFilterObject(
        {
          name: 'name',
          grade: null,
          address: '',
        },
        (value, key) => (key === 'address' ? 'ADDRESS' : value)
      )
    ).toEqual({
      name: 'name',
      grade: null,
      address: 'ADDRESS',
    });
  });
});

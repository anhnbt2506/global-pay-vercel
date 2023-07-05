import { HireType } from '@ayp/typings/entities';

import { mapEnumToOptions } from './map-enum-to-options';

const HIRE_TYPE_LABEL_PREFIX = 'hire-type:';

describe('mapEnumToOptions', () => {
  it('should return correct mapping for HireType', () => {
    const keys = Object.keys(HireType);
    const options = mapEnumToOptions(HireType, HIRE_TYPE_LABEL_PREFIX);

    expect(options).toHaveLength(keys.length);
    options.forEach((option) => {
      expect(keys).toContain(option.id);
      expect(option.label).toContain(HIRE_TYPE_LABEL_PREFIX);
    });
  });
});

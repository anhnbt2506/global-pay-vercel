export const mapFilterObject = (
  obj: Record<string, unknown>,
  mapFunction?: (value: unknown, key: string) => unknown,
  filterFunction?: (value: unknown, key: string) => boolean
): Record<string, unknown> =>
  Object.keys(obj).reduce((newObj: Record<string, unknown>, key) => {
    const value = mapFunction ? mapFunction(obj[key], key) : obj[key];

    if (filterFunction) {
      if (filterFunction(value, key)) {
        newObj[key] = value;
      }
    } else {
      newObj[key] = value;
    }

    return newObj;
  }, {});

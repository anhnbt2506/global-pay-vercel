export function isTypeOf<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
  properties: string[],
  checkFunc?: () => boolean
): params is T {
  return checkFunc
    ? properties.some((property) => property in params) && checkFunc()
    : properties.some((property) => property in params);
}

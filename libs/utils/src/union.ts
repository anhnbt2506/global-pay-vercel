export const union = <T>(...arr: unknown[]) => [...new Set(arr.flat())] as T;

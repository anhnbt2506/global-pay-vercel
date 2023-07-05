import { TestContext } from 'yup';

export type YupDate = Nullable<Date | undefined>;

export type YupString = Nullable<string | undefined>;

export type YupValue = YupDate | YupString;

export type YupArray<T> = Nullable<T[] | undefined>;

interface YupFrom<T = Record<string, YupValue>> {
  value: T;
}

export interface YupTestContext<T> extends TestContext {
  from: YupFrom<T>[];
}

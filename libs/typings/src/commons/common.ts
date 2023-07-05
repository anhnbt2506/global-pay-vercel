export enum CalendarUnit {
  DAY = 'DAY',
  MONTH = 'MONTH',
}

export type ContextProviderLoading = Partial<{
  featureFlagProvider: boolean;
  hireStatusProvider: boolean;
}>;

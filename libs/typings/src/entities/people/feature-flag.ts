export enum FeatureFlagKey {
  TABLEAU_DASHBOARD = 'TABLEAU_DASHBOARD',
  HIRE_TYPE_POM = 'HIRE_TYPE_POM',
  HELP_CENTER = 'HELP_CENTER',
}

export interface FeatureFlag {
  id: number;
  key: FeatureFlagKey;
  value: boolean;
  description: Nullable<string>;
}

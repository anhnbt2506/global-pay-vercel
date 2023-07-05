import { FeatureFlagKey, Role } from '../entities';

import { MuiIcon } from '.';

export interface Route {
  path: string;
  roles: Role[];
  icon?: MuiIcon;
  label?: string;
  newTab?: boolean;
  children?: Route[];
  featureFlagKey?: FeatureFlagKey;
}

export type DefaultRouteType = {
  company: string;
  staff: string;
  worker: string;
  default: string;
};

import { DefaultRouteType } from '@ayp/typings/commons';

import {
  COMPANY_SIGN_IN,
  ROOT,
  STAFF_SIGN_IN,
  WORKER_SIGN_IN,
} from '@configs/routes';

export const DEFAULT_REDIRECT_ROUTES: DefaultRouteType = {
  company: COMPANY_SIGN_IN.path,
  staff: STAFF_SIGN_IN.path,
  worker: WORKER_SIGN_IN.path,
  default: ROOT.path,
};

import {
  BaseApi as BaseApiMemo,
  BaseErrorResponse,
  Environment,
  isErrorResponse,
} from '@ayp/utils';
import { Stage } from '@ayp/typings/commons';
import { AxiosError } from 'axios';

import { RedirectionError } from '@configs/errors';
import { COMPANY_ONBOARDING, WORKER_ONBOARDING } from '@configs/routes';

const getUrl = (path: string) => {
  let baseUrl = Environment.getGatewayHost();

  if (path.startsWith('/people')) {
    baseUrl = Environment.getPeopleApiHost();
  } else if (path.startsWith('/fintech')) {
    baseUrl = Environment.getFintechApiHost();
  }

  const authPaths = ['/auth/v1/login', '/auth/v1/refresh-token'];

  if (Environment.getStage() === Stage.DEV_LOCAL && !authPaths.includes(path)) {
    baseUrl = `${Environment.getNextAuthUrl()}/api/dev`;
  }

  return `${baseUrl}${path}`;
};

const onHandleError = (
  e: BaseErrorResponse
): Promise<AxiosError<unknown, BaseErrorResponse>> => {
  if (isErrorResponse(e.response?.data)) {
    switch (e.response?.data.error.name) {
      case 'ForceOnboardCompany':
        if (typeof window === 'undefined') {
          return Promise.reject(new RedirectionError(COMPANY_ONBOARDING.path));
        } else {
          window.location.href = COMPANY_ONBOARDING.path;
        }
      case 'ForceOnboardEmployment':
        if (typeof window === 'undefined') {
          return Promise.reject(new RedirectionError(WORKER_ONBOARDING.path));
        } else {
          window.location.href = WORKER_ONBOARDING.path;
        }
      default:
        return Promise.reject(e.response?.data);
    }
  }

  return Promise.reject(e);
};

export const BaseApi = BaseApiMemo(getUrl, onHandleError);

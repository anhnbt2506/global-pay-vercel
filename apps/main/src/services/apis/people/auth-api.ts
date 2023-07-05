import { UserContext } from '@ayp/typings/commons';

import { BaseApi } from '@utils';

export interface AuthRegisterRequest {
  type: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown;
}

interface AuthRegisterResponse {
  cognitoId: string;
}

interface AuthLoginRequest {
  email: string;
  password: string;
}

interface AuthLoginResponse {
  expires: string;
  accessToken: string;
  refreshToken: string;
  authorization: string;
  contextCompanyId: string;
  user: {
    role: string;
    email: string;
    cognitoId: string;
    firstName: string;
    lastName: string;
    userContexts: UserContext[];
  };
}

interface AuthRefreshTokenRequest {
  refreshToken: string;
}

type AuthRefreshTokenResponse = Omit<AuthLoginResponse, 'refreshToken'>;

interface AuthCheckEmailResponse {
  email: string;
  hasSetPassword: boolean;
  isEmailAllowedToLogin: boolean;
  isEmailVerified: boolean;
}

interface AuthSetPasswordRequest {
  email: string;
  password: string;
  type: string;
}

interface AuthSetPasswordResponse {
  email: string;
  hasSetPassword: boolean;
}

interface AuthVerifyEmailRequest {
  type: 'staff' | 'worker' | 'company';
  verificationCode: string;
}

interface AuthVerifyEmailResponse {
  isEmailVerified: boolean;
  hasSetPassword: boolean;
  email: string;
}

export const AuthApi = {
  register: async (body: AuthRegisterRequest): Promise<AuthRegisterResponse> =>
    BaseApi.post({
      path: `/people/v1/auth/register`,
      body,
    }),
  login: async (body: AuthLoginRequest): Promise<AuthLoginResponse> =>
    BaseApi.post({
      path: '/auth/v1/login',
      body,
    }),
  refreshToken: async (
    body: AuthRefreshTokenRequest
  ): Promise<AuthRefreshTokenResponse> =>
    BaseApi.post({
      path: '/auth/v1/refresh-token',
      body,
    }),
  checkEmail: async (body: {
    email: string;
    type: string;
  }): Promise<AuthCheckEmailResponse> =>
    BaseApi.post({
      path: '/people/v1/auth/check-email',
      body,
    }),
  setPassword: async (
    body: AuthSetPasswordRequest
  ): Promise<AuthSetPasswordResponse> =>
    BaseApi.post({
      path: '/people/v1/auth/set-password',
      body,
    }),
  verifyEmail: async (
    body: AuthVerifyEmailRequest
  ): Promise<AuthVerifyEmailResponse> =>
    BaseApi.post({
      path: '/people/v1/auth/verify',
      body,
    }),
};

import * as nookies from 'nookies';
import * as react from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

import { getServerSideSession } from './get-server-side-session';

jest.mock('next-auth/react');
jest.mock('nookies');

describe('getServerSideSession', () => {
  it('should return object that assigned session and cookie', async () => {
    const mockSession = {
      user: {
        email: 'jack.le@sotatek.com',
        cognitoId: '700e7bf6-2178-4029-989f-7200228c51d9',
        firstName: 'Jack',
        lastName: 'Le',
        role: 'gp:company:owner',
      },
      expires: '2022-08-03T05:03:53.497Z',
      authorization: 'authorization',
      accessToken: 'accessToken',
      contextCompanyId: '2ik8l0bfljippa7s',
      refreshToken: 'refreshToken',
      iat: 1659350693,
      exp: 1661942693,
      jti: '8e1f7fed-cb0a-41c2-a11b-ce5d8f880cd6',
      cookie: 'cookie',
    };

    (nookies.parseCookies as jest.Mock).mockReturnValueOnce({
      cookie: 'cookie',
    });

    (react.getSession as jest.Mock).mockReturnValueOnce({
      user: {
        email: 'jack.le@sotatek.com',
        cognitoId: '700e7bf6-2178-4029-989f-7200228c51d9',
        firstName: 'Jack',
        lastName: 'Le',
        role: 'gp:company:owner',
      },
      expires: '2022-08-03T05:03:53.497Z',
      authorization: 'authorization',
      accessToken: 'accessToken',
      contextCompanyId: '2ik8l0bfljippa7s',
      refreshToken: 'refreshToken',
      iat: 1659350693,
      exp: 1661942693,
      jti: '8e1f7fed-cb0a-41c2-a11b-ce5d8f880cd6',
    });

    const context = {
      req: {},
      query: {},
      resolvedUrl: '/company/dashboard',
      locales: ['en', 'id'],
      locale: 'en',
      defaultLocale: 'en',
    } as GetServerSidePropsContext;

    expect(await getServerSideSession(context)).toEqual(mockSession);
  });
});

import { UserPayload } from '@ayp/typings/commons';
import { UserType } from '@ayp/typings/entities';
import { generateCsp } from '@ayp/utils/generate-csp';
import { getDefaultRedirectRoute } from '@ayp/utils/get-default-redirect-route';
import { getRouteRoles } from '@ayp/utils/get-route-roles';
import { isUserPermitted } from '@ayp/utils/is-user-permitted';
import type { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse } from 'next/server';

import { DEFAULT_REDIRECT_ROUTES } from '@configs/constants/default-redirect-routes';
import {
  CompanyRoutes,
  COMPANY_DASHBOARD,
  COMPANY_ROOT,
  COMPANY_SIGN_IN,
  COMPANY_SIGN_UP,
  StaffRoutes,
  STAFF_HOME,
  STAFF_ROOT,
  STAFF_SIGN_IN,
  WorkerRoutes,
  WORKER_HOME,
  WORKER_ROOT,
  WORKER_SIGN_IN,
} from '@configs/routes';

const handler = async (
  response: NextResponse,
  url: NextURL,
  token: Nullable<JWT>,
  userType: UserType,
  homePath: string,
  signInPath: string,
  signUpPath: Nullable<string>,
  hiddenPaths: Nullable<string[]>
) => {
  if (hiddenPaths?.includes(url.pathname)) {
    url.pathname = homePath;

    return NextResponse.redirect(url);
  }

  if (url.pathname === signInPath || url.pathname === signUpPath) {
    if (token) {
      url.pathname = homePath;

      return NextResponse.redirect(url);
    }
    return response;
  }

  if (!token) {
    const newUrl = new NextURL(signInPath, url.origin);

    if (url.searchParams.get('ga')) {
      newUrl.searchParams.set('ga', `${url.searchParams.get('ga')}`);
    }
    url.searchParams.delete('ga');

    newUrl.searchParams.set('redirect', `${url.pathname}${url.search}`);

    return NextResponse.redirect(newUrl);
  }

  const user = token.user as UserPayload;

  const role = user?.selectedUserContext?.role;

  if (
    !isUserPermitted(
      getRouteRoles(
        url.pathname,
        userType,
        CompanyRoutes,
        StaffRoutes,
        WorkerRoutes
      ),
      role
    )
  ) {
    url.pathname = getDefaultRedirectRoute(DEFAULT_REDIRECT_ROUTES, role);

    return NextResponse.redirect(url);
  }

  return response;
};

export default withAuth(
  (req) => {
    const { token } = req.nextauth;
    const url = req.nextUrl.clone();

    const response = NextResponse.next();
    const xRequestId = self.crypto.randomUUID();
    const nonce = `'nonce-${xRequestId}'`;

    response.headers.set('x-request-id', xRequestId);
    response.headers.set(
      'Content-Security-Policy',
      generateCsp({
        scriptSrcElem: [nonce],
      })
    );

    if (url.pathname.startsWith('/api')) {
      return response;
    }

    if (url.pathname.startsWith(STAFF_ROOT.path))
      return handler(
        response,
        url,
        token,
        UserType.STAFF,
        STAFF_HOME.path,
        STAFF_SIGN_IN.path,
        null,
        [STAFF_ROOT.path]
      );

    if (url.pathname.startsWith(COMPANY_ROOT.path))
      return handler(
        response,
        url,
        token,
        UserType.COMPANY,
        COMPANY_DASHBOARD.path,
        COMPANY_SIGN_IN.path,
        COMPANY_SIGN_UP.path,
        [COMPANY_ROOT.path]
      );

    if (url.pathname.startsWith(WORKER_ROOT.path))
      return handler(
        response,
        url,
        token,
        UserType.WORKER,
        WORKER_HOME.path,
        WORKER_SIGN_IN.path,
        null,
        null
      );

    return response;
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

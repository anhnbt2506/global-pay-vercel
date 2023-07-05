/* istanbul ignore file */
// This api is for authentication, skip for the test as many things handled by the NextAuth.

import { SelectedUserContext, Stage, UserSession } from '@ayp/typings/commons';
import { Role } from '@ayp/typings/entities';
import { Environment, isTypeOf, isUserPermitted } from '@ayp/utils';
import { getTime } from 'date-fns';
import { writeFileSync } from 'fs';
import NextAuth, {
  CallbacksOptions,
  NextAuthOptions,
  Session,
  User,
} from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Provider } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';

import {
  devSessionFilePath,
  TRIGGER_REFRESH_ACCESS_TOKEN_TIMEOUT,
} from '@configs/constants';
import { AuthApi, CompanyApi, WorkerUserApi } from '@services/apis/people';

const providers: Provider[] = [
  CredentialsProvider({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      if (!credentials) return null;

      const { email, password } = credentials;

      try {
        const user = await AuthApi.login({ email, password });

        if (!user) {
          throw new Error('Unauthorized');
        }

        return user as unknown as User;
      } catch (e) {
        console.log(e);

        return null;
      }
    },
  }),
];

const refreshAccessToken = async (token: JWT) => {
  try {
    const user = await AuthApi.refreshToken({
      refreshToken: token.refreshToken as string,
    });

    return {
      ...token,
      expires: user.expires,
      accessToken: user.accessToken,
      authorization: user.authorization,
    };
  } catch (e) {
    console.log(e);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

const callbacks: Partial<CallbacksOptions> = {
  jwt: async ({ token, user: adapterUser, trigger, session }) => {
    const user = adapterUser as unknown as { user: User } & Record<
      string,
      string
    >;
    if (trigger === 'update') {
      if (
        session &&
        isTypeOf<SelectedUserContext>(session, ['userContextId', 'role'])
      ) {
        token['user'] = Object.assign({}, token['user'], {
          selectedUserContext: session,
        });
      }

      if (
        typeof token?.expires === 'string' &&
        getTime(new Date(token?.expires)) - getTime(new Date()) >
          TRIGGER_REFRESH_ACCESS_TOKEN_TIMEOUT
      ) {
        return token;
      }

      return refreshAccessToken(token);
    }

    if (new Date().toISOString() > (token?.expires as string)) {
      return refreshAccessToken(token);
    }

    if (trigger !== 'signIn') return token;

    const selectedUserContext = user.user.userContexts[0];

    if (user) {
      Object.keys(user).forEach((key) => {
        if (key === 'user') {
          token['user'] = Object.assign({}, user.user, {
            selectedUserContext,
          });
        } else {
          token[key] = user[key];
        }
      });
    }

    if (selectedUserContext) {
      if (isUserPermitted([Role.GP_COMPANY], selectedUserContext.role)) {
        const { company } = await CompanyApi.get(
          token as unknown as UserSession
        );

        if (!!company.companyId) {
          token['user'] = Object.assign({}, user.user, {
            selectedUserContext: Object.assign({}, selectedUserContext, {
              contextCompanyName: company.name,
              contextCompanyId: company.companyId,
            }),
          });
        }

        return token;
      }

      if (isUserPermitted([Role.GP_WORKER], selectedUserContext.role)) {
        const { companies } = await WorkerUserApi.getEmploymentCompanies(
          token as unknown as UserSession
        );

        const workerCompany = companies.find(
          ({ userContextId }) =>
            userContextId === selectedUserContext.userContextId
        );

        token['user'] = Object.assign({}, user.user, {
          selectedUserContext: Object.assign({}, selectedUserContext, {
            contextCompanyName: workerCompany
              ? workerCompany.companyName
              : undefined,
            contextEmploymentId: workerCompany
              ? workerCompany.employmentId
              : undefined,
          }),
        });

        return token;
      }
    }

    return token;
  },
  session: async ({ token }) => {
    if (Environment.getStage() === Stage.DEV_LOCAL) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selectedUserContext, userContexts, ...user } = Object.assign(
        {},
        token['user']
      ) as User;

      writeFileSync(
        devSessionFilePath,
        JSON.stringify({
          user: Buffer.from(
            JSON.stringify({
              ...user,
              role: selectedUserContext.role,
              userContextId: selectedUserContext.userContextId,
            }),
            'utf8'
          ).toString('base64'),
        }),
        'utf-8'
      );
    }

    return token as unknown as Session;
  },
};

export const authOptions: NextAuthOptions = {
  secret: Environment.getNextAuthSecret(),
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
    newUser: '/',
  },
  providers,
  callbacks,
};

export default NextAuth(authOptions);

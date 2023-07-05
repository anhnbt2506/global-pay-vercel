import {
  RouteChangeComplete,
  RouteChangeError,
  RouteChangeStart,
} from '@ayp/typings/commons';
import { Role } from '@ayp/typings/entities';
import { Userpilot } from '@ayp/userpilot';
import {
  customSignOut,
  fireGtmEvent,
  getDefaultRedirectRoute,
} from '@ayp/utils';
import Hotjar from '@hotjar/browser';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  useMediaQuery,
} from '@mui/material';
import type { NextComponentType, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import { TFunction, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_REDIRECT_ROUTES,
  TRIGGER_REFRESH_ACCESS_TOKEN_TIMEOUT,
} from '@configs/constants';
import { useSessionCookies } from '@hooks';
import { light } from '@themes';

import { Loading } from '..';

interface AuthGuardProps {
  pageProps: Record<string, unknown>;
  Component: NextComponentType<
    NextPageContext,
    unknown,
    Record<string, unknown>
  >;
}

/* istanbul ignore next */
// this case cannot be reproduced because it takes a long time to trigger
const ForceLoginDialog: FC<{ t: TFunction; role: Role }> = ({ t, role }) => (
  <Dialog open fullWidth maxWidth="sm">
    <DialogContent
      sx={{
        padding: '2rem',
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        marginY="1rem"
        sx={{ flexDirection: 'column' }}
      >
        <Typography variant="h5" textAlign="center">
          {t('forceLoginDialog.title')}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          {t('forceLoginDialog.description')}
        </Typography>
      </Box>
      <Box
        sx={(theme) => ({
          marginTop: '1rem',
          gap: '2rem',
          display: 'flex',
          justifyContent: 'center',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
          },
        })}
      >
        <Button
          variant="contained"
          onClick={() =>
            customSignOut({
              callbackUrl: getDefaultRedirectRoute(
                DEFAULT_REDIRECT_ROUTES,
                role
              ),
            })
          }
        >
          {t('login')}
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

export const AuthGuard: FC<AuthGuardProps> = ({ Component, pageProps }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const sessionCookies = useSessionCookies();
  const { update: updateAccessToken } = useSession();
  const [loading, setLoading] = useState(true);
  const [forceLogin, setForceLogin] = useState(false);

  const isDesktop = useMediaQuery<typeof light>((theme) =>
    theme.breakpoints.up('lg')
  );
  const previousPathnameRef = useRef(router.pathname);
  const interval = useRef<Nullable<NodeJS.Timeout>>(null);

  const removeQueryParam = useCallback(
    (param: string) => {
      const { pathname, query } = router;
      const params = new URLSearchParams(query as Record<string, string>);

      params.delete(param);
      router.replace({ pathname, query: params.toString() }, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  const isPathnameChanged = (url: string) => {
    const pathname = url.split('?')[0];

    return previousPathnameRef.current !== pathname;
  };

  const updatePreviousPath = useCallback((url: string) => {
    if (!isPathnameChanged(url)) return;

    previousPathnameRef.current = url.split('?')[0];
  }, []);

  useEffect(() => {
    const onLoadStart: RouteChangeStart = (url, { shallow }) => {
      if (!isPathnameChanged(url) && shallow) return;

      setLoading(true);
    };

    const onLoadComplete: RouteChangeComplete = (url, { shallow }) => {
      if (!isPathnameChanged(url) && shallow) return;

      updatePreviousPath(url);
      setLoading(false);
      Userpilot.reload();
    };

    const onLoadError: RouteChangeError = (_error, url, { shallow }) =>
      onLoadComplete(url, { shallow });

    router.events.on('routeChangeStart', onLoadStart);
    router.events.on('routeChangeError', onLoadError);
    router.events.on('routeChangeComplete', onLoadComplete);

    return () => {
      router.events.off('routeChangeStart', onLoadStart);
      router.events.off('routeChangeError', onLoadError);
      router.events.off('routeChangeComplete', onLoadComplete);
    };
  }, [router, updatePreviousPath]);

  useEffect(() => {
    if (sessionCookies.status !== 'loading') {
      if (sessionCookies.session.user) {
        const {
          cognitoId,
          selectedUserContext: { role, contextCompanyName },
          email,
          firstName,
          lastName,
        } = sessionCookies.session.user;

        fireGtmEvent(
          Object.assign<Record<string, string>, Record<string, string>>(
            {
              user_id: cognitoId,
              user_role: role,
              user_email: email,
              user_first_name: firstName,
              user_last_name: lastName,
            },
            contextCompanyName ? { user_company_name: contextCompanyName } : {}
          )
        );

        const userInfo = Object.assign<
          Record<string, string>,
          Record<string, string>
        >(
          {
            role,
            userId: cognitoId,
            email,
            firstName,
            lastName,
          },
          contextCompanyName ? { companyName: contextCompanyName } : {}
        );

        Hotjar.identify(cognitoId, userInfo);
        Userpilot.identify(cognitoId, userInfo);
      }

      setLoading(false);
    }
  }, [sessionCookies.status, sessionCookies.session.user]);

  useEffect(() => {
    if (!router.query.ga || typeof router.query.ga !== 'string') return;

    fireGtmEvent<string>({
      event: router.query.ga,
    });
    removeQueryParam('ga');
  }, [router.query.ga, removeQueryParam]);

  /* istanbul ignore next */
  // this case cannot be reproduced because it takes a long time to trigger
  useEffect(() => {
    if (sessionCookies.session?.error === 'RefreshAccessTokenError') {
      if (interval.current) {
        setForceLogin(true);
      } else {
        customSignOut({
          callbackUrl: getDefaultRedirectRoute(
            DEFAULT_REDIRECT_ROUTES,
            sessionCookies.session.user.selectedUserContext.role
          ),
        });
      }
      return;
    }

    if (interval.current) return;
    (async () => await updateAccessToken())();

    interval.current = setInterval(async () => {
      await updateAccessToken();
    }, TRIGGER_REFRESH_ACCESS_TOKEN_TIMEOUT);
  }, [
    updateAccessToken,
    sessionCookies.session?.error,
    sessionCookies.session?.user?.selectedUserContext.role,
  ]);

  if (loading) return <Loading />;

  return (
    <Box>
      {
        /* istanbul ignore next */
        // this case cannot be reproduced because it takes a long time to trigger
        forceLogin && (
          <ForceLoginDialog
            t={t}
            role={sessionCookies.session.user.selectedUserContext.role}
          />
        )
      }
      <Component
        isDesktop={isDesktop}
        session={sessionCookies.session}
        {...pageProps}
      />
    </Box>
  );
};

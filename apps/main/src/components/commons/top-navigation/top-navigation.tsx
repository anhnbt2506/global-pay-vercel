import { HireStatus } from '@ayp/typings/entities';
import {
  customSignOut,
  fireGtmEvent,
  getDefaultRedirectRoute,
} from '@ayp/utils';
import { ExitToApp, Menu as MenuIcon, Person } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, PropsWithChildren, useMemo, useState } from 'react';

import { AnchorMenu } from '@components/ui';
import {
  DEFAULT_REDIRECT_ROUTES,
  TOP_NAVIGIATION_HEIGHT,
} from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { useHireStatus, useSessionCookies } from '@hooks';

import { WorkerCustom } from './worker-custom';

const DRAWER_Z_INDEX = 1200;

const MobileTopNavigation: FC<
  PropsWithChildren<{
    onClick: VoidFunction;
    dataTestId?: string;
  }>
> = ({ onClick, children, dataTestId }) => (
  <Toolbar
    sx={{
      display: {
        xs: 'flex',
        lg: 'none',
      },
      alignItems: 'center',
      backgroundColor: 'white',
      boxShadow: (theme) => theme.palette.customs.boxShadow,
    }}
  >
    <IconButton
      edge="start"
      onClick={onClick}
      sx={{
        mr: 2,
      }}
      data-testid={`${dataTestId}-iconButton`}
    >
      <MenuIcon />
    </IconButton>
    {children}
  </Toolbar>
);

const DesktopTopNavigation: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Toolbar
    sx={{
      display: {
        xs: 'none',
        lg: 'flex',
      },
      paddingY: '1rem',
      backgroundColor: 'white',
      boxShadow: (theme) => theme.palette.customs.boxShadow,
    }}
  >
    {children}
  </Toolbar>
);

interface TopNavigationProps {
  isDesktop: boolean;
  onClick: VoidFunction;
  dataTestId?: string;
}

export enum TopNavigationAnchorId {
  NOTIFICATIONS,
  LOGOUT,
}

export const TopNavigation: FC<TopNavigationProps> = ({
  onClick,
  isDesktop,
  dataTestId,
}) => {
  const { t } = useTranslation('common');
  const { hireStatus } = useHireStatus();
  const { session } = useSessionCookies();
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] =
    useState<Nullable<TopNavigationAnchorId>>(null);

  const onHandleClick =
    (idElement: TopNavigationAnchorId) =>
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const customTopNavigation = useMemo(() => {
    if (session && hireStatus === HireStatus.CONTRACT_ACCEPTANCE) {
      return (
        <WorkerCustom
          anchorEl={anchorEl}
          idElement={idElement}
          setAnchorEl={setAnchorEl}
          onHandleClick={onHandleClick}
          dataTestId={`${dataTestId}-workerCustom`}
        />
      );
    }

    return <></>;
  }, [anchorEl, hireStatus, idElement, session, dataTestId]);

  const children = (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        {isDesktop && (
          <>
            <Typography color="black" data-testid={`${dataTestId}-userName`}>
              {t('topNavigation.welcomeBack', {
                name: `${session?.user.firstName} ${session?.user.lastName}`,
              })}
            </Typography>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {customTopNavigation}
        <IconButton
          edge="end"
          onClick={onHandleClick(TopNavigationAnchorId.LOGOUT)}
          data-testid={`${dataTestId}-iconButton`}
        >
          <Avatar>
            <Person />
          </Avatar>
        </IconButton>
        <AnchorMenu
          open={!!anchorEl && idElement === TopNavigationAnchorId.LOGOUT}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        >
          <MenuItem
            data-testid={`${dataTestId}-signOut`}
            onClick={() => {
              const role = session?.user?.selectedUserContext?.role;

              fireGtmEvent<GTM_EVENTS>({
                event: role.includes('worker')
                  ? GTM_EVENTS.WORKER_PORTAL_LOGOUT
                  : role.includes('company')
                  ? GTM_EVENTS.CLIENT_PORTAL_LOGOUT
                  : GTM_EVENTS.STAFF_PORTAL_LOGOUT,
              });
              customSignOut({
                callbackUrl: getDefaultRedirectRoute(
                  DEFAULT_REDIRECT_ROUTES,
                  role
                ),
              });
            }}
          >
            <ExitToApp fontSize="small" color="primary" />
            <Typography marginLeft="0.5rem">
              {t('topNavigation.logout')}
            </Typography>
          </MenuItem>
        </AnchorMenu>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 'none',
        backgroundColor: 'transparent',
        height: `${TOP_NAVIGIATION_HEIGHT}rem`,
        zIndex: isDesktop ? DRAWER_Z_INDEX + 1 : 0,
      }}
    >
      {isDesktop ? (
        <DesktopTopNavigation>{children}</DesktopTopNavigation>
      ) : (
        <MobileTopNavigation
          onClick={onClick}
          dataTestId={`${dataTestId}-mobileTopNavigation`}
        >
          {children}
        </MobileTopNavigation>
      )}
    </AppBar>
  );
};

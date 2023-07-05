import { AppBar, Box, Grid, SxProps, Toolbar } from '@mui/material';
import Image from 'next/image';
import { FC, PropsWithChildren, ReactNode } from 'react';

import { GlobalPayLogo } from '@assets/shared';
import { useSessionCookies } from '@hooks';
import { DefaultTopNavigationItem } from '@components/commons';

export const SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE = 5;
export const SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP = 4;

interface TopNavigationProps {
  topNavigationItem?: ReactNode;
  dataTestId?: string;
}

const TopNavigation: FC<TopNavigationProps> = ({
  topNavigationItem,
  dataTestId,
}) => {
  const { status } = useSessionCookies();

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <Toolbar
        sx={{
          display: {
            xs: 'flex',
            lg: 'none',
          },
          alignItems: 'center',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          boxShadow: (theme) => theme.palette.customs.boxShadow,
        }}
      >
        <Image
          width={64}
          height={64}
          src={GlobalPayLogo}
          alt="ayp-logo-with-slogan"
        />
        {status === 'authenticated' ? (
          topNavigationItem ? (
            topNavigationItem
          ) : (
            <DefaultTopNavigationItem />
          )
        ) : (
          <></>
        )}
      </Toolbar>
      <Box
        sx={{
          display: {
            xs: 'none',
            lg: 'flex',
          },
          marginTop: '0.5rem',
          marginRight: '2rem',
          justifyContent: 'flex-end',
        }}
      >
        {status === 'authenticated' ? (
          topNavigationItem ? (
            topNavigationItem
          ) : (
            <DefaultTopNavigationItem dataTestId={dataTestId} />
          )
        ) : (
          <></>
        )}
      </Box>
    </AppBar>
  );
};

interface SecondaryAppLayoutProps {
  isDesktop: boolean;
  sx?: SxProps;
  secondarySidebar: ReactNode;
  topNavigationItem?: ReactNode;
  dataTestId?: string;
}

export const SecondaryAppLayout: FC<
  PropsWithChildren<SecondaryAppLayoutProps>
> = ({
  sx,
  children,
  isDesktop,
  secondarySidebar,
  topNavigationItem,
  dataTestId,
}) => {
  return (
    <Grid
      container
      sx={{
        height: '100vh',
      }}
    >
      <Grid
        item
        lg={3}
        display={{
          xs: 'none',
          lg: 'block',
        }}
        sx={{
          backgroundColor: 'white',
        }}
      >
        {secondarySidebar}
      </Grid>
      <TopNavigation
        topNavigationItem={topNavigationItem}
        dataTestId={`${dataTestId}-topNavigation`}
      />
      <Grid item xs={12} lg={9}>
        <Box
          sx={{
            minHeight: `${
              isDesktop
                ? SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP
                : SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE
            }rem`,
            ...sx,
          }}
        />
        {children}
      </Grid>
    </Grid>
  );
};

import { Box, SxProps, Typography } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { SIDEBAR_WIDTH } from '@configs/constants';

import { PrimarySidebar, TopNavigation } from '..';

interface AppLayoutProps {
  sx?: SxProps;
  pageName?: string;
  isDesktop: boolean;
  dataTestId?: string;
}

const TOP_HEIGHT_MOBILE = 5;
const TOP_HEIGHT_DESKTOP = 6;
const PAGE_NAME_HEIGHT_DESKTOP = 3;
const MAIN_CONTENT_MARGIN_Y = 2;

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  sx,
  children,
  pageName,
  isDesktop,
  dataTestId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isDesktop]);

  return (
    <Box
      display="flex"
      sx={{
        overflow: 'auto',
      }}
    >
      <TopNavigation
        isDesktop={isDesktop}
        onClick={() => setIsOpen(true)}
        dataTestId={`${dataTestId}-topNavigation`}
      />
      <PrimarySidebar
        isOpen={isOpen}
        isDesktop={isDesktop}
        onClose={() => setIsOpen(false)}
        dataTestId={`${dataTestId}-primarySidebar`}
      />
      <Box
        component="main"
        sx={{
          height: '100vh',
          ml: isDesktop ? `${SIDEBAR_WIDTH + MAIN_CONTENT_MARGIN_Y}rem` : 0,
          mr: isDesktop ? `${MAIN_CONTENT_MARGIN_Y}rem` : 0,
          width: {
            xs: '100%',
            lg: `calc(100% - ${SIDEBAR_WIDTH + MAIN_CONTENT_MARGIN_Y * 2}rem)`,
          },
        }}
      >
        <Box
          sx={{
            minHeight: `${
              isDesktop ? TOP_HEIGHT_DESKTOP : TOP_HEIGHT_MOBILE
            }rem`,
          }}
        />
        {isDesktop && pageName && (
          <Box>
            <Typography variant="h6" mb="1rem">
              {pageName}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            padding: `${isDesktop ? 1.25 : 1}rem`,
            backgroundColor: 'white',
            borderRadius: '0.5rem 0.5rem 0 0',
            minHeight: `calc(100% - ${
              isDesktop
                ? TOP_HEIGHT_DESKTOP + PAGE_NAME_HEIGHT_DESKTOP
                : TOP_HEIGHT_MOBILE
            }rem)`,
            boxShadow: (theme) => theme.palette.customs.boxShadow,
            ...sx,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

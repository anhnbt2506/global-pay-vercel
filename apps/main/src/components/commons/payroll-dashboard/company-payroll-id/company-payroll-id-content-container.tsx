import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { CHAT_SIDEBAR_WIDTH } from '@configs/constants';

interface CompanyPayrollIdContentContainerProps {
  icCommentSidebarOpen: boolean;
  isDesktop: boolean;
}

export const CompanyPayrollIdContentContainer: FC<
  PropsWithChildren<CompanyPayrollIdContentContainerProps>
> = ({ children, icCommentSidebarOpen, isDesktop }) => {
  return (
    <Box
      sx={{
        mr: icCommentSidebarOpen && isDesktop ? `${CHAT_SIDEBAR_WIDTH}rem` : 0,
      }}
    >
      {children}
    </Box>
  );
};

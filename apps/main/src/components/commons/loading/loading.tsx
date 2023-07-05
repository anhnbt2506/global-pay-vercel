import type { FC } from 'react';
import { Box, CircularProgress, SxProps } from '@mui/material';

interface LoadingProps {
  sx?: SxProps;
  dataTestId?: string;
}

export const Loading: FC<LoadingProps> = ({ sx, dataTestId }) => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx,
    }}
  >
    <CircularProgress data-testid={dataTestId} />
  </Box>
);

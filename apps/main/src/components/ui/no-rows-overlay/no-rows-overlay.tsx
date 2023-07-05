import { MuiIcon } from '@ayp/typings/commons';
import { Box, Typography } from '@mui/material';
import type { FC } from 'react';

import { DynamicIcon } from '..';

interface NoRowsOverlayProps {
  icon: MuiIcon;
  title: string;
  description: string;
  dataTestId?: string;
}

export const NoRowsOverlay: FC<NoRowsOverlayProps> = ({
  icon,
  title,
  description,
  dataTestId,
}) => (
  <Box
    sx={{
      gap: '1rem',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <DynamicIcon
      name={icon}
      color="primary"
      sx={{
        fontSize: '6rem',
      }}
      data-testid={`${dataTestId}-icon`}
    />
    <Typography variant="h5" data-testid={`${dataTestId}-title`}>
      {title}
    </Typography>
    <Typography
      variant="subtitle1"
      align="center"
      maxWidth={600}
      data-testid={`${dataTestId}-description`}
    >
      {description}
    </Typography>
  </Box>
);

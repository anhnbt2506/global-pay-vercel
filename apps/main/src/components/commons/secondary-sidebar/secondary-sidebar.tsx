import type { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';

import { GlobalPayLogo } from '@assets/shared';

interface SecondarySidebarProps {
  title: string;
  dataTestId?: string;
}

export const SecondarySidebar: FC<PropsWithChildren<SecondarySidebarProps>> = ({
  title,
  children,
  dataTestId,
}) => (
  <Container
    maxWidth={false}
    sx={{
      paddingTop: '1rem',
    }}
  >
    <Image
      width={100}
      height={75}
      src={GlobalPayLogo}
      alt="ayp-logo-with-slogan"
    />
    <Box sx={{ marginY: '1rem' }}>
      <Typography variant="h6" data-testid={`${dataTestId}-title`}>
        {title}
      </Typography>
    </Box>
    {children}
  </Container>
);

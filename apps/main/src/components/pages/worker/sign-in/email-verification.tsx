import { TFunction } from 'next-i18next';
import { FC } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { MarkAsUnread } from '@mui/icons-material';

const EmailVerification: FC<{ t: TFunction; isDesktop: boolean }> = ({
  t,
  isDesktop,
}) => (
  <Box
    display="flex"
    justifyContent="center"
    sx={{
      height: '60vh',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Stack alignItems="center" spacing={2}>
      <MarkAsUnread
        color="primary"
        sx={{
          fontSize: '8rem',
        }}
      />
      <Typography
        variant="h4"
        data-testid="workerSignIn-emailVerificationTitle"
      >
        {t('emailVerification.title')}
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        data-testid="workerSignIn-emailVerificationDescription"
        sx={{
          maxWidth: isDesktop ? '48%' : '90%',
        }}
      >
        {t('emailVerification.description')}
      </Typography>
    </Stack>
  </Box>
);

export default EmailVerification;

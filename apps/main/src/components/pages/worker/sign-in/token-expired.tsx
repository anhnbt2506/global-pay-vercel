import { TFunction } from 'next-i18next';
import { FC } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

const TokenExpired: FC<{
  t: TFunction;
  isDesktop: boolean;
  onHandleLogin: () => void;
}> = ({ t, isDesktop, onHandleLogin }) => (
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
      <WarningAmber
        color="primary"
        sx={{
          fontSize: '8rem',
        }}
      />
      <Typography variant="h4" data-testid="workerSignIn-tokenExpiredTitle">
        {t('tokenExpired.title')}
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        data-testid="workerSignIn-tokenExpiredDescription"
        sx={{
          maxWidth: isDesktop ? '48%' : '90%',
        }}
      >
        {t('tokenExpired.description')}
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        data-testid="workerSignIn-tokenExpiredDescriptionTwo"
        sx={{
          maxWidth: isDesktop ? '48%' : '90%',
          marginTop: '1rem',
        }}
      >
        {t('tokenExpired.descriptionTwo')}
      </Typography>
      <Box
        display="flex"
        marginY="1rem"
        justifyContent="center"
        flexDirection={isDesktop ? 'row' : 'column'}
      >
        <Button
          variant="contained"
          fullWidth={!isDesktop}
          onClick={onHandleLogin}
          data-testid="workerSignIn-tokenExpiredLoginButton"
          sx={{
            paddingX: '3rem',
            marginY: '3rem',
          }}
        >
          {t('common:login')}
        </Button>
      </Box>
    </Stack>
  </Box>
);

export default TokenExpired;

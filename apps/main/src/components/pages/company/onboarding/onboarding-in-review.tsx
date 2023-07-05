import type { FC } from 'react';
import { Task } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Box, Stack, Typography } from '@mui/material';

import {
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP,
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE,
} from '@components/commons';

interface OnboardingCompleteProps {
  isDesktop: boolean;
}

const OnboardingInReview: FC<OnboardingCompleteProps> = ({ isDesktop }) => {
  const { t } = useTranslation('company-onboarding');

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: `${isDesktop ? 100 : 80}vh`,
        marginTop: `-${
          isDesktop
            ? SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP
            : SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE
        }rem`,
      }}
    >
      <Task
        color="primary"
        sx={{
          fontSize: '8rem',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: isDesktop ? '66%' : '90%',
        }}
      >
        <Typography variant="h4" data-testid="companyOnboarding-inReview-title">
          {t('onboardingInReview.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            marginY: '1rem',
          }}
          data-testid="companyOnboarding-inReview-description"
        >
          {t('onboardingInReview.description')}
        </Typography>
      </Box>
    </Stack>
  );
};

export default OnboardingInReview;

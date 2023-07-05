import type { FC } from 'react';
import { Task } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Box, Stack, Typography } from '@mui/material';

import {
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP,
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE,
} from '@components/commons';

interface InReviewFormProps {
  isDesktop: boolean;
}

const InReviewForm: FC<InReviewFormProps> = ({ isDesktop }) => {
  const { t } = useTranslation('worker-onboarding');

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      maxWidth="sm"
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
        data-testid="workerOnboarding-inReviewForm"
      >
        <Typography variant="h4">{t('inReview.label')}</Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            marginY: '1rem',
          }}
        >
          {t('inReview.description')}
        </Typography>
      </Box>
    </Stack>
  );
};

export default InReviewForm;

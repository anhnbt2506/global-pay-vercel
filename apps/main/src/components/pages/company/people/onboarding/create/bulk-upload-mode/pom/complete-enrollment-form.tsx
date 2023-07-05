import { Task } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

const CompleteEnrollmentForm: FC<{ dataTestId: string }> = ({ dataTestId }) => {
  const { t } = useTranslation(
    'company-people-onboarding-create-bulk-upload-mode'
  );

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      maxWidth="sm"
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
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginY: '1rem',
          }}
        >
          {t('pom.steps.completeEnrollment.successfullyEnrolled')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          maxWidth="24rem"
          sx={{
            marginY: '1rem',
          }}
          data-testid={`${dataTestId}-message`}
        >
          {t('pom.steps.completeEnrollment.message')}
        </Typography>
      </Box>
    </Stack>
  );
};

export default CompleteEnrollmentForm;

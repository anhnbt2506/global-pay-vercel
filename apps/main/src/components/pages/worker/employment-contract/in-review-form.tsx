import type { FC } from 'react';
import { Task } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import { renderString } from '@ayp/utils';

import {
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_DESKTOP,
  SECONDARY_APP_LAYOUT_TOP_HEIGHT_MOBILE,
} from '@components/commons';
import { WORKER_AGREEMENT } from '@configs/routes';

interface InReviewFormProps {
  isDesktop: boolean;
  companyName: string;
  agreementId: string;
  dataTestId?: string;
}

const InReviewForm: FC<InReviewFormProps> = ({
  isDesktop,
  companyName,
  agreementId,
  dataTestId,
}) => {
  const { t } = useTranslation('employment-contract');

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
      >
        <Typography variant="h4" data-testid={`${dataTestId}-title`}>
          {t('inReview.label')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            marginY: '1rem',
          }}
          data-testid={`${dataTestId}-description`}
        >
          {t('inReview.description', { companyName })}
        </Typography>
      </Box>
      <Box
        display="flex"
        marginY="1rem"
        gap={`${isDesktop ? 4 : 1}rem`}
        flexDirection={isDesktop ? 'row' : 'column'}
        justifyContent={isDesktop ? 'center' : 'space-around'}
      >
        <Button
          variant="outlined"
          onClick={
            /* istanbul ignore next */
            // this case is unnecessary to test
            () =>
              window.open(
                renderString(
                  WORKER_AGREEMENT.path,
                  {
                    agreementId,
                  },
                  '_blank'
                )
              )
          }
          sx={{
            paddingX: '2rem',
          }}
          data-testid={`${dataTestId}-downloadContract-button`}
        >
          {t('downloadContract')}
        </Button>

        <Button
          variant="contained"
          fullWidth={!isDesktop}
          sx={{
            paddingX: '2rem',
          }}
          onClick={() => window.location.reload()}
          data-testid={`${dataTestId}-home-button`}
        >
          {t('home')}
        </Button>
      </Box>
    </Stack>
  );
};

export default InReviewForm;

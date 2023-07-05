import { fireGtmEvent, renderString } from '@ayp/utils';
import { Task } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import { GTM_EVENTS } from '@configs/constants/gtm-events';
import {
  COMPANY_AGREEMENT,
  COMPANY_PEOPLE_ONBOARDING,
  COMPANY_PEOPLE_ONBOARDING_CREATE,
} from '@configs/routes';

interface NewHireeAddedProps {
  isDesktop: boolean;
  agreementId: string;
}

const NewHireeAdded: FC<NewHireeAddedProps> = ({ isDesktop, agreementId }) => {
  const router = useRouter();
  const { t } = useTranslation('company-people-onboarding-create');

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
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
          maxWidth: isDesktop ? '33%' : '90%',
        }}
        data-testid="companyPeopleOnboarding-completed-newHireeAdded"
      >
        <Typography variant="h4">
          {t('guidedMode.PEO.newHireeAdded.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            marginY: '1rem',
          }}
        >
          {t('guidedMode.PEO.newHireeAdded.description')}
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
          sx={{
            paddingX: '2rem',
          }}
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_HIRE,
            });
            router.push(COMPANY_PEOPLE_ONBOARDING_CREATE.path);
          }}
          data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-addNewHire"
        >
          {t('guidedMode.PEO.newHireeAdded.addNewHire')}
        </Button>
        <Button
          variant="outlined"
          sx={{
            paddingX: '2rem',
          }}
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_CONTRACT,
            });
            window.open(
              renderString(
                COMPANY_AGREEMENT.path,
                {
                  agreementId,
                },
                '_blank'
              )
            );
          }}
          data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-downloadContract"
        >
          {t('guidedMode.PEO.newHireeAdded.downloadContract')}
        </Button>
        <Button
          variant="contained"
          sx={{
            paddingX: '2rem',
          }}
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_SUMMARY,
            });
            router.push(COMPANY_PEOPLE_ONBOARDING.path);
          }}
          data-testid="companyPeopleOnboardingCreate-guidedMode-peo-completed-btn-viewSummary"
        >
          {t('guidedMode.PEO.newHireeAdded.viewSummary')}
        </Button>
      </Box>
    </Stack>
  );
};

export default NewHireeAdded;

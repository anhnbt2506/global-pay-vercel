import {
  HireType,
  ServiceAgreement,
  ServiceAgreementStatus,
} from '@ayp/typings/entities';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import { ExitToApp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useCallback, useMemo, useState } from 'react';

import { SecondaryAppLayout, SecondarySidebar } from '@components/commons';
import { ModeQuery } from '@components/pages/company/people/onboarding/create/guided-mode/peo/config';
import { Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { COMPANY_PEOPLE_ONBOARDING } from '@configs/routes';
import { useFeatureFlag, useSessionCookies } from '@hooks';
import { MonetizationOnOutlined, PersonAddOutlined } from '@mui/icons-material';
import { ServiceAgreementApi } from '@services/apis/people';

import { AgreementModal } from './agreement-modal';
import { SelectionBox } from './selection-box';

interface EmploymentServicesFormProps {
  isDesktop: boolean;
  setFormMode: (formMode: Nullable<ModeQuery>) => void;
}

const EmploymentServicesForm: FC<EmploymentServicesFormProps> = ({
  isDesktop,
  setFormMode,
}) => {
  const router = useRouter();
  const { session } = useSessionCookies();
  const { HIRE_TYPE_POM } = useFeatureFlag();
  const [toast, setToast] = useState<Toast>({});
  const { t } = useTranslation('company-people-onboarding-create');
  const theme = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [serviceAgreement, setServiceAgreement] =
    useState<Nullable<ServiceAgreement>>(null);

  const onSelect = useCallback(
    async (hireType: HireType) => {
      try {
        const { serviceAgreement } = await ServiceAgreementApi.getByHireType(
          session,
          hireType
        );

        if (serviceAgreement.status !== ServiceAgreementStatus.SIGNED) {
          setShowModal(true);
          setServiceAgreement(serviceAgreement);
        } else {
          setFormMode(
            hireType === HireType.PEO ? ModeQuery.GUIDED : ModeQuery.BULK_UPLOAD
          );
        }
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    },
    [session, setFormMode, t]
  );

  const secondarySidebar = useMemo(
    () => (
      <SecondarySidebar title={t('employmentServices.sidebar.title')}>
        <Box
          sx={{
            marginTop: '1rem',
          }}
        >
          <Typography>{t('employmentServices.sidebar.description')}</Typography>
        </Box>
      </SecondarySidebar>
    ),
    [t]
  );

  const content = useMemo(
    () => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SelectionBox
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_PEO_EOR_SERVICE,
            });
            onSelect(HireType.PEO);
          }}
          icon={
            <PersonAddOutlined
              style={{
                fontSize: theme.typography.h1.fontSize,
                color: theme.palette.primary.main,
              }}
            />
          }
          title={t('employmentServices.form.PEO.label')}
          description={t('employmentServices.form.PEO.caption')}
          dataTestId="companyPeopleOnboardingCreate-selection-PEO"
        />
        <SelectionBox
          disabled={!HIRE_TYPE_POM}
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE,
            });
            onSelect(HireType.POM);
          }}
          icon={
            <MonetizationOnOutlined
              style={{
                fontSize: theme.typography.h1.fontSize,
                color: theme.palette.primary.main,
              }}
            />
          }
          title={t('employmentServices.form.POM.label')}
          description={t('employmentServices.form.POM.caption')}
          dataTestId="companyPeopleOnboardingCreate-selection-POM"
        />
        {showModal && serviceAgreement && (
          <AgreementModal
            t={t}
            setToast={setToast}
            serviceAgreement={serviceAgreement}
            onClose={() => setShowModal(false)}
            onSuccess={() =>
              setFormMode(
                serviceAgreement.hireType === HireType.PEO
                  ? ModeQuery.GUIDED
                  : ModeQuery.BULK_UPLOAD
              )
            }
          />
        )}
      </Box>
    ),
    [
      theme,
      t,
      onSelect,
      showModal,
      setFormMode,
      HIRE_TYPE_POM,
      serviceAgreement,
    ]
  );

  const topNavigationItem = useMemo(
    () => (
      <Box
        sx={{
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          edge="end"
          onClick={() => {
            router.push(COMPANY_PEOPLE_ONBOARDING.path);
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_SERVICE_CHOICES_LEAVE,
            });
          }}
          data-testid={`companyPeopleOnboardingCreate-employmentServices-exitToApp`}
        >
          <ExitToApp fontSize="medium" color="primary" />
        </IconButton>
      </Box>
    ),
    [router]
  );

  return (
    <SecondaryAppLayout
      isDesktop={isDesktop}
      secondarySidebar={secondarySidebar}
      topNavigationItem={topNavigationItem}
    >
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPeopleOnboardingCreate-employmentServices-toast"
      >
        {toast.message}
      </Toast>
      <Container maxWidth={false}>
        <Stack
          spacing={1}
          alignItems="center"
          sx={{
            marginTop: !isDesktop ? '1.5rem' : 0,
          }}
        >
          <Typography variant="h4" textAlign="center">
            {t('employmentServices.title')}
          </Typography>
          <Typography variant="subtitle1">
            {t('guidedMode.PEO.hiringDetails.description')}
          </Typography>
        </Stack>
        {content}
      </Container>
    </SecondaryAppLayout>
  );
};

export default EmploymentServicesForm;

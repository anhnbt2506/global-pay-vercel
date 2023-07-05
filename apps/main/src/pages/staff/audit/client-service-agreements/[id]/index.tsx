import { useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Box } from '@mui/material';
import { ServiceAgreement } from '@ayp/typings/entities';
import { NextPage } from '@ayp/typings/commons';

import { ServiceAgreementApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';
import { STAFF_HOME } from '@configs/routes';
import { RedirectionError } from '@configs/errors';
import { AppLayout } from '@components/commons';
import { Tabs, Toast } from '@components/ui';
import {
  SERVICE_AGREEMENT_TAB_OPTIONS,
  ServiceAgreementOptionsTabs,
} from '@components/pages/staff/audit/client-service-agreements/[id]/config';
import { Agreement } from '@components/pages/staff/audit/client-service-agreements/[id]/agreement';

interface StaffAuditClientServiceAgreementsIdProps {
  serviceAgreement: ServiceAgreement;
}

const StaffAuditClientServiceAgreementsId: NextPage<
  StaffAuditClientServiceAgreementsIdProps
> = ({ isDesktop, serviceAgreement, session }) => {
  const dataTestId = 'staffAudit-clientServiceAgreement-id';
  const { t } = useTranslation('staff-audit-client-service-agreements-id');

  const [toast, setToast] = useState<Toast>({});

  const serviceAgreementOption = useMemo(
    () =>
      SERVICE_AGREEMENT_TAB_OPTIONS.map((agreementTab) => ({
        ...agreementTab,
        value: agreementTab.id,
        label: t(agreementTab.label),
      })),
    [t]
  );

  const [tab, setTab] = useState(serviceAgreementOption[0].value);

  const component = useMemo(() => {
    switch (tab) {
      case ServiceAgreementOptionsTabs.AGREEMENT:
        return (
          <Agreement
            t={t}
            serviceAgreement={serviceAgreement}
            setToast={setToast}
            session={session}
            dataTestId={dataTestId}
          />
        );
    }
  }, [tab, serviceAgreement, session, t]);

  return (
    <AppLayout isDesktop={isDesktop} pageName={t('pageName')}>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId={dataTestId}
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Tabs
          tabs={serviceAgreementOption}
          value={tab}
          setTab={setTab}
          fallback={ServiceAgreementOptionsTabs.AGREEMENT}
          variant="scrollable"
        />
        <Box
          sx={{
            marginTop: '2rem',
          }}
        >
          {component}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default StaffAuditClientServiceAgreementsId;

export const getServerSideProps: GetServerSideProps<
  StaffAuditClientServiceAgreementsIdProps
> = async (context) => {
  try {
    const { id } = context.query;
    const session = await getServerSideSession(context);

    if (typeof id !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: STAFF_HOME.path,
        },
      };

    const { serviceAgreement } = await ServiceAgreementApi.get(session, id);

    return {
      props: {
        serviceAgreement: serviceAgreement,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'comment-type',
          'common',
          'conversation',
          'staff-audit-client-service-agreements-id',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffAuditClientServiceAgreementsIdProps,
    };
  }
};

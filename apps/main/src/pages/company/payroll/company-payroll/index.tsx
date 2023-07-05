import { NextPage } from '@ayp/typings/commons';
import {
  CompanyPayrollStatus,
  CompanyPayrollStatistics,
} from '@ayp/typings/entities';
import { useTheme } from '@mui/material/styles';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { AppLayout } from '@components/commons';
import { Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { CompanyPayrollApi } from '@services/apis/fintech';
import { getServerSideSession } from '@utils';
import { PayrollRecords } from '@components/commons/payroll-dashboard/payroll-records';
import { COMPANY_PAYROLL_DASHBOARD } from '@configs/routes';

interface CompanyPayrollCompanyPayrollProps {
  statistics: CompanyPayrollStatistics[];
}

const CompanyPayrollCompanyPayroll: NextPage<
  CompanyPayrollCompanyPayrollProps
> = ({ isDesktop, session, statistics }) => {
  const { t } = useTranslation('company-payroll-company-payroll');
  const theme = useTheme();
  const router = useRouter();
  const [toast, setToast] = useState<Toast>({});
  const { tab } = router.query;

  const getPayrollStatus: Nullable<CompanyPayrollStatus> = useMemo(() => {
    if (!tab || typeof tab !== 'string') return null;

    switch (tab.toLocaleUpperCase()) {
      case CompanyPayrollStatus.DRAFT:
        return CompanyPayrollStatus.DRAFT;
      case CompanyPayrollStatus.PENDING:
      case CompanyPayrollStatus.PENDING_REVIEW:
        return CompanyPayrollStatus.PENDING;
      case CompanyPayrollStatus.REJECTED:
        return CompanyPayrollStatus.REJECTED;
      /* istanbul ignore next */
      // this case doesn't necessary to test
      default:
        return CompanyPayrollStatus.PENDING;
    }
  }, [tab]);

  const draft = useMemo(
    () =>
      statistics.find((item) => item.status === CompanyPayrollStatus.DRAFT)
        ?.count ?? 0,
    [statistics]
  );

  const pending = useMemo(() => {
    const pendingCount = statistics.find((item) =>
      item.status.includes(CompanyPayrollStatus.PENDING)
    );
    return pendingCount?.count ?? 0;
  }, [statistics]);

  const rejected = useMemo(
    () =>
      statistics.find((item) => item.status === CompanyPayrollStatus.REJECTED)
        ?.count ?? 0,
    [statistics]
  );

  const renderSelectedStatusContent = () => {
    if (!getPayrollStatus) return <></>;

    return (
      <PayrollRecords
        payrollStatus={getPayrollStatus}
        draftCount={draft}
        pendingCount={pending}
        rejectedCount={rejected}
        t={t}
        isDesktop={isDesktop}
        session={session}
        setToast={setToast}
        linkTo={`${COMPANY_PAYROLL_DASHBOARD.path}`}
      />
    );
  };

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPayrollCompanyPayroll-toast"
      >
        {toast.message}
      </Toast>
      <AppLayout
        isDesktop={isDesktop}
        pageName={''}
        sx={{
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          boxShadow: 'none',
          paddingY: 0,
          paddingX: isDesktop ? 0 : '1rem',
        }}
        dataTestId="companyPayrollCompanyPayroll-appLayout"
      >
        {renderSelectedStatusContent()}
      </AppLayout>
    </>
  );
};

export default CompanyPayrollCompanyPayroll;

export const getServerSideProps: GetServerSideProps<
  CompanyPayrollCompanyPayrollProps
> = async (context) => {
  try {
    const session = await getServerSideSession(context);
    const { statistics } = await CompanyPayrollApi.statistics(session, {});

    return {
      props: {
        statistics,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'payroll-status',
          'payroll-type',
          'payroll-run-off-cycle-payroll-modal',
          'company-payroll-company-payroll',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as CompanyPayrollCompanyPayrollProps,
    };
  }
};

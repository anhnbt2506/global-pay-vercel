import { NextPage } from '@ayp/typings/commons';
import {
  CompanyPayrollStatistics,
  CompanyPayrollStatus,
} from '@ayp/typings/entities';
import { useTheme } from '@mui/material/styles';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import { PayrollRecords } from '@components/commons/payroll-dashboard/payroll-records';
import { Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { STAFF_PAYROLL_DASHBOARD } from '@configs/routes';
import { CompanyPayrollApi } from '@services/apis/fintech';
import { getServerSideSession } from '@utils';

interface StaffPayrollCompanyPayrollProps {
  statistics: CompanyPayrollStatistics[];
}

const StaffPayrollCompanyPayroll: NextPage<StaffPayrollCompanyPayrollProps> = ({
  isDesktop,
  session,
  statistics,
}) => {
  const { t } = useTranslation('staff-payroll-company-payroll');
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
        linkTo={`${STAFF_PAYROLL_DASHBOARD.path}`}
      />
    );
  };

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffPayrollCompanyPayroll-toast"
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
        dataTestId="staffPayrollCompanyPayroll-appLayout"
      >
        {renderSelectedStatusContent()}
      </AppLayout>
    </>
  );
};

export default StaffPayrollCompanyPayroll;

export const getServerSideProps: GetServerSideProps<
  StaffPayrollCompanyPayrollProps
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
          'staff-payroll-company-payroll',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffPayrollCompanyPayrollProps,
    };
  }
};

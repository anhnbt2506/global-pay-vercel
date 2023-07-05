import { NextPage } from '@ayp/typings/commons';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DescriptionOutlined,
  PendingActionsOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import {
  CompanyPayrollStatistics,
  CompanyPayrollStatus,
} from '@ayp/typings/entities';
import { useRouter } from 'next/router';

import {
  AppLayout,
  PayrollDraft,
  OffCyclePayroll,
  PayrollCard,
} from '@components/commons';
import { Toast } from '@components/ui';
import { CompanyPayrollApi } from '@services/apis/fintech';
import { RedirectionError } from '@configs/errors';
import { getServerSideSession } from '@utils';
import { STAFF_PAYROLL_COMPANY_PAYROLL } from '@configs/routes';
import { RunOffCyclePayrollModal } from '@components/commons/payroll-dashboard/run-off-cycle-payroll-modal';

interface StaffPayrollDashboardProps {
  statistics: CompanyPayrollStatistics[];
}

const StaffPayrollDashboard: NextPage<StaffPayrollDashboardProps> = ({
  isDesktop,
  statistics,
  session,
}) => {
  const router = useRouter();
  const [showRunOffCyclePayrollModal, setShowRunOffCyclePayrollModal] =
    useState(false);

  const { t } = useTranslation('staff-payroll-dashboard');
  const [toast, setToast] = useState<Toast>({});
  const theme = useTheme();

  const draft = useMemo(() => {
    const draftCount = statistics.find(
      (item) => item.status === CompanyPayrollStatus.DRAFT
    );
    return draftCount?.count ?? 0;
  }, [statistics]);

  const pending = useMemo(() => {
    const pendingCount = statistics.find((item) =>
      item.status.includes(CompanyPayrollStatus.PENDING)
    );
    return pendingCount?.count ?? 0;
  }, [statistics]);

  const rejected = useMemo(() => {
    const rejectedCount = statistics.find(
      (item) => item.status === CompanyPayrollStatus.REJECTED
    );
    return rejectedCount?.count ?? 0;
  }, [statistics]);

  const handleSelectedTab = (payrollStatus: CompanyPayrollStatus) => {
    router.push(
      `${
        STAFF_PAYROLL_COMPANY_PAYROLL.path
      }?tab=${payrollStatus.toLocaleLowerCase()}`
    );
  };

  const renderRunOffCyclePayrollModal = useMemo(
    () =>
      showRunOffCyclePayrollModal && (
        <RunOffCyclePayrollModal
          t={t}
          session={session}
          onSuccess={() => {
            setShowRunOffCyclePayrollModal(false);
            router.push({
              pathname: STAFF_PAYROLL_COMPANY_PAYROLL.path,
              query: { tab: CompanyPayrollStatus.DRAFT.toLocaleLowerCase() },
            });
          }}
          onClose={() => setShowRunOffCyclePayrollModal(false)}
          setToast={setToast}
        />
      ),
    [t, showRunOffCyclePayrollModal, session, setToast, router]
  );

  const renderDashboard = () => {
    return (
      <Grid container>
        {renderRunOffCyclePayrollModal}
        {draft && (
          <Grid item xs={12}>
            <PayrollDraft
              t={t}
              number={draft}
              dataTestId="staffPayrollDashboard-payrollDraft"
              href={`${
                STAFF_PAYROLL_COMPANY_PAYROLL.path
              }?tab=${CompanyPayrollStatus.DRAFT.toLocaleLowerCase()}`}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sx={{
            marginY: '1.25rem',
          }}
        >
          <OffCyclePayroll
            t={t}
            title={t('offCyclePayroll.title')}
            description={t('offCyclePayroll.description')}
            dataTestId="staffPayrollDashboard-offCyclePayroll"
            onClick={() => setShowRunOffCyclePayrollModal(true)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              margin: '0.25rem 0 1rem 0',
            }}
          >
            {t('activePayroll.title')}
          </Typography>
        </Grid>
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Grid item xs={3.8}>
            <PayrollCard
              title={t('activePayroll.draft.title')}
              dataTestId="staffPayrollDashboard-payrollCard"
              number={draft}
              iconBackgroundColor={theme.palette.action.selected}
              labelLinkBtn={t('activePayroll.viewDetail')}
              icon={
                <DescriptionOutlined
                  style={{
                    fontSize: '2rem',
                    color: theme.palette.action.active,
                    position: 'absolute',
                    transform: 'translate(-50%,-50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />
              }
              onClick={() => handleSelectedTab(CompanyPayrollStatus.DRAFT)}
            />
          </Grid>
          <Grid item xs={3.8}>
            <PayrollCard
              title={t('activePayroll.pending.title')}
              dataTestId="staffPayrollDashboard-payrollCard"
              labelLinkBtn={t('activePayroll.viewDetail')}
              number={pending}
              iconBackgroundColor={theme.palette.warning.shades.p190}
              icon={
                <PendingActionsOutlined
                  style={{
                    fontSize: '2rem',
                    color: theme.palette.warning.light,
                    position: 'absolute',
                    transform: 'translate(-50%,-50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />
              }
              onClick={() => handleSelectedTab(CompanyPayrollStatus.PENDING)}
            />
          </Grid>
          <Grid item xs={3.8}>
            <PayrollCard
              title={t('activePayroll.rejected.title')}
              dataTestId="staffPayrollDashboard-payrollCard"
              labelLinkBtn={t('activePayroll.viewDetail')}
              number={rejected}
              iconBackgroundColor={theme.palette.error.shades.p190}
              icon={
                <WarningAmberOutlined
                  style={{
                    fontSize: '2rem',
                    color: theme.palette.error.light,
                    position: 'absolute',
                    transform: 'translate(-50%,-50%)',
                    left: '50%',
                    top: '50%',
                  }}
                />
              }
              onClick={() => handleSelectedTab(CompanyPayrollStatus.REJECTED)}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffPayrollDashboard-toast"
      >
        {toast.message}
      </Toast>
      <AppLayout
        isDesktop={isDesktop}
        pageName={t('pageName')}
        sx={{
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          boxShadow: 'none',
          paddingY: 0,
          paddingX: isDesktop ? 0 : '1rem',
        }}
        dataTestId="staffPayrollDashboard-appLayout"
      >
        {renderDashboard()}
      </AppLayout>
    </>
  );
};

export default StaffPayrollDashboard;

export const getServerSideProps: GetServerSideProps<
  StaffPayrollDashboardProps
> = async (context) => {
  try {
    const session = await getServerSideSession(context);
    const { statistics } = await CompanyPayrollApi.statistics(session, {});

    return {
      props: {
        statistics,
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'staff-payroll-dashboard',
          'payroll-run-off-cycle-payroll-modal',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {} as StaffPayrollDashboardProps,
    };
  }
};

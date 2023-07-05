import { UserSession } from '@ayp/typings/commons';
import { CompanyPayrollStatus, Role } from '@ayp/typings/entities';
import { isUserPermitted } from '@ayp/utils';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { BreadCrumbs } from '@components/commons';
import { Table as CompanyPayrollTable } from '@components/commons/payroll-dashboard/payroll-table';
import { RunOffCyclePayrollModal } from '@components/commons/payroll-dashboard/run-off-cycle-payroll-modal';
import { Tabs, Toast } from '@components/ui';
import { ACTIVE_PAYROLL_OPTIONS } from '@configs/constants';
import {
  COMPANY_PAYROLL_COMPANY_PAYROLL,
  STAFF_PAYROLL_COMPANY_PAYROLL,
} from '@configs/routes';
import { CompanyPayrollApi } from '@services/apis/fintech';

interface PayrollRecordsProps {
  payrollStatus: CompanyPayrollStatus;
  draftCount: number;
  pendingCount: number;
  rejectedCount: number;
  t: TFunction;
  isDesktop: boolean;
  session: UserSession;
  setToast: Dispatch<SetStateAction<Toast>>;
  linkTo: string;
}

export const PayrollRecords: FC<PayrollRecordsProps> = ({
  payrollStatus,
  draftCount,
  pendingCount,
  rejectedCount,
  isDesktop,
  session,
  setToast,
  linkTo,
  t,
}) => {
  const [tab, setTab] = useState(payrollStatus.toLocaleLowerCase());
  const [showRunOffCyclePayrollModal, setShowRunOffCyclePayrollModal] =
    useState(false);

  const [draftCountRecords, setDraftCountRecords] = useState(draftCount);
  const [newPayrollId, setNewPayrollId] = useState<string>('');
  const router = useRouter();

  const renderRunOffCyclePayrollModal = useMemo(
    () =>
      showRunOffCyclePayrollModal && (
        <RunOffCyclePayrollModal
          t={t}
          session={session}
          onSuccess={async (payrollId: string) => {
            setShowRunOffCyclePayrollModal(false);
            setNewPayrollId(payrollId);
            const { statistics } = await CompanyPayrollApi.statistics(session, {
              filters: [`status,is,${CompanyPayrollStatus.DRAFT}`],
            });
            setDraftCountRecords(statistics[0].count);
            router.push({
              pathname: isUserPermitted(
                [Role.GP_COMPANY],
                session?.user.selectedUserContext.role
              )
                ? COMPANY_PAYROLL_COMPANY_PAYROLL.path
                : STAFF_PAYROLL_COMPANY_PAYROLL.path,
              query: { tab: CompanyPayrollStatus.DRAFT.toLocaleLowerCase() },
            });
          }}
          onClose={() => setShowRunOffCyclePayrollModal(false)}
          setToast={setToast}
        />
      ),
    [t, showRunOffCyclePayrollModal, router, session, setToast]
  );

  const activePayrollOptions = useMemo(
    () =>
      ACTIVE_PAYROLL_OPTIONS.filter(
        ({ id }) =>
          id !== CompanyPayrollStatus.COMPLETED &&
          id !== CompanyPayrollStatus.PENDING_REVIEW
      ).map((activePayroll) => ({
        ...activePayroll,
        value: activePayroll.id.toLocaleLowerCase(),
        label: t(activePayroll.label),
        count:
          activePayroll.id === CompanyPayrollStatus.DRAFT
            ? draftCountRecords
            : activePayroll.id === CompanyPayrollStatus.PENDING
            ? pendingCount
            : rejectedCount,
      })),
    [t, draftCountRecords, pendingCount, rejectedCount]
  );

  return (
    <Grid container>
      {renderRunOffCyclePayrollModal}
      <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
        <BreadCrumbs
          breadCrumbItems={[
            {
              name: t('breadcrumbs'),
              onClick: () => {
                router.push(linkTo);
              },
            },
          ]}
          t={t}
        />
      </Grid>
      <Grid
        container
        sx={{
          alignItems: 'center',
        }}
      >
        <Grid item xs={10} sx={{ paddingLeft: '0.5rem' }}>
          <Typography
            variant="h6"
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.9rem',
                fontWeight: '500',
              },
            })}
          >
            {t('activePayrollList')}
          </Typography>
          <Typography
            variant="body1"
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                paddingRight: '0.5rem',
              },
            })}
          >
            {t('description')}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              boxShadow: theme.palette.customs.boxShadow,
              padding: '0.5rem',
              borderRadius: '0.25rem',
              width: '90%',
              '&:hover': {
                backgroundColor: theme.palette.primary.shades.p50,
              },
            })}
            onClick={() => setShowRunOffCyclePayrollModal(true)}
          >
            <Typography
              variant="body2"
              sx={(theme) => ({
                textAlign: 'left',
                color: theme.palette.background.paper,
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              })}
            >
              {t('offCyclePayroll.title')}
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Divider
        sx={{
          width: '100%',
          marginY: '0.5rem',
        }}
      />
      <Grid item xs={12}>
        <Tabs
          tabs={activePayrollOptions}
          value={tab}
          setTab={setTab}
          variant="scrollable"
          fallback={CompanyPayrollStatus.PENDING.toLocaleLowerCase()}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          padding: `0 ${isDesktop ? 1.25 : 1}rem ${isDesktop ? 1.25 : 1}rem ${
            isDesktop ? 1.25 : 1
          }rem`,
          marginTop: '0.75rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: (theme) => theme.palette.customs.boxShadow,
          minHeight: '60vh',
        }}
      >
        <CompanyPayrollTable
          t={t}
          session={session}
          setToast={setToast}
          tab={tab.toLocaleUpperCase()}
          newPayrollId={newPayrollId}
        />
      </Grid>
    </Grid>
  );
};

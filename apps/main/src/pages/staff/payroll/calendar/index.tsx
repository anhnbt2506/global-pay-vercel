import { NextPage } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { mapToCalendarEventInput } from '@ayp/utils';
import { Edit } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useMemo, useState } from 'react';

import { AppLayout, Calendar } from '@components/commons';
import { FetchEventsApi } from '@components/commons/calendar/config';
import { SelectionModal } from '@components/pages/staff/payroll/calendar/selection-modal';
import { Toast } from '@components/ui';
import { CompanyCalendarApi } from '@services/apis/people';

const StaffPayrollCalendar: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('staff-payroll-calendar');
  const [toast, setToast] = useState<Toast>({});
  const [showSelection, setShowSelection] = useState(false);
  const [client, setClient] = useState<Nullable<Option<string>>>(null);
  const [calendar, setCalendar] = useState<Nullable<Option<string>>>(null);

  const fetchCompanyEvents = useCallback<FetchEventsApi>(
    async (arg) => {
      if (calendar) {
        const { companyEvents } = await CompanyCalendarApi.getListCompanyEvents(
          session,
          calendar.id,
          arg.start,
          arg.end
        );
        return mapToCalendarEventInput(companyEvents);
      }
      return [];
    },
    [session, calendar]
  );

  const selectedTitle = useMemo(
    () =>
      !!client && !!calendar ? `[${client?.name}] ${calendar?.label}` : '',
    [client, calendar]
  );

  const selectSection = useMemo(
    () =>
      showSelection && (
        <SelectionModal
          t={t}
          initialValues={{ calendar, client }}
          setCalendar={setCalendar}
          setClient={setClient}
          setToast={setToast}
          setShowSelection={setShowSelection}
        />
      ),
    [t, calendar, client, showSelection]
  );

  const calendarView = useMemo(
    () => (
      <Calendar
        isDesktop={isDesktop}
        fetchEventsApi={fetchCompanyEvents}
        dataTestId="staffPayrollCalendar"
      />
    ),
    [fetchCompanyEvents, isDesktop]
  );

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffPayrollCalendar-toast"
      >
        {toast.message}
      </Toast>
      <AppLayout
        isDesktop={isDesktop}
        pageName={t('pageName')}
        sx={{
          flexDirection: 'column',
        }}
      >
        {selectSection}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: '1rem',
          }}
        >
          <Box>
            {`${t('calendarInformation')}: `}
            <b>{selectedTitle}</b>
          </Box>
          <IconButton
            onClick={() => {
              setShowSelection(true);
            }}
            data-testid="staffPayrollCalendar-selectionButton"
          >
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </Box>
        {calendarView}
      </AppLayout>
    </>
  );
};

export default StaffPayrollCalendar;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'staff-payroll-calendar',
      'calendar',
    ])),
  },
});

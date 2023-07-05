import { NextPage, UserSession } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse, mapToCalendarEventInput } from '@ayp/utils';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import memoizee from 'memoizee';
import type { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { AppLayout, Calendar } from '@components/commons';
import { FetchEventsApi } from '@components/commons/calendar/config';
import { Autocomplete, ButtonSubmit, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { CompanyCalendarApi } from '@services/apis/people';

const getCalendarsGeneratedMemo = memoizee(
  async (session: UserSession): Promise<Option<string>[]> => {
    const { companyCalendar } =
      await CompanyCalendarApi.getAllCalendarsGenerated(session);
    return companyCalendar.map(({ calendarName, calendarId }) => ({
      label: calendarName,
      id: calendarId,
    }));
  },
  { promise: true }
);

const SelectCalendar: FC<{
  t: TFunction;
  session: UserSession;
  calendar: Nullable<Option<string>>;
  calendars: Option[];
  setCalendar: Dispatch<SetStateAction<Nullable<Option<string>>>>;
  setCalendars: Dispatch<SetStateAction<Option[]>>;
  setShowSelectCalendar: Dispatch<SetStateAction<boolean>>;
}> = ({ t, calendar, calendars, setCalendar, setShowSelectCalendar }) => {
  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          data-testid="companyPayrollCalendar-selectionModal-title"
        >
          {t('selectCalendar.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="companyPayrollCalendar-selectionModal-description"
        >
          {t('selectCalendar.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            calendar,
          }}
          onSubmit={(values: { calendar: Nullable<Option<string>> }) => {
            setCalendar(values.calendar);
            setShowSelectCalendar(false);
          }}
        >
          <Form>
            <Autocomplete
              required
              name="calendar"
              options={calendars}
              label={t('selectCalendar.form.calendar.label')}
              helperText={t('selectCalendar.form.calendar.helperText')}
              dataTestId="companyPayrollCalendar-selectionModal-field-calendar"
            />
            <Box
              sx={{
                gap: '2rem',
                display: 'flex',
                marginTop: '2rem',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowSelectCalendar(false)}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="companyPayrollCalendar-selectionModal-close"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="companyPayrollCalendar-selectionModal-submitButton"
              >
                {t('common:view')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const CompanyPayrollCalendar: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('company-payroll-calendar');
  const [toast, setToast] = useState<Toast>({});
  const [showSelectCalendar, setShowSelectCalendar] = useState(false);
  const [calendars, setCalendars] = useState<Option[]>([]);
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

  const selectCalendar = useMemo(
    () =>
      showSelectCalendar && (
        <SelectCalendar
          t={t}
          session={session}
          calendar={calendar}
          setCalendar={setCalendar}
          calendars={calendars}
          setCalendars={setCalendars}
          setShowSelectCalendar={setShowSelectCalendar}
        />
      ),
    [t, session, calendar, showSelectCalendar, calendars]
  );

  const calendarView = useMemo(() => {
    return (
      <Calendar
        isDesktop={isDesktop}
        fetchEventsApi={fetchCompanyEvents}
        dataTestId="companyPayrollCalendar"
      />
    );
  }, [isDesktop, fetchCompanyEvents]);

  const handleCalendarChange = useCallback(async () => {
    try {
      const data = await getCalendarsGeneratedMemo(session);
      setCalendars(data);
      if (!data.length) {
        setToast({
          severity: 'error',
          message: t('calendarIsNotExist'),
        });
      } else {
        setShowSelectCalendar(true);
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
  }, [t, session]);

  return (
    <AppLayout
      isDesktop={isDesktop}
      pageName={t('pageName')}
      sx={{
        flexDirection: 'column',
      }}
    >
      {selectCalendar}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyPayrollCalendar-toast"
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Box>
          {`${t('payrollSelected')}: `}
          <b>{calendar?.label}</b>
        </Box>
        <IconButton
          onClick={handleCalendarChange}
          data-testid="companyPayrollCalendar-selectionButton"
        >
          <Edit fontSize="small" color="primary" />
        </IconButton>
      </Box>
      {calendarView}
    </AppLayout>
  );
};

export default CompanyPayrollCalendar;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'company-payroll-calendar',
      'calendar',
    ])),
  },
});

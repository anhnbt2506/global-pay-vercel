import { UserSession } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import memoizee from 'memoizee';
import { TFunction } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ButtonSubmit, Toast } from '@components/ui';
import { useSessionCookies } from '@hooks/use-session-cookies';
import { CompanyCalendarApi } from '@services/apis/people';

import {
  FormValues,
  initialValues as defaultInitialValues,
  mapClientOptionRequestBody,
} from './config';
import { SelectionFormFields } from './form-fields';

const getClientsMemo = memoizee(
  async (session: UserSession): Promise<Option<string>[]> => {
    const { companies } = await CompanyCalendarApi.getClients(session);
    return companies.map(({ companyId, name }) => ({
      name,
      label: `[${companyId}] ${name}`,
      id: companyId,
    }));
  },
  { promise: true }
);

const getCalendarsGeneratedMemo = memoizee(
  async (
    clientOption: Option<string>,
    session: UserSession
  ): Promise<Option<string>[]> => {
    const { companyCalendar } = await CompanyCalendarApi.getCalendarsGenerated(
      mapClientOptionRequestBody(clientOption),
      session
    );
    return companyCalendar.map(({ calendarName, calendarId }) => ({
      label: calendarName,
      id: calendarId,
    }));
  },
  { promise: true }
);

interface SelectionModalProps {
  t: TFunction;
  initialValues?: FormValues;
  setClient: Dispatch<SetStateAction<Nullable<Option<string>>>>;
  setCalendar: Dispatch<SetStateAction<Nullable<Option<string>>>>;
  setToast: Dispatch<SetStateAction<Toast>>;
  setShowSelection: Dispatch<SetStateAction<boolean>>;
}

export const SelectionModal: FC<SelectionModalProps> = ({
  t,
  /* istanbul ignore next */
  // this case doesn't necessary to test
  initialValues = defaultInitialValues,
  setCalendar,
  setClient,
  setToast,
  setShowSelection,
}) => {
  const { session } = useSessionCookies();
  const [clientOptions, setClientOptions] = useState<Option<string>[]>([]);
  const [calendarOptions, setCalendarOptions] = useState<Option<string>[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const options = await getClientsMemo(session);
        setClientOptions(options);
      } catch (e) {
        /* istanbul ignore else */
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        }
      }
    })();
  }, [session, setToast]);

  const onHandleClientSelected = useCallback(
    (clientOption: Nullable<Option<string>>) => {
      if (!!clientOption) {
        (async () => {
          try {
            const options = await getCalendarsGeneratedMemo(
              clientOption,
              session
            );
            setCalendarOptions(options);
          } catch (e) {
            /* istanbul ignore else */
            if (isErrorResponse(e)) {
              setToast({
                severity: 'error',
                message: e.error.name,
              });
            }
          }
        })();
      } else {
        setCalendarOptions([]);
      }
    },
    [session, setToast, setCalendarOptions]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setClient(values.client);
      setCalendar(values.calendar);
      setShowSelection(false);
    },
    [setClient, setCalendar, setShowSelection]
  );

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
          data-testid="staffPayrollCalendar-selectionModal-title"
        >
          {t('selectCalendar.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffPayrollCalendar-selectionModal-description"
        >
          {t('selectCalendar.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <SelectionFormFields
              t={t}
              clientOptions={clientOptions}
              calendarOptions={calendarOptions}
              onHandleClientSelected={onHandleClientSelected}
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
                onClick={
                  /* istanbul ignore next */
                  () => {
                    /* istanbul ignore next */
                    setShowSelection(false);
                  }
                }
                sx={{
                  paddingX: '3rem',
                }}
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffPayrollCalendar-selectionModal-submitButton"
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

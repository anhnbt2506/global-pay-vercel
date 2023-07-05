import { UserSession } from '@ayp/typings/commons';
import { CalendarStatus, CalendarType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse, isTypeOf } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { Autocomplete, ButtonSubmit, Toast } from '@components/ui';
import {
  CALENDAR_STATUS_LABEL_PREFIX,
  CALENDAR_STATUS_OPTIONS,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { CalendarEventApi, CalendarTagApi } from '@services/apis/people';

import {
  FormValuesUpdateEvent,
  FormValuesUpdateTag,
  mapToRequestBodyForEvents,
  mapToRequestBodyForTag,
} from './config';

const UpdateStatusModal: FC<{
  t: TFunction;
  session: UserSession;
  params: FormValuesUpdateEvent | FormValuesUpdateTag;
  sectionName: Option<string>;
  onCloseUpdateStatusModal: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  t,
  session,
  sectionName,
  params,
  onCloseUpdateStatusModal,
  setToast,
}) => {
  const [status] = useState<Option<CalendarStatus>>({
    id: params.status,
    label: t(`${CALENDAR_STATUS_LABEL_PREFIX}${params.status}`),
  });

  const statusOptions = useMemo(
    () =>
      CALENDAR_STATUS_OPTIONS.map((calendarStatus) => ({
        ...calendarStatus,
        value: calendarStatus.id,
        label: t(calendarStatus.label),
      })),
    [t]
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
        <Typography variant="h6">{t('updateStatus.title')}</Typography>
        <Typography variant="subtitle1" align="center">
          {t('updateStatus.description', {
            calendarType: sectionName.id.toLocaleLowerCase(),
          })}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{ status }}
          onSubmit={async (values: { status: Option<CalendarStatus> }) => {
            try {
              switch (sectionName.id) {
                case CalendarType.EVENT:
                  /* istanbul ignore else */
                  // this case is unnecessary
                  if (
                    isTypeOf<FormValuesUpdateEvent>(params, ['calendarEventId'])
                  ) {
                    await CalendarEventApi.updateCalendarEvent(
                      session,
                      params.calendarEventId,
                      mapToRequestBodyForEvents(params, values.status.id)
                    );
                  }
                  break;
                case CalendarType.TAG:
                  /* istanbul ignore else */
                  // this case is unnecessary
                  if (
                    isTypeOf<FormValuesUpdateTag>(params, ['calendarTagId'])
                  ) {
                    await CalendarTagApi.updateCalendarTag(
                      params.calendarTagId,
                      mapToRequestBodyForTag(params, values.status.id),
                      session
                    );
                  }
                  break;
              }
              setToast({
                severity: 'success',
                message: t('success'),
              });
            } catch (e) {
              /* istanbul ignore else */
              // this case doesn't necessary to test
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
            } finally {
              await onCloseUpdateStatusModal();
            }
          }}
        >
          <Form>
            <Autocomplete
              required
              name="status"
              options={statusOptions}
              label={t('updateStatus.form.modal.label')}
              helperText={t('updateStatus.form.modal.helperText')}
              dataTestId="staffSetupCalendar-field-status"
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
                onClick={onCloseUpdateStatusModal}
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
                data-testid="staffSetupCalendar-updateStatusModal-submitButton"
              >
                {t('common:update')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;

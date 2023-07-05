import { CalendarSelectionType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ButtonSubmit, Toast } from '@components/ui';
import { useSessionCookies } from '@hooks';
import { CalendarEventApi, CalendarTagApi } from '@services/apis/people';

import {
  FormValues,
  initialValues as defaultInitialValues,
  mapToRequestBody,
  validationSchema,
} from './config';
import { EventFormFields } from './form-fields';
import { mapToEventFormValues } from './config';

interface EventModalProps {
  onCloseModal: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
  initialValues?: FormValues;
  isEditing?: boolean;
}

export const EventModal: FC<EventModalProps> = ({
  onCloseModal,
  isEditing,
  initialValues = defaultInitialValues,
  setToast,
}) => {
  const { t } = useTranslation('staff-setup-calendar');
  const { session } = useSessionCookies();

  const [tagAssociationOptions, setTagAssociationOptions] = useState<
    Option<string>[]
  >([]);

  const [calendarTagId, setCalendarTagId] =
    useState<Nullable<Option<string>>>(null);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { calendarEventId } = values;
        if (isEditing && calendarEventId) {
          await CalendarEventApi.updateCalendarEvent(
            session,
            calendarEventId,
            mapToRequestBody(values)
          );
        } else {
          await CalendarEventApi.createCalendarEvent(
            mapToRequestBody(values),
            session
          );
        }
        onCloseModal();
        setToast({
          severity: 'success',
          message: t('success'),
        });
      } catch (e) {
        /* istanbul ignore next */
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        }
      }
    },
    [isEditing, session, setToast, onCloseModal, t]
  );

  useEffect(() => {
    (async () => {
      try {
        const { calendarTags } = await CalendarTagApi.getSelection(
          CalendarSelectionType.EVENT,
          session
        );
        setTagAssociationOptions(
          calendarTags.map(({ calendarTagId, name }) => ({
            label: name,
            id: calendarTagId,
          }))
        );

        if (initialValues.calendarTagId) {
          setCalendarTagId(
            calendarTags
              .map(({ calendarTagId, name }) => ({
                label: name,
                id: calendarTagId,
              }))
              .find(
                (calendar) =>
                  calendar.id === (initialValues.calendarTagId as unknown)
              ) as Option<string>
          );
        }
      } catch (e) {
        /* istanbul ignore next */
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        }
      }
    })();
  }, [session, setToast, initialValues]);

  const generateForm = useMemo(
    () => (
      <Formik
        initialValues={{
          ...mapToEventFormValues(initialValues),
          calendarTagId,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        <Form noValidate>
          <EventFormFields
            isEditing={isEditing}
            tagAssociationOptions={tagAssociationOptions}
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
              onClick={onCloseModal}
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffSetupCalendar-eventModal-cancelButton"
            >
              {t('common:cancel')}
            </Button>
            <ButtonSubmit
              variant="contained"
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffSetupCalendar-eventModal-submitButton"
            >
              {isEditing ? t('common:update') : t('common:create')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    ),
    [
      calendarTagId,
      initialValues,
      tagAssociationOptions,
      t,
      isEditing,
      onSubmit,
      onCloseModal,
    ]
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
          data-testid="staffSetupCalendar-eventModal-title"
        >
          {isEditing
            ? t('eventModal.editModalTitle')
            : t('eventModal.newModalTitle')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffSetupCalendar-eventModal-description"
        >
          {t('eventModal.newModalDescription')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        {generateForm}
      </DialogContent>
    </Dialog>
  );
};

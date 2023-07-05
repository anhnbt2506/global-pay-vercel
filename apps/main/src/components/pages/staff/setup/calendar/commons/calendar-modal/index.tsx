import { UserSession } from '@ayp/typings/commons';
import { CalendarSelectionType } from '@ayp/typings/entities';
import { CountryOption, Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import memoizee from 'memoizee';
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
import { HIRING_COUNTRIES } from '@configs/constants';
import { useSessionCookies } from '@hooks';
import {
  CalendarConfigApi,
  CalendarTagApi,
  CountryApi,
} from '@services/apis/people';

import {
  ERROR_MESSAGE,
  FormValues,
  initialValues as defaultInitialValues,
  mapToRequestBody,
  validationSchema,
} from './config';
import { CalendarFormFields } from './form-fields';

const getHiringCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries
      .filter((country) => HIRING_COUNTRIES.includes(country.code))
      .map((country) => ({
        id: country.id,
        code: country.code,
        label: country.name,
      }));
  },
  { promise: true }
);

const getCalendarTagsMemo = memoizee(
  async (session: UserSession): Promise<Option<string>[]> => {
    const data = await CalendarTagApi.getSelection(
      CalendarSelectionType.EVENT,
      session
    );
    return data.calendarTags.map(({ calendarTagId, name }) => ({
      label: name,
      id: calendarTagId,
    }));
  },
  { promise: true }
);

interface CalendarModalProps {
  onCloseModal: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
  initialValues?: FormValues;
  isEditing?: boolean;
}

export const CalendarModal: FC<CalendarModalProps> = ({
  onCloseModal,
  isEditing,
  initialValues = defaultInitialValues,
  setToast,
}) => {
  const { t } = useTranslation('staff-setup-calendar');
  const { session } = useSessionCookies();

  const [hiringCountriesOptions, setHiringCountriesOptions] = useState<
    CountryOption[]
  >([]);

  const [countryCode, setCountryCode] = useState<Nullable<CountryOption>>(null);

  const [calendarTagsOptions, setCalendarTagsOptions] = useState<
    Option<string>[]
  >([]);
  const [calendarTags, setCalendarTags] = useState<Option<string>[]>([]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { calendarConfigId } = values;

        if (isEditing && calendarConfigId) {
          await CalendarConfigApi.update(
            session,
            calendarConfigId,
            mapToRequestBody(values)
          );
        } else {
          await CalendarConfigApi.create(mapToRequestBody(values), session);
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
            message:
              e.error.name ===
              ERROR_MESSAGE.SAME_CALENDAR_CONFIGURATION_HAS_BEEN_GENERATED
                ? t(`calendarModal.error.${e.error.name}`)
                : e.error.name,
          });
        }
      }
    },
    [setToast, isEditing, onCloseModal, t, session]
  );

  useEffect(() => {
    // get countries options
    (async () => {
      try {
        const data = await getHiringCountriesMemo();
        setHiringCountriesOptions(data);

        // re-set initial value for countryCode
        if (initialValues.context.countryCode) {
          setCountryCode(
            data.find(
              (country) =>
                country.code === (initialValues.context.countryCode as unknown)
            ) as Nullable<CountryOption>
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

    // get calendar tag options
    (async () => {
      try {
        const options = await getCalendarTagsMemo(session);
        setCalendarTagsOptions(options);

        // re-set initialValues.calendarTags
        if (initialValues.calendarTags) {
          setCalendarTags(
            options.filter((option) =>
              initialValues.calendarTags?.find(
                (item) => item.calendarTagId === option.id
              )
            )
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
  }, [initialValues, session, setToast]);

  const generateForm = useMemo(
    () => (
      <Formik
        initialValues={{
          ...initialValues,
          calendarTags,
          context: { ...initialValues.context, countryCode },
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        <Form noValidate>
          <CalendarFormFields
            isEditing={isEditing}
            hiringCountriesOptions={hiringCountriesOptions}
            calendarTagsOptions={calendarTagsOptions}
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
              data-testid="staffSetupCalendar-calendarModal-cancelButton"
            >
              {t('common:cancel')}
            </Button>
            <ButtonSubmit
              variant="contained"
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffSetupCalendar-calendarModal-submitButton"
            >
              {isEditing ? t('common:update') : t('common:create')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    ),
    [
      calendarTags,
      calendarTagsOptions,
      countryCode,
      hiringCountriesOptions,
      initialValues,
      isEditing,
      onCloseModal,
      onSubmit,
      t,
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
          data-testid="staffSetupCalendar-calendarModal-title"
        >
          {isEditing
            ? t('calendarModal.editModalTitle')
            : t('calendarModal.newModalTitle')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffSetupCalendar-calendarModal-description"
        >
          {t('calendarModal.newModalDescription')}
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

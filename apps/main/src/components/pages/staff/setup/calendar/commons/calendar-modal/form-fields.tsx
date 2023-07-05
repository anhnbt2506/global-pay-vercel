import { CountryCode } from '@ayp/typings/commons';
import { CalendarPeriod, HireType } from '@ayp/typings/entities';
import { CountryOption, Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { Autocomplete, Select, TextField } from '@components/ui';
import {
  CALENDAR_CONFIG_TRIGGER_POINT_OPTIONS,
  CALENDAR_PERIOD_OPTIONS,
  HIRE_TYPE_OPTIONS,
} from '@configs/constants';

import { FormValues } from './config';

export const CalendarFormFields: FC<{
  isEditing?: boolean;
  hiringCountriesOptions: CountryOption[];
  calendarTagsOptions: Option<string>[];
}> = ({ hiringCountriesOptions, calendarTagsOptions }) => {
  const { t } = useTranslation('staff-setup-calendar');

  const {
    values: {
      context: { hireType, countryCode },
    },
    initialValues,
    setFieldValue,
  } = useFormikContext<FormValues>();

  const calendarConfigTriggerPointOptions = useMemo(
    () =>
      CALENDAR_CONFIG_TRIGGER_POINT_OPTIONS.map(
        (calendarConfigTriggerPoint) => ({
          ...calendarConfigTriggerPoint,
          value: calendarConfigTriggerPoint.id,
          label: t(calendarConfigTriggerPoint.label),
        })
      ),
    [t]
  );

  const hireTypeOptions = useMemo(
    () =>
      HIRE_TYPE_OPTIONS.filter(({ id }) => id !== HireType.FREELANCER).map(
        (hireType) => ({
          ...hireType,
          label: t(hireType.label),
        })
      ),
    [t]
  );

  const calendarPeriodOptions = useMemo(
    () =>
      CALENDAR_PERIOD_OPTIONS.map((calendarPeriod) => ({
        ...calendarPeriod,
        value: calendarPeriod.id,
        label: t(calendarPeriod.label),
      })),
    [t]
  );

  const calendarPeriodPomOptions = useMemo(
    () =>
      CALENDAR_PERIOD_OPTIONS.filter(
        ({ id }) => id === CalendarPeriod.MONTHLY
      ).map((calendarPeriod) => ({
        ...calendarPeriod,
        label: t(calendarPeriod.label),
      })),
    [t]
  );

  useEffect(() => {
    if (initialValues.context.countryCode !== countryCode) {
      setFieldValue('context.calendarPeriod', null);
    }
  }, [countryCode, initialValues.context.countryCode, setFieldValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          name="name"
          label={t('calendarModal.formFields.name.label')}
          helperText={t('calendarModal.formFields.name.helperText')}
          dataTestId="staffSetupCalendar-calendarFields-name"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="description"
          label={t('calendarModal.formFields.description.label')}
          helperText={t('calendarModal.formFields.description.helperText')}
          dataTestId="staffSetupCalendar-calendarFields-description"
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="context.hireType"
          options={hireTypeOptions}
          label={t('calendarModal.formFields.context.hireType.label')}
          helperText={t('calendarModal.formFields.context.hireType.helperText')}
          dataTestId="staffSetupCalendar-calendarFields-hireType"
        />
      </Grid>
      {hireType && (
        <>
          <Grid item xs={12}>
            <Select
              required
              name="context.triggerPoint"
              options={calendarConfigTriggerPointOptions}
              label={t('calendarModal.formFields.context.triggerPoint.label')}
              helperText={t(
                'calendarModal.formFields.context.triggerPoint.helperText'
              )}
              dataTestId="staffSetupCalendar-calendarFields-triggerPoint"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              required
              name="context.countryCode"
              options={hiringCountriesOptions}
              variant="country"
              label={t('calendarModal.formFields.context.countryCode.label')}
              helperText={t(
                'calendarModal.formFields.context.countryCode.helperText'
              )}
              dataTestId="staffSetupCalendar-calendarFields-countryCode"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="context.calendarPeriod"
              options={
                countryCode && countryCode.code !== CountryCode.PHILIPPINES
                  ? calendarPeriodPomOptions
                  : calendarPeriodOptions
              }
              label={t('calendarModal.formFields.context.calendarPeriod.label')}
              helperText={t(
                'calendarModal.formFields.context.calendarPeriod.helperText'
              )}
              dataTestId="staffSetupCalendar-calendarFields-calendarPeriod"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              required
              name="calendarTags"
              isMultipleOption
              options={calendarTagsOptions}
              label={t('calendarModal.formFields.calendarTags.label')}
              helperText={t('calendarModal.formFields.calendarTags.helperText')}
              dataTestId="staffSetupCalendar-calendarFields-calendarTags"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

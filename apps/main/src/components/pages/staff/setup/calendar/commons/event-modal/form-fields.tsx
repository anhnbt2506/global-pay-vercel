import { DateType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { Autocomplete, DatePicker, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CALENDAR_CLIENT_INPUT_DATE_OPTIONS,
  CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_OPTIONS,
  DATE_OPTIONS,
  DATE_TYPE_OPTIONS,
} from '@configs/constants';

import { FormValues } from './config';

export const EventFormFields: FC<{
  isEditing?: boolean;
  tagAssociationOptions: Option<string>[];
}> = ({ isEditing, tagAssociationOptions }) => {
  const { t } = useTranslation('staff-setup-calendar');

  const {
    values: { dateType, isAutomatedReminder, dateValue },
    initialValues,
    setFieldValue,
    setTouched,
    setFormikState,
  } = useFormikContext<FormValues>();

  const dateTypeOptions = useMemo(
    () =>
      DATE_TYPE_OPTIONS.map((dateType) => ({
        ...dateType,
        value: dateType.id,
        label: t(dateType.label),
      })),
    [t]
  );

  const clientInputDateOptions = useMemo(
    () =>
      CALENDAR_CLIENT_INPUT_DATE_OPTIONS.map((clientInputDate) => ({
        ...clientInputDate,
        value: clientInputDate.id,
        label: t(clientInputDate.label),
      })),
    [t]
  );

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const adjustmentMethodOptions = useMemo(
    () =>
      CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_OPTIONS.map((method) => ({
        ...method,
        value: method.id,
        label: t(method.label),
      })),
    [t]
  );

  useEffect(() => {
    if (!isEditing && dateType) {
      if (dateType === DateType.CALENDAR_DATE) {
        setFieldValue('dateValue', null);
      } else {
        setFieldValue('dateValue', '');
      }
    }
  }, [setFieldValue, dateType, isEditing]);

  useEffect(() => {
    if (isEditing && initialValues.dateType !== dateType) {
      if (dateType === DateType.CALENDAR_DATE) {
        setFieldValue('dateValue', null);
      } else {
        setFieldValue('dateValue', '');
      }
      setTouched({});
    }
    if (isEditing && initialValues.dateType === dateType) {
      setFieldValue('dateValue', initialValues.dateValue);
      setTouched({});
      setFormikState((prev) => ({
        ...prev,
        submitCount: 0,
      }));
    }
  }, [
    dateType,
    isEditing,
    initialValues,
    setFieldValue,
    setTouched,
    setFormikState,
  ]);

  useEffect(() => {
    if (isEditing && !isAutomatedReminder) {
      setFieldValue('reminderBasedOn', null);
      setFieldValue('reminderDayBeforeEvent', null);
      setTouched({});
    }
  }, [isEditing, isAutomatedReminder, setFieldValue, setTouched]);

  const dateTypeFields = useMemo(() => {
    switch (dateType) {
      case DateType.CALENDAR_DATE: {
        // Override dateValue if it is not a Date or Null to prevent DatePicker error
        const overrideDateValue = Object.assign(
          {},
          !(dateValue instanceof Date) &&
            dateValue !== null && {
              value: null,
            }
        );
        return (
          <Grid item xs={12}>
            <DatePicker
              required
              name="dateValue"
              disableHighlightToday
              label={t('eventModal.formFields.calendarDate.label')}
              helperText={t('eventModal.formFields.calendarDate.helperText')}
              {...overrideDateValue}
            />
          </Grid>
        );
      }
      case DateType.SPECIFIC_DAY:
        return (
          <Grid item xs={12}>
            <Select
              required
              name="dateValue"
              options={DATE_OPTIONS}
              label={t('eventModal.formFields.specificDay.label')}
              helperText={t('eventModal.formFields.specificDay.helperText')}
              dataTestId="staffSetupCalendar-eventFields-dateValue"
            />
          </Grid>
        );
      case DateType.CLIENT_INPUT_DATE:
        return (
          <Grid item xs={12}>
            <Select
              required
              name="dateValue"
              options={clientInputDateOptions}
              label={t('eventModal.formFields.clientInputDate.label')}
              helperText={t('eventModal.formFields.clientInputDate.helperText')}
              dataTestId="staffSetupCalendar-eventFields-dateValue"
            />
          </Grid>
        );
      default:
        return <></>;
    }
  }, [dateType, dateValue, t, clientInputDateOptions]);

  const notificationConfigurationFields = useMemo(
    () =>
      !!isAutomatedReminder ? (
        <>
          <Grid item xs={12}>
            <Select
              required
              name="reminderBasedOn"
              options={adjustmentMethodOptions}
              label={t('eventModal.formFields.reminderBasedOn.label')}
              helperText={t('eventModal.formFields.reminderBasedOn.helperText')}
              dataTestId="staffSetupCalendar-eventFields-reminderBasedOn"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="number"
              name="reminderDayBeforeEvent"
              label={t('eventModal.formFields.reminderDayBeforeEvent.label')}
              helperText={t(
                'eventModal.formFields.reminderDayBeforeEvent.helperText'
              )}
              dataTestId="staffSetupCalendar-eventFields-reminderDayBeforeEvent"
            />
          </Grid>
        </>
      ) : (
        <></>
      ),
    [t, isAutomatedReminder, adjustmentMethodOptions]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          name="name"
          label={t('eventModal.formFields.name.label')}
          helperText={t('eventModal.formFields.name.helperText')}
          dataTestId="staffSetupCalendar-eventFields-name"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="description"
          label={t('eventModal.formFields.description.label')}
          helperText={t('eventModal.formFields.description.helperText')}
          dataTestId="staffSetupCalendar-eventFields-description"
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="dateType"
          options={dateTypeOptions}
          label={t('eventModal.formFields.dateType.label')}
          helperText={t('eventModal.formFields.dateType.helperText')}
          dataTestId="staffSetupCalendar-eventFields-dateType"
        />
      </Grid>
      {dateTypeFields}
      <Grid item xs={12}>
        <Autocomplete
          required
          name="calendarTagId"
          options={tagAssociationOptions}
          label={t('eventModal.formFields.calendarTagId.label')}
          helperText={t('eventModal.formFields.calendarTagId.helperText')}
          dataTestId="staffSetupCalendar-eventFields-calendarTagId"
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="isAutomatedReminder"
          options={yesNoOptions}
          label={t('eventModal.formFields.isAutomatedReminder.label')}
          helperText={t('eventModal.formFields.isAutomatedReminder.helperText')}
          dataTestId="staffSetupCalendar-eventFields-isAutomatedReminder"
        />
      </Grid>
      {notificationConfigurationFields}
    </Grid>
  );
};

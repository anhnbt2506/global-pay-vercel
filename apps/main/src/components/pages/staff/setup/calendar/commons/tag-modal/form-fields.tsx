import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { Autocomplete, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CALENDAR_TAG_ADJUSTMENT_EVENT_TYPES_OPTIONS,
  CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_OPTIONS,
} from '@configs/constants';

import { FormValues } from './configs';

export const TagFormFields: FC<{
  isEditing?: boolean;
  onHandleAdjustmentCalendarTags: (value: boolean) => void;
  adjustmentCalendarTagsOptions: Option<string>[];
}> = ({
  isEditing,
  onHandleAdjustmentCalendarTags,
  adjustmentCalendarTagsOptions,
}) => {
  const { t } = useTranslation('staff-setup-calendar');

  const {
    values: { isAdjustmentRequired },
    initialValues,
    setFieldValue,
    setTouched,
  } = useFormikContext<FormValues>();

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const adjustmentEventOptions = useMemo(
    () =>
      CALENDAR_TAG_ADJUSTMENT_EVENT_TYPES_OPTIONS.map((event) => ({
        ...event,
        value: event.id,
        label: t(event.label),
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
    onHandleAdjustmentCalendarTags(!!isAdjustmentRequired);
  }, [isAdjustmentRequired, onHandleAdjustmentCalendarTags]);

  useEffect(() => {
    if (!isAdjustmentRequired) {
      setFieldValue('adjustmentCalendarTagId', null);
      setFieldValue('adjustmentEvent', null);
      setFieldValue('adjustmentMethod', null);
      setFieldValue('adjustmentDays', null);
    }
    if (isEditing && isAdjustmentRequired) {
      setFieldValue(
        'adjustmentCalendarTagId',
        initialValues.adjustmentCalendarTagId
      );
      setFieldValue('adjustmentEvent', initialValues.adjustmentEvent);
      setFieldValue('adjustmentMethod', initialValues.adjustmentMethod);
      setFieldValue('adjustmentDays', initialValues.adjustmentDays);
      setTouched({});
    }
  }, [
    isAdjustmentRequired,
    initialValues.adjustmentDays,
    initialValues.adjustmentMethod,
    initialValues.adjustmentCalendarTagId,
    initialValues.adjustmentEvent,
    isEditing,
    setFieldValue,
    setTouched,
  ]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          name="name"
          label={t('tagModal.formFields.name.label')}
          helperText={t('tagModal.formFields.name.helperText')}
          dataTestId="staffSetupCalendar-tagFields-name"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="description"
          label={t('tagModal.formFields.description.label')}
          helperText={t('tagModal.formFields.description.helperText')}
          dataTestId="staffSetupCalendar-tagFields-description"
        />
      </Grid>

      <Grid item xs={12}>
        <Select
          required
          name="isAdjustmentRequired"
          options={yesNoOptions}
          label={t('tagModal.formFields.isAdjustmentRequired.label')}
          helperText={t('tagModal.formFields.isAdjustmentRequired.helperText')}
          dataTestId="staffSetupCalendar-tagFields-isAdjustmentRequired"
        />
      </Grid>

      {!!isAdjustmentRequired && (
        <>
          <Grid item xs={12}>
            <Autocomplete
              required
              name="adjustmentCalendarTagId"
              options={adjustmentCalendarTagsOptions}
              label={t('tagModal.formFields.adjustmentCalendarTagId.label')}
              helperText={t(
                'tagModal.formFields.adjustmentCalendarTagId.helperText'
              )}
              dataTestId="staffSetupCalendar-tagFields-adjustmentCalendarTagId"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="adjustmentEvent"
              options={adjustmentEventOptions}
              label={t('tagModal.formFields.adjustmentEvent.label')}
              helperText={t('tagModal.formFields.adjustmentEvent.helperText')}
              dataTestId="staffSetupCalendar-tagFields-adjustmentEvent"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="adjustmentMethod"
              options={adjustmentMethodOptions}
              label={t('tagModal.formFields.adjustmentMethod.label')}
              helperText={t('tagModal.formFields.adjustmentMethod.helperText')}
              dataTestId="staffSetupCalendar-tagFields-adjustmentMethod"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="number"
              name="adjustmentDays"
              label={t('tagModal.formFields.adjustmentDays.label')}
              helperText={t('tagModal.formFields.adjustmentDays.helperText')}
              dataTestId="staffSetupCalendar-tagFields-adjustmentDays"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

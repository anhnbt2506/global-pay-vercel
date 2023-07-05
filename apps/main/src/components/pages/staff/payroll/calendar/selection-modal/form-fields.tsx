import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { TFunction } from 'next-i18next';
import { FC, useEffect } from 'react';

import { Autocomplete } from '@components/ui';

import { FormValues } from './config';

export const SelectionFormFields: FC<{
  t: TFunction;
  clientOptions: Option<string>[];
  calendarOptions: Option<string>[];
  onHandleClientSelected: (value: Nullable<Option<string>>) => void;
}> = ({ t, clientOptions, calendarOptions, onHandleClientSelected }) => {
  const {
    values: { client },
    initialValues,
    setFieldValue,
  } = useFormikContext<FormValues>();

  useEffect(() => {
    onHandleClientSelected(client);
    if (initialValues.client?.id !== client?.id) {
      setFieldValue('calendar', null);
    }
  }, [initialValues, client, setFieldValue, onHandleClientSelected]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="client"
          options={clientOptions}
          label={t('selectCalendar.form.client.label')}
          helperText={t('selectCalendar.form.client.helperText')}
          dataTestId="staffPayrollCalendar-selectionModal-field-client"
        />
      </Grid>
      {!!client && (
        <Grid item xs={12}>
          <Autocomplete
            required
            name="calendar"
            options={calendarOptions}
            label={t('selectCalendar.form.availableCalendars.label')}
            helperText={t('selectCalendar.form.availableCalendars.helperText')}
            dataTestId="staffPayrollCalendar-selectionModal-field-calendar"
          />
        </Grid>
      )}
    </Grid>
  );
};

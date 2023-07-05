import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  MobileTimePicker as MuiTimePicker,
  MobileTimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers/MobileTimePicker';
import type { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormikContext } from 'formik';
import { getErrorFieldProps } from '@ayp/utils';
import { Paper, TextField } from '@mui/material';
import { isValid } from 'date-fns';

interface TimePickerProps
  extends Omit<
    MuiTimePickerProps<Nullable<Date>>,
    'value' | 'onChange' | 'renderInput'
  > {
  name: string;
  required?: boolean;
  helperText?: string;
  dataTestId?: string;
}

export const TimePicker: FC<TimePickerProps> = ({
  name,
  required,
  helperText,
  dataTestId,
  ...props
}) => {
  const { t } = useTranslation();
  const { submitCount, getFieldMeta, getFieldProps, getFieldHelpers } =
    useFormikContext();
  const [meta, field, helpers] = [
    getFieldMeta(name),
    getFieldProps(name),
    getFieldHelpers(name),
  ];
  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiTimePicker<Nullable<Date>>
        ampm={false}
        value={field.value}
        format="HH:mm"
        onChange={(value) => helpers.setValue(isValid(value) ? value : null)}
        slots={{
          mobilePaper: (params) => (
            <Paper {...params} data-testid="timePickerPaper" />
          ),
          textField: (params) => {
            const { value, ...restParams } = params;
            return (
              <TextField
                {...restParams}
                {...field}
                value={value}
                fullWidth
                error={error}
                variant="outlined"
                required={required}
                helperText={errorHelperText ? t(errorHelperText) : helperText}
                data-testid={dataTestId}
              />
            );
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

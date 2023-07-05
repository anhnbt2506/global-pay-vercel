import { getErrorFieldProps } from '@ayp/utils';
import { TextField, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  MobileDatePicker as MuiDatePicker,
  MobileDatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/MobileDatePicker';
import { isValid } from 'date-fns';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';

import { DEFAULT_DATE_FORMAT } from '@configs/constants';
interface DatePickerProps
  extends Omit<
    MuiDatePickerProps<Nullable<Date>>,
    'value' | 'onChange' | 'renderInput'
  > {
  name: string;
  required?: boolean;
  helperText?: string;
  defaultValue?: Nullable<Date>;
  dataTestId?: string;
}

export const DatePicker: FC<DatePickerProps> = ({
  name,
  required,
  helperText,
  defaultValue,
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
      <MuiDatePicker<Nullable<Date>>
        value={field.value === undefined ? defaultValue : field.value}
        format={DEFAULT_DATE_FORMAT}
        onChange={(value) => helpers.setValue(isValid(value) ? value : null)}
        slots={{
          mobilePaper: (params) => (
            <Paper {...params} data-testid="datePickerPaper" />
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

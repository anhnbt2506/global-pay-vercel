import { Option } from '@ayp/typings/ui';
import { getErrorFieldProps } from '@ayp/utils';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SxProps,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { FC, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

interface SelectProps extends MuiSelectProps {
  name: string;
  options: Option[];
  helperText?: string;
  dataTestId?: string;
  withoutHelperText?: boolean;
  isMultipleOption?: boolean;
}

export const Select: FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  required,
  helperText,
  withoutHelperText,
  dataTestId = '',
  isMultipleOption,
  onChange,
  ...props
}) => {
  const defaultValue = !isMultipleOption ? '' : [];
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

  const sx: SxProps = useMemo(
    () => Object.assign({}, withoutHelperText ? { display: 'none' } : {}),
    [withoutHelperText]
  );

  const formControlProps: FormControlProps = {
    fullWidth: true,
    variant: 'outlined',
  };

  return (
    <FormControl {...formControlProps} error={error} required={required}>
      <InputLabel id={id}>{label}</InputLabel>
      <MuiSelect
        {...field}
        id={id}
        label={label}
        multiple={isMultipleOption}
        onChange={(event, value) => {
          helpers.setValue(event.target.value);
          onChange && onChange(event, value);
        }}
        value={
          field.value === undefined || field.value === null
            ? defaultValue
            : field.value
        }
        data-testid={dataTestId}
        {...props}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            value={option.id}
            data-testid={`${dataTestId}-optionId-${option.id}`}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      <FormHelperText error={error} data-testid={`${dataTestId}-error`} sx={sx}>
        {error && errorHelperText ? t(errorHelperText) : helperText}
      </FormHelperText>
    </FormControl>
  );
};

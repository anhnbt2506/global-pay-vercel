import { getErrorFieldProps } from '@ayp/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  InputProps,
  OutlinedInput,
  SxProps,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useMemo, useState } from 'react';

export interface TextFieldProps extends InputProps {
  name: string;
  label?: string;
  helperText?: string;
  disableAutoComplete?: boolean;
  withFieldVisibility?: boolean;
  withoutHelperText?: boolean;
  dataTestId?: string;
}

export const TextField: FC<TextFieldProps> = ({
  name,
  type,
  label,
  required,
  helperText,
  defaultValue = '',
  withFieldVisibility,
  withoutHelperText,
  disableAutoComplete,
  dataTestId,
  ...props
}) => {
  const { t } = useTranslation();
  const { submitCount, getFieldMeta, getFieldProps } = useFormikContext();
  const [meta, field] = [getFieldMeta(name), getFieldProps(name)];
  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );
  const [showField, setShowField] = useState(type !== 'password');

  const sx: SxProps = useMemo(
    () => Object.assign({}, withoutHelperText ? { display: 'none' } : {}),
    [withoutHelperText]
  );

  return (
    <FormControl variant="outlined" error={error} fullWidth>
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <OutlinedInput
        {...field}
        label={label}
        data-testid={dataTestId}
        type={withFieldVisibility && showField ? 'text' : type}
        value={
          field.value === undefined || field.value === null
            ? defaultValue
            : field.value
        }
        endAdornment={
          withFieldVisibility && (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowField(!showField)}>
                {showField ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          )
        }
        {...Object.assign(
          {},
          disableAutoComplete && { autoComplete: 'new-password' },
          props
        )}
      />
      <FormHelperText data-testid={`${dataTestId}-error`} sx={sx}>
        {error && errorHelperText ? t(errorHelperText) : helperText}
      </FormHelperText>
    </FormControl>
  );
};

import { getErrorFieldProps } from '@ayp/utils';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  SxProps,
  TextareaAutosize,
  TextareaAutosizeProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

export interface TextareaProps extends TextareaAutosizeProps {
  name: string;
  label?: string;
  resize?: boolean;
  helperText?: string;
  dataTestId?: string;
  withoutHelperText?: boolean;
}

export const Textarea: FC<TextareaProps> = ({
  name,
  label,
  required,
  helperText,
  defaultValue = '',
  withoutHelperText,
  dataTestId,
  style,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { submitCount, getFieldMeta, getFieldProps } = useFormikContext();
  const [meta, field] = [getFieldMeta(name), getFieldProps(name)];
  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );

  const formSx: SxProps = useMemo(
    () => Object.assign({}, withoutHelperText ? { display: 'none' } : {}),
    [withoutHelperText]
  );

  return (
    <FormControl variant="standard" error={error} fullWidth>
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <TextareaAutosize
        {...field}
        value={
          field.value === undefined || field.value === null
            ? defaultValue
            : field.value
        }
        style={{
          fontSize: '1rem',
          fontFamily: theme.typography.fontFamily,
          ...style,
        }}
        {...props}
        data-testid={dataTestId}
      />
      <FormHelperText sx={formSx} data-testid={`${dataTestId}-error`}>
        {error && errorHelperText ? t(errorHelperText) : helperText}
      </FormHelperText>
    </FormControl>
  );
};

import { getErrorFieldProps } from '@ayp/utils';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { FC } from 'react';

interface CheckboxProps extends MuiCheckboxProps {
  name: string;
  dataTestId?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  name,
  dataTestId,
  sx,
  defaultValue = false,
  ...props
}) => {
  const { submitCount, getFieldMeta, getFieldProps, getFieldHelpers } =
    useFormikContext();
  const [meta, field, helpers] = [
    getFieldMeta(name),
    getFieldProps(name),
    getFieldHelpers(name),
  ];
  const { error } = getErrorFieldProps(meta, submitCount);

  return (
    <MuiCheckbox
      {...field}
      value={
        field.value === undefined || field.value === null
          ? defaultValue
          : field.value
      }
      onChange={(event) => helpers.setValue(!!event.target.checked)}
      sx={{
        color: (theme) => (error ? theme.palette.error.main : undefined),
        ...sx,
      }}
      data-testid={dataTestId}
      {...props}
    />
  );
};

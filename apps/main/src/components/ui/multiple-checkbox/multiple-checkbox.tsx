import { Option } from '@ayp/typings/ui';
import { getErrorFieldProps } from '@ayp/utils';
import {
  Box,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControl,
  FormControlProps,
  FormHelperText,
  Typography,
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { get } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

interface CheckboxItemProps extends MuiCheckboxProps {
  name: string;
  label: string;
}

const CheckboxItem = ({ label, name, ...props }: CheckboxItemProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      lineHeight: '1rem',
      margin: '0.5rem 0',
    }}
  >
    <span style={{ minWidth: '3rem' }}>
      <MuiCheckbox name={name} sx={{ padding: 0 }} value={name} {...props} />
    </span>
    <Typography sx={{ lineHeight: '1.75rem' }}>{label}</Typography>
  </Box>
);

interface MultipleCheckboxProps extends MuiCheckboxProps {
  name: string;
  options: Option<string>[];
  dataTestId?: string;
}

export const MultipleCheckbox: FC<MultipleCheckboxProps> = ({
  name,
  options,
  defaultValue,
  dataTestId,
}) => {
  const { t } = useTranslation();

  const {
    submitCount,
    getFieldMeta,
    getFieldProps,
    getFieldHelpers,
    setFieldValue,
    values,
  } = useFormikContext();

  const [meta, field] = [
    getFieldMeta(name),
    getFieldProps(name),
    getFieldHelpers(name),
  ];

  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );

  const formControlProps: FormControlProps = {
    fullWidth: true,
    variant: 'standard',
  };

  return (
    <FormControl {...formControlProps} error={error}>
      <FieldArray
        name={name}
        render={() =>
          options.map((item) => {
            const name = item.id;

            return (
              <CheckboxItem
                key={name}
                name={name}
                label={item.label}
                checked={
                  field.value === undefined || field.value === null
                    ? !!defaultValue
                    : !!get(values, name)
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue(name, event.target.checked)
                }
              />
            );
          })
        }
      />
      <FormHelperText error={error} data-testid={`${dataTestId}-error`}>
        {error && errorHelperText && t(errorHelperText)}
      </FormHelperText>
    </FormControl>
  );
};

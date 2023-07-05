import { Option } from '@ayp/typings/ui';
import { getErrorFieldProps } from '@ayp/utils';
import {
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormHelperText,
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

interface RadioGroupProps extends MuiRadioGroupProps {
  name: string;
  options: Option<string>[];
  dataTestId?: string;
}

export const RadioGroup: FC<RadioGroupProps> = ({
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, event.target.value);
  };

  const formControlProps: FormControlProps = {
    fullWidth: true,
    variant: 'standard',
  };

  return (
    <FormControl error={error} {...formControlProps}>
      <MuiRadioGroup
        name={name}
        value={field.value ?? defaultValue}
        onChange={handleChange}
        data-testid={dataTestId}
      >
        <FieldArray
          name={name}
          render={() =>
            options.map((item) => {
              return (
                <FormControlLabel
                  key={item.id}
                  value={item.id}
                  label={item.label}
                  control={<MuiRadio />}
                  data-testid={`${dataTestId}-${item.id}`}
                />
              );
            })
          }
        />
      </MuiRadioGroup>
      <FormHelperText error={error}>
        {error && errorHelperText && t(errorHelperText)}
      </FormHelperText>
    </FormControl>
  );
};

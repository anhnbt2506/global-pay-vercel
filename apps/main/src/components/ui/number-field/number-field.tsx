import { getErrorFieldProps } from '@ayp/utils';
import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { ElementType, FC, forwardRef, ReactNode, useMemo } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CustomProps {
  onChange: (event: {
    target: { name: string; value?: number | string };
  }) => void;
  name: string;
}

export interface NumberFieldProps
  extends Omit<TextFieldProps, 'name' | 'helperText'> {
  name: string;
  label?: string;
  defaultValue?: number | '';
  helperText?: string | ((value: string) => ReactNode);
  startAdornment?: ReactNode;
  numberFormatProps?: NumericFormatProps;
  withoutHelperText?: boolean;
  dataTestId?: string;
}

export const NumberField: FC<NumberFieldProps> = ({
  name,
  helperText,
  defaultValue,
  startAdornment,
  numberFormatProps,
  withoutHelperText,
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
  const numberFormatPropsString = JSON.stringify(numberFormatProps ?? {});

  const NumberFormatCustom = useMemo(
    () =>
      forwardRef<typeof NumericFormat<unknown>, CustomProps>(
        function NumberFormatCustom(props, ref) {
          const { onChange, ...other } = props;

          return (
            <NumericFormat
              {...other}
              getInputRef={ref}
              onValueChange={(values) =>
                onChange({
                  target: {
                    name: props.name,
                    value: numberFormatProps?.allowLeadingZeros
                      ? values.value
                      : values.floatValue,
                  },
                })
              }
              {...JSON.parse(numberFormatPropsString)}
            />
          );
        }
      ),
    [numberFormatPropsString, numberFormatProps?.allowLeadingZeros]
  );

  return (
    <TextField
      {...field}
      fullWidth
      error={error}
      variant="outlined"
      value={field.value === undefined ? defaultValue : field.value}
      helperText={
        !withoutHelperText && error && errorHelperText
          ? t(errorHelperText)
          : typeof helperText === 'function'
          ? helperText(field.value)
          : helperText
      }
      InputProps={{
        inputComponent:
          NumberFormatCustom as unknown as ElementType<InputBaseComponentProps>,
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : undefined,
      }}
      data-testid={dataTestId}
      {...props}
    />
  );
};

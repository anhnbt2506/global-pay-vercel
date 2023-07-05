import { PartialBy } from '@ayp/typings/commons';
import { getErrorFieldProps } from '@ayp/utils';
import { Option } from '@ayp/typings/ui';
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  Box,
  FormHelperText,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
  Chip,
  AutocompleteChangeReason,
  AutocompleteValue,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, Fragment, HTMLAttributes, useMemo } from 'react';

import { CountryFlag } from '..';

interface AutocompleteProps<T = Option>
  extends PartialBy<
      MuiAutocompleteProps<
        T,
        boolean | undefined,
        boolean | undefined,
        boolean | undefined
      >,
      'renderInput'
    >,
    Pick<TextFieldProps, 'name' | 'label' | 'required' | 'helperText'> {
  name: string;
  variant?: 'country' | 'currency' | 'dialingCode';
  withoutHelperText?: boolean;
  dataTestId?: string;
  isMultipleOption?: boolean;
  onSelectedOption?: (option: Option) => void;
}

export const Autocomplete: FC<AutocompleteProps> = ({
  name,
  label,
  variant,
  required,
  helperText,
  placeholder,
  dataTestId = '',
  withoutHelperText,
  isMultipleOption,
  freeSolo,
  onSelectedOption,
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

  const getOptionLabel = (option: Option): string => {
    switch (variant) {
      case 'currency':
        return `${option.code} - ${option.label}`;
      case 'dialingCode':
        return `${option.dialingCode} ${option.label}`;
      default:
        return option.label ?? '';
    }
  };

  const renderCountryOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Option
  ) => (
    <Box component="li" {...props} data-testid={`${dataTestId}-${props.id}`}>
      <CountryFlag code={option.code as string} />
      <Typography ml={2}>{option.label}</Typography>
    </Box>
  );

  const renderCurrencyOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Option
  ) => (
    <Box component="li" {...props} data-testid={`${dataTestId}-${props.id}`}>
      <Typography>{`${option.code} - ${option.label}`}</Typography>
    </Box>
  );

  const renderDialingCodeOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Option
  ) => (
    <Box component="li" {...props} data-testid={`${dataTestId}-${props.id}`}>
      <Typography>{`${option.dialingCode} ${option.label}`}</Typography>
    </Box>
  );

  const renderDefaultOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Option
  ) => (
    <Box
      component="li"
      {...props}
      data-testid={`${dataTestId}-${option.id}`}
      key={option.id}
    >
      <Typography>{option.label}</Typography>
    </Box>
  );

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: Option
  ) => {
    switch (variant) {
      case 'country':
        return renderCountryOption(props, option);
      case 'currency':
        return renderCurrencyOption(props, option);
      case 'dialingCode':
        return renderDialingCodeOption(props, option);
      default:
        return renderDefaultOption(props, option);
    }
  };

  function onChange<T, Multiple, DisableClearable, FreeSolo>(
    _event: React.SyntheticEvent,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason
  ) {
    if (freeSolo && (reason === 'createOption' || reason === 'blur')) {
      const values = value as Option[];
      const lastValue = values[values.length - 1] as unknown as string;
      const newValue: Option = {
        id: lastValue,
        label: lastValue,
      };

      if (values.some((option: Option) => option.id === newValue.id)) return;

      onSelectedOption && onSelectedOption(newValue);

      return helpers.setValue([
        ...(field.value ?? []),
        {
          id: lastValue,
          label: lastValue,
        },
      ]);
    }

    onSelectedOption && onSelectedOption(value as Option);

    return helpers.setValue(value);
  }

  return (
    <MuiAutocomplete
      multiple={isMultipleOption}
      renderOption={renderOption}
      renderInput={(params) => (
        <>
          <TextField
            name={name}
            error={error}
            label={label}
            variant="outlined"
            required={required}
            placeholder={placeholder}
            {...params}
          />
          <FormHelperText
            error={error}
            data-testid={`${dataTestId}-error`}
            sx={Object.assign({}, sx, { marginX: '1rem' })}
          >
            {error && errorHelperText ? t(errorHelperText) : helperText}
          </FormHelperText>
        </>
      )}
      {...field}
      value={field.value === undefined ? defaultValue : field.value}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      freeSolo={freeSolo}
      onChange={onChange}
      renderTags={
        freeSolo
          ? (value: Option[], getTagProps) =>
              value.map((option: Option, index: number) => (
                <Fragment key={index}>
                  <Chip
                    variant="outlined"
                    label={option.label}
                    {...getTagProps({ index })}
                    data-testid={`${dataTestId}-chip-${option.id}`}
                  />
                </Fragment>
              ))
          : undefined
      }
      autoSelect={freeSolo ?? undefined}
      getOptionLabel={
        getOptionLabel as unknown as
          | ((option: string | Option<string | number>) => string)
          | undefined
      }
      data-testid={dataTestId}
      {...props}
    />
  );
};

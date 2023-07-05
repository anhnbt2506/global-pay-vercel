import { getErrorFieldProps } from '@ayp/utils';
import { FieldMetaProps, useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { FormHelperText, Grid } from '@mui/material';

interface InlineFieldsProps {
  names: string[];
  helperText: string;
  components: JSX.Element;
}
export const InlineFields: FC<InlineFieldsProps> = ({
  names,
  helperText,
  components,
}) => {
  const { t } = useTranslation();
  const { submitCount, getFieldMeta } = useFormikContext();

  const meta: FieldMetaProps<unknown>[] = [];
  names.forEach((name: string) => meta.push(getFieldMeta(name)));

  const fieldErrors: {
    error?: boolean;
    errorHelperText?: string;
  }[] = [];

  meta.forEach((e) => {
    const { error, helperText: errorHelperText } = getErrorFieldProps(
      e,
      submitCount
    );
    fieldErrors.push({ error, errorHelperText });
  });

  let error: boolean | undefined = undefined;
  let errorHelperText = '';

  fieldErrors.forEach((fieldError) => {
    if (fieldError.error) {
      error = fieldError.error;
    }
    if (fieldError.errorHelperText) {
      errorHelperText = fieldError.errorHelperText;
    }
  });

  return (
    <Grid>
      {components}
      <FormHelperText error={error} sx={{ marginX: '1rem' }}>
        {error && errorHelperText ? t(errorHelperText) : helperText}
      </FormHelperText>
    </Grid>
  );
};

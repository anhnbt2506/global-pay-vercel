import { FieldMetaProps } from 'formik';

export const getErrorFieldProps = (
  meta?: FieldMetaProps<unknown>,
  submitCount?: number
): {
  error?: boolean;
  helperText?: string;
} =>
  meta && (meta.touched || submitCount) && meta.error !== undefined
    ? {
        error: true,
        helperText: meta.error,
      }
    : {};

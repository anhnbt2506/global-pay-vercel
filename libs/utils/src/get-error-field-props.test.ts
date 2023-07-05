import { FieldMetaProps } from 'formik';
import { getErrorFieldProps } from './get-error-field-props';

describe('getErrorFieldProps', () => {
  const constructMeta = (
    obj: Partial<FieldMetaProps<unknown>>
  ): FieldMetaProps<unknown> => ({
    value: '',
    touched: false,
    initialTouched: false,
    ...obj,
  });

  it('should return empty object when meta is undefined', () => {
    expect(getErrorFieldProps(undefined)).toMatchObject({});
  });

  it('should return empty object if either touched or error is undefined', () => {
    expect(getErrorFieldProps(constructMeta({ touched: true }))).toMatchObject(
      {}
    );
    expect(getErrorFieldProps(constructMeta({ error: 'error' }))).toMatchObject(
      {}
    );
  });

  it('should return error props when meta touched and error are present', () => {
    expect(
      getErrorFieldProps(constructMeta({ touched: true, error: 'error' }))
    ).toMatchObject({
      error: true,
      helperText: 'error',
    });
  });

  it('should return error props when meta submitCount is truthy and error are present', () => {
    expect(
      getErrorFieldProps(constructMeta({ touched: false, error: 'error' }), 1)
    ).toMatchObject({
      error: true,
      helperText: 'error',
    });
  });
});

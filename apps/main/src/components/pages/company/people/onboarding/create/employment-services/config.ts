import * as yup from 'yup';

export interface AgreementModalFormValues {
  isSigned: boolean;
}

export const initialValues: AgreementModalFormValues = {
  isSigned: false,
};

export const validationSchema = yup.object().shape({
  isSigned: yup.boolean().oneOf([true], ''),
});

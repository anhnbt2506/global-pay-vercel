import * as yup from 'yup';

export interface EmploymentContractFormValues {
  isSigned: boolean;
}

export const initialValues: EmploymentContractFormValues = {
  isSigned: false,
};

export const validationSchema = yup.object({
  isSigned: yup.boolean().oneOf([true], ''),
});

import { Option } from '@ayp/typings/ui';
import * as yup from 'yup';

export interface AddEmployeeFormValues {
  assignedEmployeeOptions: Option<string>[];
}

export const validationSchema = yup.object({
  assignedEmployeeOptions: yup.array(),
});

export const mapToRequestBody = ({
  assignedEmployeeOptions,
}: AddEmployeeFormValues) => assignedEmployeeOptions.map(({ id }) => id) ?? [];

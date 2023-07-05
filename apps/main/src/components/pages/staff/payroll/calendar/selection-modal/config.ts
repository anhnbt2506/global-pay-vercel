import { CompanyCalendarClient } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';

export interface FormValues {
  client: Nullable<Option<string>>;
  calendar: Nullable<Option<string>>;
}

export const initialValues: FormValues = {
  client: null,
  calendar: null,
};

export type ApiRequestBody = Omit<CompanyCalendarClient, 'name'>;

export const mapClientOptionRequestBody = (
  values: Option<string>
): ApiRequestBody => {
  const { id } = values;

  return { companyId: id };
};

import { BankAccount } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
export interface CompanyPomCountry {
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onClose: VoidFunction;
  initialValues?: Record<string, unknown>;
  isEditing?: boolean;
  companyId: string;
  dataTestId: string;
  bankOptions: Option<string>[];
}

export interface BankAccountFormType
  extends Pick<
    BankAccount,
    'beneficiaryName' | 'accountNumber' | 'branchCode'
  > {
  bankId: Nullable<Option>;
}

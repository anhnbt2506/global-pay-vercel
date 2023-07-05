import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Option } from '@ayp/typings/ui';

import { Autocomplete, TextField } from '@components/ui';

export const BankAccount: FC<{
  dataTestId?: string;
  bankOptions: Option<string>[];
}> = ({ dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom');

  return (
    <>
      <Grid item xs={12}>
        <TextField
          required
          name="bankAccount.beneficiaryName"
          label={t('form.bankAccount.beneficiaryName.label')}
          helperText={t('form.bankAccount.beneficiaryName.helperText')}
          dataTestId={`${dataTestId}-bankAccount-beneficiaryName`}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="bankAccount.accountNumber"
          label={t('form.bankAccount.accountNumber.label')}
          helperText={t('form.bankAccount.accountNumber.helperText')}
          dataTestId={`${dataTestId}-bankAccount-accountNumber`}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="bankAccount.bankId"
          options={bankOptions}
          label={t('form.bankAccount.bank.label')}
          helperText={t('form.bankAccount.bank.helperText')}
          dataTestId={`${dataTestId}-bankAccount-bank`}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="bankAccount.branchCode"
          label={t('form.bankAccount.branchCode.label')}
          helperText={t('form.bankAccount.branchCode.helperText')}
          dataTestId={`${dataTestId}-bankAccount-branchCode`}
        />
      </Grid>
    </>
  );
};

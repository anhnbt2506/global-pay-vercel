import { UserSession } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, useEffect } from 'react';
import { SchemaOf } from 'yup';

import {
  validationSchema as defaultValidationSchema,
  WorkerOnboardingPage,
} from '@components/pages/worker/onboarding/config';
import { Autocomplete, TextField } from '@components/ui';

interface BankDetailsFormProps {
  session: UserSession;
  bankOptions: Option<string>[];
  setValidationSchema: Dispatch<SchemaOf<unknown>>;
}

const BankDetailsForm: FC<BankDetailsFormProps> = ({
  bankOptions,
  setValidationSchema,
}) => {
  const { t } = useTranslation('worker-onboarding');

  useEffect(() => {
    setValidationSchema(
      defaultValidationSchema[WorkerOnboardingPage.BANK_DETAILS]
    );
  }, [setValidationSchema]);

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="workerUser.bankAccount.beneficiaryName"
          label={t('bankDetails.form.bankAccount.beneficiaryName.label')}
          helperText={t(
            'bankDetails.form.bankAccount.beneficiaryName.helperText'
          )}
          dataTestId="workerOnboarding-bankDetails-field-workerUser.bankAccount.beneficiaryName"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="workerUser.bankAccount.accountNumber"
          label={t('bankDetails.form.bankAccount.accountNumber.label')}
          helperText={t(
            'bankDetails.form.bankAccount.accountNumber.helperText'
          )}
          dataTestId="workerOnboarding-bankDetails-field-workerUser.bankAccount.accountNumber"
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="workerUser.bankAccount.bank"
          options={bankOptions}
          label={t('bankDetails.form.bankAccount.bank.label')}
          helperText={t('bankDetails.form.bankAccount.bank.helperText')}
          dataTestId="workerOnboarding-bankDetails-field-workerUser.bankAccount.bank"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="workerUser.bankAccount.branchCode"
          label={t('bankDetails.form.bankAccount.branchCode.label')}
          helperText={t('bankDetails.form.bankAccount.branchCode.helperText')}
          dataTestId="workerOnboarding-bankDetails-field-workerUser.bankAccount.branchCode"
        />
      </Grid>
    </Grid>
  );
};
export default BankDetailsForm;

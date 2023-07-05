import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Grid } from '@mui/material';

import { TextField, DatePicker } from '@components/ui';

const VnForm = () => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.nationalId"
            label={t('identification.form.workerIdentity.nationalId.label')}
            helperText={t(
              'identification.form.workerIdentity.nationalId.helperText'
            )}
            dataTestId="workerOnboarding-identification-field-workerIdentity.nationalId"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerIdentity.nationalIdIssuedDate"
            label={t(
              'identification.form.workerIdentity.nationalIdIssuedDate.label'
            )}
            helperText={t(
              'identification.form.workerIdentity.nationalIdIssuedDate.helperText'
            )}
            dataTestId="workerOnboarding-identification-field-workerIdentity.nationalIdIssuedDate"
          />
        </Grid>
      </>
    ),
    [t]
  );

  return form;
};

export default VnForm;

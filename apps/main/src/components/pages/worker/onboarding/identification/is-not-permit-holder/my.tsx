import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Grid } from '@mui/material';

import { TextField } from '@components/ui';

const MyForm = () => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid item xs={12}>
        <TextField
          required
          name="workerIdentity.passportNumber"
          label={t('identification.form.workerIdentity.passportNumber.label')}
          helperText={t(
            'identification.form.workerIdentity.passportNumber.helperText'
          )}
          dataTestId="workerOnboarding-identification-field-workerIdentity.passportNumber"
        />
      </Grid>
    ),
    [t]
  );

  return form;
};

export default MyForm;

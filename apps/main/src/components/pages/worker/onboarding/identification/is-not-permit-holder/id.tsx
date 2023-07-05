import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Grid } from '@mui/material';

import { TextField } from '@components/ui';

const IdForm = () => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
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
    ),
    [t]
  );

  return form;
};

export default IdForm;

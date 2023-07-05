import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Grid } from '@mui/material';

import { TextField } from '@components/ui';

const PhForm = () => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.tinId"
            label={t('additionalInformation.phForm.tinId.label')}
            helperText={t('additionalInformation.phForm.tinId.helperText')}
            dataTestId="workerOnboarding-identification-field-additionalInfo.tinId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.sssId"
            label={t('additionalInformation.phForm.sssId.label')}
            helperText={t('additionalInformation.phForm.sssId.helperText')}
            dataTestId="workerOnboarding-identification-field-additionalInfo.sssId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.healthId"
            label={t('additionalInformation.phForm.healthId.label')}
            helperText={t('additionalInformation.phForm.healthId.helperText')}
            dataTestId="workerOnboarding-identification-field-additionalInfo.healthId"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.hdmfId"
            label={t('additionalInformation.phForm.hdmfId.label')}
            helperText={t('additionalInformation.phForm.hdmfId.helperText')}
            dataTestId="workerOnboarding-identification-field-additionalInfo.hdmfId"
          />
        </Grid>
      </>
    ),
    [t]
  );

  return form;
};

export default PhForm;

import { Grid } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { TextField } from '@components/ui';

const CompanyInformationForm: FC = () => {
  const { t } = useTranslation('company-onboarding');

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="address.addressLine"
          label={t('companyInformation.form.addressLine.label')}
          helperText={t('companyInformation.form.addressLine.helperText')}
          dataTestId="companyOnboarding-fields-addressLine"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="address.city"
          label={t('companyInformation.form.city.label')}
          helperText={t('companyInformation.form.city.helperText')}
          dataTestId="companyOnboarding-fields-city"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="address.state"
          label={t('companyInformation.form.state.label')}
          helperText={t('companyInformation.form.state.helperText')}
          dataTestId="companyOnboarding-fields-state"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="address.postalCode"
          label={t('companyInformation.form.postalCode.label')}
          helperText={t('companyInformation.form.postalCode.helperText')}
          dataTestId="companyOnboarding-fields-postalCode"
        />
      </Grid>
    </Grid>
  );
};

export default CompanyInformationForm;

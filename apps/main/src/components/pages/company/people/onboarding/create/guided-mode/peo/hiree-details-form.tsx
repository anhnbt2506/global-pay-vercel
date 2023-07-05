import { Grid } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { TextEditor, TextField } from '@components/ui';

const HireeDetailsForm: FC = () => {
  const { t } = useTranslation('company-people-onboarding-create');

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="firstName"
          label={t('guidedMode.PEO.hireeDetails.form.firstName.label')}
          helperText={t(
            'guidedMode.PEO.hireeDetails.form.firstName.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-firstName"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="lastName"
          label={t('guidedMode.PEO.hireeDetails.form.lastName.label')}
          helperText={t('guidedMode.PEO.hireeDetails.form.lastName.helperText')}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-lastName"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="email"
          label={t('guidedMode.PEO.hireeDetails.form.email.label')}
          helperText={t('guidedMode.PEO.hireeDetails.form.email.helperText')}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-email"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="title"
          label={t('guidedMode.PEO.hireeDetails.form.title.label')}
          helperText={t('guidedMode.PEO.hireeDetails.form.title.helperText')}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-title"
        />
      </Grid>
      <Grid item xs={12}>
        <TextEditor
          required
          name="description"
          label={t('guidedMode.PEO.hireeDetails.form.description.label')}
          helperText={t(
            'guidedMode.PEO.hireeDetails.form.description.helperText'
          )}
          init={{
            height: '12rem',
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="employeeId"
          label={t('guidedMode.PEO.hireeDetails.form.employeeId.label')}
          helperText={t(
            'guidedMode.PEO.hireeDetails.form.employeeId.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-employeeId"
        />
      </Grid>
    </Grid>
  );
};

export default HireeDetailsForm;

import { TFunction } from 'next-i18next';
import type { FC } from 'react';
import { Box, Grid } from '@mui/material';
import { TextField } from '@components/ui';

interface CompanySignInFormProps {
  t: TFunction;
}
const CompanySignInForm: FC<CompanySignInFormProps> = ({ t }) => (
  <Box display="flex" justifyContent="center" marginY="3rem">
    <Grid container spacing={4} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="email"
          label={t('form.email.label')}
          data-testid="companySignIn-emailField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          type="password"
          name="password"
          withFieldVisibility
          label={t('form.password.label')}
          dataTestId="companySignIn-passwordField"
        />
      </Grid>
    </Grid>
  </Box>
);

export default CompanySignInForm;

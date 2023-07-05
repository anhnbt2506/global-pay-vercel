import { TFunction } from 'next-i18next';
import type { FC } from 'react';
import { Box, Grid } from '@mui/material';
import { TextField } from '@components/ui';

export interface EmailValidationFormProps {
  t: TFunction;
}

const EmailValidationForm: FC<EmailValidationFormProps> = ({ t }) => (
  <Box display="flex" justifyContent="center" marginY="3rem">
    <Grid container spacing={4} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="email"
          label={t('form.email.label')}
          dataTestId="companySignIn-emailField"
        />
      </Grid>
    </Grid>
  </Box>
);
export default EmailValidationForm;

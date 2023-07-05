import { TFunction } from 'next-i18next';
import { Box, Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { FC, useMemo } from 'react';
import { useDebounce } from 'use-debounce';

import { PasswordCriteria } from '@components/commons';
import { TextField } from '@components/ui';

import { WorkerSignInFormValues } from './config';

interface SetPasswordFormProps {
  t: TFunction;
}

const SetPasswordForm: FC<SetPasswordFormProps> = ({ t }) => {
  const { values } = useFormikContext<WorkerSignInFormValues>();
  const [password] = useDebounce(values.password, 250);

  const passwordCriteria = useMemo(
    () => <PasswordCriteria t={t} password={password} />,
    [t, password]
  );

  return (
    <Box display="flex" justifyContent="center" marginY="3rem">
      <Grid container spacing={4} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="password"
            type="password"
            withFieldVisibility
            autoComplete="password"
            label={t('setPassword.form.password.label')}
            dataTestId="workerSignIn-setPasswordField"
            helperText={t('setPassword.form.password.helperText')}
          />
        </Grid>
        {passwordCriteria}
      </Grid>
    </Box>
  );
};

export default SetPasswordForm;

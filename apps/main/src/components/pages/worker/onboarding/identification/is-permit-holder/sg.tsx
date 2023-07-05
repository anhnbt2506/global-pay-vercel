import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Grid } from '@mui/material';
import { PermitType } from '@ayp/typings/entities';

import { DatePicker, Select, TextField } from '@components/ui';
import { PERMIT_TYPE_OPTIONS } from '@configs/constants';

const SgForm = () => {
  const { t } = useTranslation('worker-onboarding');

  const permitTypeOptions = useMemo(
    () =>
      PERMIT_TYPE_OPTIONS.filter(
        ({ id }) => id === PermitType.EMPLOYMENT_PASS
      ).map((permitType) => ({
        ...permitType,
        label: t(permitType.label),
      })),
    [t]
  );

  const form = useMemo(
    () => (
      <>
        <Grid item xs={12}>
          <Select
            required
            name="workerIdentity.permitType"
            options={permitTypeOptions}
            label={t('identification.form.workerIdentity.permitType.label')}
            helperText={t(
              'identification.form.workerIdentity.permitType.helperText'
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.permitId"
            label={t('identification.form.workerIdentity.permitId.label')}
            helperText={t(
              'identification.form.workerIdentity.permitId.helperText'
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerIdentity.permitIssuedDate"
            label={t(
              'identification.form.workerIdentity.permitIssuedDate.label'
            )}
            helperText={t(
              'identification.form.workerIdentity.permitIssuedDate.helperText'
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerIdentity.permitExpiryDate"
            label={t(
              'identification.form.workerIdentity.permitExpiryDate.label'
            )}
            helperText={t(
              'identification.form.workerIdentity.permitExpiryDate.helperText'
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerIdentity.permitIssuedPlace"
            label={t(
              'identification.form.workerIdentity.permitIssuedPlace.label'
            )}
            helperText={t(
              'identification.form.workerIdentity.permitIssuedPlace.helperText'
            )}
          />
        </Grid>
      </>
    ),
    [t, permitTypeOptions]
  );
  return form;
};

export default SgForm;

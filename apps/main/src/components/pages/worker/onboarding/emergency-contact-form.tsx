import { Option } from '@ayp/typings/ui';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, useEffect, useMemo } from 'react';
import { SchemaOf } from 'yup';

import { Grid } from '@mui/material';
import { Box } from '@mui/system';

import {
  validationSchema as defaultValidationSchema,
  WorkerOnboardingPage,
} from '@components/pages/worker/onboarding/config';
import {
  Autocomplete,
  InlineFields,
  NumberField,
  Select,
  TextField,
} from '@components/ui';
import { EMERGENCY_CONTACT_RELATION_OPTIONS } from '@configs/constants';

interface EmergencyContactFormProps {
  dialingCodes: Option[];
  setValidationSchema: Dispatch<SchemaOf<unknown>>;
}

const EmergencyContactForm: FC<EmergencyContactFormProps> = ({
  dialingCodes,
  setValidationSchema,
}) => {
  const { t } = useTranslation('worker-onboarding');

  useEffect(() => {
    setValidationSchema(
      defaultValidationSchema[WorkerOnboardingPage.EMERGENCY_CONTACT]
    );
  }, [setValidationSchema]);

  const emergencyContactRelationshipOptions = useMemo(
    () =>
      EMERGENCY_CONTACT_RELATION_OPTIONS.map((relation) => ({
        ...relation,
        label: t(relation.label),
      })),
    [t]
  );

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="workerContact.emergencyContactName"
          label={t(
            'emergencyContact.form.workerContact.emergencyContactName.label'
          )}
          helperText={t(
            'emergencyContact.form.workerContact.emergencyContactName.helperText'
          )}
          dataTestId="workerOnboarding-emergencyContact-field-workerContact.emergencyContactName"
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="workerContact.emergencyContactRelationship"
          options={emergencyContactRelationshipOptions}
          label={t(
            'emergencyContact.form.workerContact.emergencyContactRelationship.label'
          )}
          helperText={t(
            'emergencyContact.form.workerContact.emergencyContactRelationship.helperText'
          )}
          dataTestId="workerOnboarding-emergencyContact-field-workerContact.emergencyContactRelationship"
        />
      </Grid>
      <Grid item xs={12}>
        <InlineFields
          names={[
            'workerContact.emergencyContactNumberCountryCode',
            'workerContact.emergencyContactNumber',
          ]}
          components={
            <Box display="flex">
              <Autocomplete
                required
                withoutHelperText
                variant="dialingCode"
                name="workerContact.emergencyContactNumberCountryCode"
                options={dialingCodes}
                label={t(
                  'emergencyContact.form.workerContact.emergencyContactNumberCountryCode.label'
                )}
                helperText={t(
                  'emergencyContact.form.workerContact.emergencyContactNumberCountryCode.helperText'
                )}
                sx={{ flex: 1, marginRight: '1rem' }}
                dataTestId="workerOnboarding-emergencyContact-field-workerContact.emergencyContactNumberCountryCode"
              />
              <NumberField
                required
                withoutHelperText
                label={t(
                  'emergencyContact.form.workerContact.emergencyContactNumber.label'
                )}
                name="workerContact.emergencyContactNumber"
                sx={{ flex: 1 }}
                numberFormatProps={{ allowLeadingZeros: true }}
                dataTestId="workerOnboarding-emergencyContact-field-workerContact.emergencyContactNumber"
              />
            </Box>
          }
          helperText={t(
            'emergencyContact.form.workerContact.emergencyContactNumberCountryCode.helperText'
          )}
        />
      </Grid>
    </Grid>
  );
};
export default EmergencyContactForm;

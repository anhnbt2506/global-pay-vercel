import { Grid, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { CountryOption } from '@ayp/typings/ui';

import {
  Autocomplete,
  InlineFields,
  NumberField,
  Select,
  TextField,
  Toast,
} from '@components/ui';

import { EMERGENCY_CONTACT_RELATION_OPTIONS } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../config';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './config';

interface EditEmergencyContactProps {
  initialValues: WorkerEmploymentFormValues;
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditEmergencyContact: FC<EditEmergencyContactProps> = ({
  onCloseModal,
  onSuccess,
  setToast,
  countries,
  initialValues,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const emergencyContactRelationshipOptions = useMemo(
    () =>
      EMERGENCY_CONTACT_RELATION_OPTIONS.map((relation) => ({
        ...relation,
        label: t(relation.label),
      })),
    [t]
  );

  const emergencyContactForm = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="workerContact.emergencyContactName"
            label={t(
              'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactName.label'
            )}
            helperText={t(
              'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactName.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactName"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workerContact.emergencyContactRelationship"
            options={emergencyContactRelationshipOptions}
            label={t(
              'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactRelationship.label'
            )}
            helperText={t(
              'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactRelationship.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactRelationship"
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
                  options={countries}
                  label={t(
                    'informationForm.editModals.emergencyContact.form.workerContact.contactNumberCountryCode.label'
                  )}
                  helperText={t(
                    'informationForm.editModals.emergencyContact.form.workerContact.contactNumberCountryCode.helperText'
                  )}
                  sx={{ flex: 1, marginRight: '1rem' }}
                  dataTestId="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactNumberCountryCode"
                />
                <NumberField
                  required
                  withoutHelperText
                  label={t(
                    'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactNumber.label'
                  )}
                  name="workerContact.emergencyContactNumber"
                  sx={{ flex: 1 }}
                  numberFormatProps={{ allowLeadingZeros: true }}
                  dataTestId="staffAuditClientHires-employmentId-editInformation.emergencyContact.fields.emergencyContactNumber"
                />
              </Box>
            }
            helperText={t(
              'informationForm.editModals.emergencyContact.form.workerContact.emergencyContactNumber.helperText'
            )}
          />
        </Grid>
      </Grid>
    ),
    [t, emergencyContactRelationshipOptions, countries]
  );

  return (
    <EditModal
      formFields={emergencyContactForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      modalTitle={t('informationForm.editModals.emergencyContact.title')}
    />
  );
};

export default EditEmergencyContact;

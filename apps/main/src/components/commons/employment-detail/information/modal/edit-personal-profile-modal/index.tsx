import { Box, Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { CountryOption } from '@ayp/typings/ui';

import {
  Autocomplete,
  DatePicker,
  InlineFields,
  NumberField,
  Select,
  TextField,
  Toast,
} from '@components/ui';
import {
  GENDER_OPTION,
  MARITAL_STATUS_OPTIONS,
  RELIGION_OPTIONS,
  RACE_OPTIONS,
} from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../config';
import { mapToRequestBody, validationSchema } from './config';
import { EditModal } from '../commons';

interface EditPersonalProfileProps {
  initialValues: WorkerEmploymentFormValues;
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditPersonalProfile: FC<EditPersonalProfileProps> = ({
  onCloseModal,
  onSuccess,
  countries,
  setToast,
  initialValues,
}) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const genderTypeOptions = useMemo(
    () =>
      GENDER_OPTION.map((gender) => ({
        ...gender,
        label: t(gender.label),
      })),
    [t]
  );

  const religionOptions = useMemo(
    () =>
      RELIGION_OPTIONS.map((religion) => ({
        ...religion,
        label: t(religion.label),
      })),
    [t]
  );

  const raceOptions = useMemo(
    () =>
      RACE_OPTIONS.map((race) => ({
        ...race,
        label: t(race.label),
      })),
    [t]
  );

  const maritalStatusOptions = useMemo(
    () =>
      MARITAL_STATUS_OPTIONS.map((maritalStatus) => ({
        ...maritalStatus,
        label: t(maritalStatus.label),
      })),
    [t]
  );

  const personalProfileForm = useMemo(
    () => (
      <>
        <Grid container spacing={2} maxWidth="sm">
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.userContext.user.firstName"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.firstName.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.firstName.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.firstName"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.userContext.user.lastName"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.lastName.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.lastName.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.lastName"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.userContext.user.firstNameAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.firstNameAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.firstNameAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.firstNameAlternate"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.userContext.user.lastNameAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.lastNameAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.userContext.user.lastNameAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.lastNameAlternate"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              required
              name="nationalityCode"
              variant="country"
              options={countries}
              label={t(
                'informationForm.editModals.personalProfile.form.nationalityCode.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.nationalityCode.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.nationalityCode"
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              required
              name="workerUser.dateOfBirth"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.dateOfBirth.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.dateOfBirth.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.dateOfBirth"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="workerUser.gender"
              options={genderTypeOptions}
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.gender.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.gender.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.gender"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="workerUser.race"
              options={raceOptions}
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.race.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.race.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.race"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="workerUser.religion"
              options={religionOptions}
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.religion.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.religion.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.religion"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="workerUser.maritalStatus"
              options={maritalStatusOptions}
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.maritalStatus.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.maritalStatus.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.maritalStatus"
            />
          </Grid>
          <Grid item xs={12}>
            <InlineFields
              names={[
                'workerContact.contactNumberCountryCode',
                'workerContact.contactNumber',
              ]}
              components={
                <Box display="flex">
                  <Autocomplete
                    required
                    withoutHelperText
                    variant="dialingCode"
                    name="workerContact.contactNumberCountryCode"
                    options={countries}
                    label={t(
                      'informationForm.editModals.personalProfile.form.workerContact.contactNumberCountryCode.label'
                    )}
                    helperText={t(
                      'informationForm.editModals.personalProfile.form.workerContact.contactNumberCountryCode.helperText'
                    )}
                    sx={{ flex: 1, marginRight: '1rem' }}
                    dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.contactNumberCountryCode"
                  />
                  <NumberField
                    required
                    withoutHelperText
                    label={t(
                      'informationForm.editModals.personalProfile.form.workerContact.contactNumber.label'
                    )}
                    name="workerContact.contactNumber"
                    sx={{ flex: 1 }}
                    numberFormatProps={{ allowLeadingZeros: true }}
                    dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.contactNumber"
                  />
                </Box>
              }
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerContact.contactNumberCountryCode.helperText'
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.addressLine"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.addressLine.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.addressLine.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.addressLine"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.city"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.city.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.city.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.city"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.state"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.state.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.state.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.state"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.postalCode"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.postalCode.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.postalCode.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.postalCode"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.addressLineAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.addressLineAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.addressLineAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.addressLineAlternate"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.cityAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.cityAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.cityAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.cityAlternate"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.stateAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.stateAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.stateAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.stateAlternate"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="workerUser.address.postalCodeAlternate"
              label={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.postalCodeAlternate.label'
              )}
              helperText={t(
                'informationForm.editModals.personalProfile.form.workerUser.address.postalCodeAlternate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.personalProfile.fields.postalCodeAlternate"
            />
          </Grid>
        </Grid>
      </>
    ),
    [
      t,
      countries,
      genderTypeOptions,
      religionOptions,
      maritalStatusOptions,
      raceOptions,
    ]
  );

  return (
    <EditModal
      formFields={personalProfileForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      modalTitle={t('informationForm.editModals.personalProfile.title')}
    />
  );
};

export default EditPersonalProfile;

import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import {
  Autocomplete,
  DatePicker,
  InlineFields,
  NumberField,
  Select,
  TextField,
} from '@components/ui';
import {
  GENDER_OPTION,
  MARITAL_STATUS_OPTIONS,
  RACE_OPTIONS,
  RELIGION_OPTIONS,
} from '@configs/constants';

interface PersonalProfileFormProps {
  dialingCodes: Option[];
}

const PersonalProfileForm: FC<PersonalProfileFormProps> = ({
  dialingCodes,
}) => {
  const { t } = useTranslation('worker-onboarding');

  const genderTypeOptions = useMemo(
    () =>
      GENDER_OPTION.map((gender) => ({
        ...gender,
        label: t(gender.label),
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

  const religionOptions = useMemo(
    () =>
      RELIGION_OPTIONS.map((religion) => ({
        ...religion,
        label: t(religion.label),
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

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.userContext.user.firstName"
            label={t(
              'workerPersonalProfile.form.workerUser.userContext.user.firstName.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.userContext.user.firstName.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-firstName"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.userContext.user.lastName"
            label={t(
              'workerPersonalProfile.form.workerUser.userContext.user.lastName.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.userContext.user.lastName.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-lastName"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="workerUser.dateOfBirth"
            label={t('workerPersonalProfile.form.workerUser.dateOfBirth.label')}
            helperText={t(
              'workerPersonalProfile.form.workerUser.dateOfBirth.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-dateOfBirth"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workerUser.gender"
            options={genderTypeOptions}
            label={t('workerPersonalProfile.form.workerUser.gender.label')}
            helperText={t(
              'workerPersonalProfile.form.workerUser.gender.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-gender"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workerUser.race"
            options={raceOptions}
            label={t('workerPersonalProfile.form.workerUser.race.label')}
            helperText={t(
              'workerPersonalProfile.form.workerUser.race.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-race"
          />
        </Grid>

        <Grid item xs={12}>
          <Select
            required
            name="workerUser.religion"
            options={religionOptions}
            label={t('workerPersonalProfile.form.workerUser.religion.label')}
            helperText={t(
              'workerPersonalProfile.form.workerUser.religion.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-religion"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workerUser.maritalStatus"
            options={maritalStatusOptions}
            label={t(
              'workerPersonalProfile.form.workerUser.maritalStatus.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.maritalStatus.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-maritalStatus"
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
                  options={dialingCodes}
                  label={t(
                    'workerPersonalProfile.form.workerContact.contactNumberCountryCode.label'
                  )}
                  helperText={t(
                    'workerPersonalProfile.form.workerContact.contactNumberCountryCode.helperText'
                  )}
                  sx={{ flex: 1, marginRight: '1rem' }}
                  dataTestId="workerOnboarding-personalProfile-field-dialingCode"
                />
                <NumberField
                  required
                  withoutHelperText
                  label={t(
                    'workerPersonalProfile.form.workerContact.contactNumber.label'
                  )}
                  name="workerContact.contactNumber"
                  sx={{ flex: 1 }}
                  numberFormatProps={{ allowLeadingZeros: true }}
                  dataTestId="workerOnboarding-personalProfile-field-contactNumber"
                />
              </Box>
            }
            helperText={t(
              'workerPersonalProfile.form.workerContact.contactNumberCountryCode.helperText'
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.address.addressLine"
            label={t(
              'workerPersonalProfile.form.workerUser.address.addressLine.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.address.addressLine.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-addressLine"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.address.city"
            label={t(
              'workerPersonalProfile.form.workerUser.address.city.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.address.city.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-city"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="workerUser.address.state"
            label={t(
              'workerPersonalProfile.form.workerUser.address.state.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.address.state.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-state"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="workerUser.address.postalCode"
            label={t(
              'workerPersonalProfile.form.workerUser.address.postalCode.label'
            )}
            helperText={t(
              'workerPersonalProfile.form.workerUser.address.postalCode.helperText'
            )}
            dataTestId="workerOnboarding-personalProfile-field-postalCode"
          />
        </Grid>
      </Grid>
    ),
    [
      dialingCodes,
      genderTypeOptions,
      raceOptions,
      religionOptions,
      maritalStatusOptions,
      t,
    ]
  );

  return form;
};
export default PersonalProfileForm;

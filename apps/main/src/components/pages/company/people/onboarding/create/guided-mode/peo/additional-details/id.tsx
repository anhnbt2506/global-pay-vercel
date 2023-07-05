import { CountryCode } from '@ayp/typings/commons';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { NumberField, Select } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import {
  VALUE_BETWEEN_MIN_AND_MAX_HELPER_TEXT,
  VALUE_MIN_OF_HELPER_TEXT,
} from '@configs/forms';

import { GuidedModePeoFormValues } from '../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.INDONESIA];

const IdForm: FC = () => {
  const { t } = useTranslation('company-people-onboarding-create');
  const {
    values: { currency },
  } = useFormikContext<GuidedModePeoFormValues>();

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="additionalDetails.probationPeriod"
            label={t(
              'guidedMode.PEO.additionalDetails.form.probationPeriod.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.probationPeriod.unit}`
                ),
              }
            )}
            helperText={t(VALUE_BETWEEN_MIN_AND_MAX_HELPER_TEXT, {
              min: hiringCountryRule.probationPeriod.min,
              max: hiringCountryRule.probationPeriod.max,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-probationPeriod"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="additionalDetails.paidTimeOff"
            label={t(
              'guidedMode.PEO.additionalDetails.form.paidTimeOff.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.paidTimeOff.unit}`
                ),
              }
            )}
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.paidTimeOff.min,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-paidTimeOff"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="additionalDetails.sickTimeOff"
            label={t(
              'guidedMode.PEO.additionalDetails.form.sickTimeOff.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.sickTimeOff.unit}`
                ),
              }
            )}
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.sickTimeOff.min,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-sickTimeOff"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="additionalDetails.terminationNotice"
            label={t(
              'guidedMode.PEO.additionalDetails.form.terminationNotice.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.terminationNotice.unit}`
                ),
              }
            )}
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.terminationNotice.min,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-terminationNotice"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            defaultValue=""
            name="additionalDetails.isEligibleForInsurance"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForInsurance.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForInsurance.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForInsurance"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="additionalDetails.religiousFestivityAllowance"
            label={t(
              'guidedMode.PEO.additionalDetails.form.religiousFestivityAllowance.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.religiousFestivityAllowance.label'
            )}
            startAdornment={currency?.code}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-religiousFestivityAllowance"
          />
        </Grid>
      </Grid>
    ),
    [t, currency?.code, yesNoOptions]
  );

  return form;
};

export default IdForm;

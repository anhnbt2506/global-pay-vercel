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
  PHILIPPINES_FIELD_MANAGERIAL_TYPE_OPTIONS,
} from '@configs/constants';
import { VALUE_MIN_OF_HELPER_TEXT, VALUE_OF_HELPER_TEXT } from '@configs/forms';

import { GuidedModePeoFormValues } from '../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.PHILIPPINES];

const PhForm: FC = () => {
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

  const fieldManagerialTypeOptions = useMemo(
    () =>
      PHILIPPINES_FIELD_MANAGERIAL_TYPE_OPTIONS.map((option) => ({
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
            helperText={t(VALUE_OF_HELPER_TEXT, {
              value: hiringCountryRule.probationPeriod.value,
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
          <Select
            required
            defaultValue=""
            name="additionalDetails.fieldManagerialType"
            options={fieldManagerialTypeOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.fieldManagerialType.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.fieldManagerialType.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-fieldManagerialType"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            defaultValue=""
            name="additionalDetails.isEntitledToOvertimeDifferential"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.isEntitledToOvertimeDifferential.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.isEntitledToOvertimeDifferential.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEntitledToOvertimeDifferential"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            defaultValue=""
            name="additionalDetails.compassionateTimeOff"
            label={t(
              'guidedMode.PEO.additionalDetails.form.compassionateTimeOff.label',
              {
                unit: t(
                  `${CALENDAR_UNIT_LABEL_PREFIX}${hiringCountryRule.compassionateTimeOff.unit}`
                ),
              }
            )}
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.compassionateTimeOff.min,
            })}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-compassionateTimeOff"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="additionalDetails.monthlyAllowance"
            label={t(
              'guidedMode.PEO.additionalDetails.form.monthlyAllowance.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.monthlyAllowance.label'
            )}
            startAdornment={currency?.code}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-monthlyAllowance"
          />
        </Grid>
      </Grid>
    ),
    [t, currency?.code, yesNoOptions, fieldManagerialTypeOptions]
  );

  return form;
};

export default PhForm;

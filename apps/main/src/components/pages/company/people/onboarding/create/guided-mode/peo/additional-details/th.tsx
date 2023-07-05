import { CountryCode } from '@ayp/typings/commons';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { NumberField, Select, TextEditor } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CALENDAR_UNIT_LABEL_PREFIX,
  HIRING_COUNTRY_RULES,
} from '@configs/constants';
import { VALUE_MIN_OF_HELPER_TEXT } from '@configs/forms';

import { GuidedModePeoFormValues } from '../config';

const hiringCountryRule = HIRING_COUNTRY_RULES[CountryCode.THAILAND];

const ThForm: FC = () => {
  const { t } = useTranslation('company-people-onboarding-create');
  const {
    values: {
      additionalDetails: {
        isEligibleForVariablePay,
        isEligibleForAnnualBonus,
        isEligibleForCommission,
      },
    },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<GuidedModePeoFormValues>();

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForVariablePay) {
      setFieldValue('additionalDetails.variablePayDescription', null);
      setFieldTouched('additionalDetails.variablePayDescription', false);
    }
  }, [isEligibleForVariablePay, setFieldValue, setFieldTouched]);

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForAnnualBonus) {
      setFieldValue('additionalDetails.annualBonusDescription', null);
      setFieldTouched('additionalDetails.annualBonusDescription', false);
    }
  }, [isEligibleForAnnualBonus, setFieldValue, setFieldTouched]);

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForCommission) {
      setFieldValue('additionalDetails.commissionDescription', null);
      setFieldTouched('additionalDetails.commissionDescription', false);
    }
  }, [isEligibleForCommission, setFieldValue, setFieldTouched]);

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
            helperText={t(VALUE_MIN_OF_HELPER_TEXT, {
              min: hiringCountryRule.probationPeriod.min,
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
            name="additionalDetails.isEligibleForVariablePay"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForVariablePay.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForVariablePay.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForVariablePay"
          />
        </Grid>
        {!!isEligibleForVariablePay && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="additionalDetails.variablePayDescription"
              label={t(
                'guidedMode.PEO.additionalDetails.form.variablePayDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.additionalDetails.form.variablePayDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
              data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-variablePayDescription"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="additionalDetails.isEligibleForAnnualBonus"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForAnnualBonus.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForAnnualBonus.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForAnnualBonus"
          />
        </Grid>
        {!!isEligibleForAnnualBonus && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="additionalDetails.annualBonusDescription"
              label={t(
                'guidedMode.PEO.additionalDetails.form.annualBonusDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.additionalDetails.form.annualBonusDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
              data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-annualBonusDescription"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="additionalDetails.isEligibleForCommission"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForCommission.label'
            )}
            helperText={t(
              'guidedMode.PEO.additionalDetails.form.isEligibleForCommission.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-isEligibleForCommission"
          />
        </Grid>
        {!!isEligibleForCommission && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="additionalDetails.commissionDescription"
              label={t(
                'guidedMode.PEO.additionalDetails.form.commissionDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.additionalDetails.form.commissionDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
              data-testid="companyPeopleOnboardingCreate-guidedMode-peo-field-additionalDetails-commissionDescription"
            />
          </Grid>
        )}
      </Grid>
    ),
    [
      t,
      yesNoOptions,
      isEligibleForVariablePay,
      isEligibleForAnnualBonus,
      isEligibleForCommission,
    ]
  );

  return form;
};

export default ThForm;

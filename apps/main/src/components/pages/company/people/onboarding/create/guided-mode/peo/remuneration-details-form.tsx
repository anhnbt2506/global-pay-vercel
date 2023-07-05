import { Grid } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormikContext } from 'formik';

import { NumberField, Select, TextEditor } from '@components/ui';
import { BOOLEAN_OPTIONS } from '@configs/constants';

import { GuidedModePeoFormValues } from './config';

const RemunerationDetailsForm: FC = () => {
  const { t } = useTranslation('company-people-onboarding-create');
  const {
    values: {
      currency,
      isEligibleForAdditionalIncome,
      isEligibleForPaidExpenses,
      isEntitledToOvertime,
    },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<GuidedModePeoFormValues>();

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForAdditionalIncome) {
      setFieldValue('additionalIncomeDescription', null);
      setFieldTouched('additionalIncomeDescription', false);
    }
  }, [isEligibleForAdditionalIncome, setFieldValue, setFieldTouched]);

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForPaidExpenses) {
      setFieldValue('paidExpensesDescription', null);
      setFieldTouched('paidExpensesDescription', false);
    }
  }, [isEligibleForPaidExpenses, setFieldValue, setFieldTouched]);

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEntitledToOvertime) {
      setFieldValue('overtimeDescription', null);
      setFieldTouched('overtimeDescription', false);
    }
  }, [isEntitledToOvertime, setFieldValue, setFieldTouched]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const salaryPayableDateOptions = useMemo(
    () =>
      Array(31)
        .fill('')
        .map((value, index) => ({
          id: index + 1,
          label: `${index + 1}`,
        })),
    []
  );

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <NumberField
            required
            name="salaryPerMonth"
            label={t(
              'guidedMode.PEO.remunerationDetails.form.salaryPerMonth.label'
            )}
            helperText={(value) => {
              const salaryPerMonth = parseFloat(value);

              return t(
                'guidedMode.PEO.remunerationDetails.form.salaryPerMonth.helperText',
                {
                  salaryPerYear: `${
                    currency?.code
                  } ${new Intl.NumberFormat().format(
                    isNaN(salaryPerMonth) ? 0 : salaryPerMonth * 12
                  )}`,
                }
              );
            }}
            startAdornment={currency?.code}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPerMonth"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="salaryPayableDate"
            options={salaryPayableDateOptions}
            label={t(
              'guidedMode.PEO.remunerationDetails.form.salaryPayableDate.label'
            )}
            helperText={t(
              'guidedMode.PEO.remunerationDetails.form.salaryPayableDate.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-salaryPayableDate"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="isEligibleForAdditionalIncome"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.remunerationDetails.form.isEligibleForAdditionalIncome.label'
            )}
            helperText={t(
              'guidedMode.PEO.remunerationDetails.form.isEligibleForAdditionalIncome.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForAdditionalIncome"
          />
        </Grid>
        {!!isEligibleForAdditionalIncome && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="additionalIncomeDescription"
              label={t(
                'guidedMode.PEO.remunerationDetails.form.additionalIncomeDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.remunerationDetails.form.additionalIncomeDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="isEligibleForPaidExpenses"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.remunerationDetails.form.isEligibleForPaidExpenses.label'
            )}
            helperText={t(
              'guidedMode.PEO.remunerationDetails.form.isEligibleForPaidExpenses.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isEligibleForPaidExpenses"
          />
        </Grid>
        {!!isEligibleForPaidExpenses && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="paidExpensesDescription"
              label={t(
                'guidedMode.PEO.remunerationDetails.form.paidExpensesDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.remunerationDetails.form.paidExpensesDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="isEntitledToOvertime"
            options={yesNoOptions}
            label={t(
              'guidedMode.PEO.remunerationDetails.form.isEntitledToOvertime.label'
            )}
            helperText={t(
              'guidedMode.PEO.remunerationDetails.form.isEntitledToOvertime.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isEntitledToOvertime"
          />
        </Grid>
        {!!isEntitledToOvertime && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="overtimeDescription"
              label={t(
                'guidedMode.PEO.remunerationDetails.form.overtimeDescription.label'
              )}
              helperText={t(
                'guidedMode.PEO.remunerationDetails.form.overtimeDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
            />
          </Grid>
        )}
      </Grid>
    ),
    [
      t,
      currency,
      yesNoOptions,
      salaryPayableDateOptions,
      isEligibleForAdditionalIncome,
      isEligibleForPaidExpenses,
      isEntitledToOvertime,
    ]
  );

  return form;
};

export default RemunerationDetailsForm;

import { PayrollCycle, ProrateSalaryFormula } from '@ayp/typings/entities';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { TFunction } from 'next-i18next';
import { FC, useMemo } from 'react';

import { Select } from '@components/ui';
import {
  DATE_OPTIONS,
  MONTHLY_PAYROLL_CYCLE_DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { FormValues } from './config';

const PhFormFields: FC<{
  t: TFunction;
  dataTestId: string;
}> = ({ t, dataTestId }) => {
  const {
    values: { payrollCycle },
  } = useFormikContext<FormValues>();

  const isSemiPayrollCycle = payrollCycle === PayrollCycle.SEMI_MONTHLY;

  const payrollCycleOptions = useMemo(
    () =>
      PAYROLL_CYCLE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const semiMonthlyPayrollDateOptions = useMemo(
    () =>
      DATE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const monthlyPayrollDateOptions = useMemo(
    () =>
      MONTHLY_PAYROLL_CYCLE_DATE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const prorateSalaryFormulaOptions = useMemo(
    () =>
      PRORATE_SALARY_FORMULA_OPTIONS.filter(
        ({ id }) =>
          id === ProrateSalaryFormula.CALENDAR_DAYS ||
          id === ProrateSalaryFormula.WORKING_DAYS ||
          id === ProrateSalaryFormula.AVERAGE_WORKING_DAYS
      ).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const formSemiMonthly = (
    <>
      <Grid item xs={12}>
        <Select
          required
          name="secondPayrollDate"
          options={semiMonthlyPayrollDateOptions}
          label={t('serviceDetail.form.ph.secondPayrollDate.label')}
          helperText={t('serviceDetail.form.ph.secondPayrollDate.helperText')}
          dataTestId={`${dataTestId}-fields-semiMonthlyPayrollDate`}
        />
      </Grid>
    </>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          required
          name="payrollCycle"
          options={payrollCycleOptions}
          label={t('serviceDetail.form.ph.payrollCycle.label')}
          helperText={t('serviceDetail.form.ph.payrollCycle.helperText')}
          dataTestId={`${dataTestId}-fields-payrollCycle`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={
            isSemiPayrollCycle
              ? semiMonthlyPayrollDateOptions
              : monthlyPayrollDateOptions
          }
          label={t(
            `serviceDetail.form.ph.payrollDate.${
              isSemiPayrollCycle ? 'semiLabel' : 'label'
            }`
          )}
          helperText={t('serviceDetail.form.ph.payrollDate.helperText')}
          dataTestId={`${dataTestId}-fields-payrollDate`}
        />
      </Grid>
      {isSemiPayrollCycle && formSemiMonthly}
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={prorateSalaryFormulaOptions}
          label={t('serviceDetail.form.ph.prorateSalaryFormula.label')}
          helperText={t(
            'serviceDetail.form.ph.prorateSalaryFormula.helperText'
          )}
          dataTestId={`${dataTestId}-fields-prorateSalaryFormula`}
        />
      </Grid>
    </Grid>
  );
};

export default PhFormFields;

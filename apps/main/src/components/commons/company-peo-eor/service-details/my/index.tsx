import { PayrollCycle, ProrateSalaryFormula } from '@ayp/typings/entities';
import { Grid } from '@mui/material';
import { TFunction } from 'next-i18next';
import { FC, useMemo } from 'react';

import { Select } from '@components/ui';
import {
  MONTHLY_PAYROLL_CYCLE_DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

const MyFormFields: FC<{
  t: TFunction;
  dataTestId: string;
}> = ({ t, dataTestId }) => {
  const payrollCycleOptions = useMemo(
    () =>
      PAYROLL_CYCLE_OPTIONS.filter(({ id }) => id === PayrollCycle.MONTHLY).map(
        (payrollCycle) => ({
          ...payrollCycle,
          label: t(payrollCycle.label),
        })
      ),
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
          id === ProrateSalaryFormula['26_DAYS'] ||
          id === ProrateSalaryFormula.CALENDAR_DAYS
      ).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          required
          name="payrollCycle"
          options={payrollCycleOptions}
          label={t('serviceDetail.form.my.payrollCycle.label')}
          helperText={t('serviceDetail.form.my.payrollCycle.helperText')}
          dataTestId={`${dataTestId}-fields-payrollCycle`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={monthlyPayrollDateOptions}
          label={t('serviceDetail.form.my.payrollDate.label')}
          helperText={t('serviceDetail.form.my.payrollDate.helperText')}
          dataTestId={`${dataTestId}-fields-payrollDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={prorateSalaryFormulaOptions}
          label={t('serviceDetail.form.my.prorateSalaryFormula.label')}
          helperText={t(
            'serviceDetail.form.my.prorateSalaryFormula.helperText'
          )}
          dataTestId={`${dataTestId}-fields-prorateSalaryFormula`}
        />
      </Grid>
    </Grid>
  );
};

export default MyFormFields;

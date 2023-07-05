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

const VnFormFields: FC<{
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
          id === ProrateSalaryFormula.CALENDAR_DAYS ||
          id === ProrateSalaryFormula.WORKING_DAYS
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
          label={t('serviceDetail.form.vn.payrollCycle.label')}
          helperText={t('serviceDetail.form.vn.payrollCycle.helperText')}
          dataTestId={`${dataTestId}-fields-payrollCycle`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={monthlyPayrollDateOptions}
          label={t('serviceDetail.form.vn.payrollDate.label')}
          helperText={t('serviceDetail.form.vn.payrollDate.helperText')}
          dataTestId={`${dataTestId}-fields-payrollDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={prorateSalaryFormulaOptions}
          label={t('serviceDetail.form.vn.prorateSalaryFormula.label')}
          helperText={t(
            'serviceDetail.form.vn.prorateSalaryFormula.helperText'
          )}
          dataTestId={`${dataTestId}-fields-prorateSalaryFormula`}
        />
      </Grid>
    </Grid>
  );
};

export default VnFormFields;

import {
  CountryCode,
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import {
  HireType,
  PayrollCycle,
  ProrateSalaryFormula,
} from '@ayp/typings/entities';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { FileUpload, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { FormValues } from './config';

const ThFormFields: FC<{
  isEditing: boolean;
  companyId: string;
  dataTestId: string;
}> = ({ isEditing, companyId, dataTestId }) => {
  const { t } = useTranslation('company-pom-th-form');
  const context: FileManagementContext = {
    type: FileManagementContextType.COMPANY,
    companyId: companyId,
    hireType: HireType.POM,
    countryCode: CountryCode.THAILAND,
  };
  const {
    values: { isAypAssistESubmission },
    initialValues,
    setFieldValue,
    setTouched,
  } = useFormikContext<FormValues>();

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const onlyYesOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.filter(({ id }) => id === 1).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

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

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('ssoEFilingUsername', null);
      setFieldValue('ssoEFilingPassword', null);
      setFieldValue('revenueEFilingUsername', null);
      setFieldValue('revenueEFilingPassword', null);
    }
    if (isEditing && isAypAssistESubmission) {
      setFieldValue('ssoEFilingUsername', initialValues.ssoEFilingUsername);
      setFieldValue('ssoEFilingPassword', initialValues.ssoEFilingPassword);
      setFieldValue(
        'revenueEFilingUsername',
        initialValues.revenueEFilingUsername
      );
      setFieldValue(
        'revenueEFilingPassword',
        initialValues.revenueEFilingPassword
      );
      setTouched({});
    }
  }, [
    isAypAssistESubmission,
    isEditing,
    initialValues.ssoEFilingUsername,
    initialValues.ssoEFilingPassword,
    initialValues.revenueEFilingUsername,
    initialValues.revenueEFilingPassword,
    setFieldValue,
    setTouched,
  ]);

  const salaryFormulaOptions = useMemo(
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
          label={t('form.payrollCycle.label')}
          helperText={t('form.payrollCycle.helperText')}
          dataTestId={`${dataTestId}-payrollCycle`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollCutOffDate"
          options={DATE_OPTIONS}
          label={t('form.payrollCutOffDate.label')}
          helperText={t('form.payrollCutOffDate.helperText')}
          dataTestId={`${dataTestId}-payrollCutOffDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={DATE_OPTIONS}
          label={t('form.payrollDate.label')}
          helperText={t('form.payrollDate.helperText')}
          dataTestId={`${dataTestId}-payrollDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={salaryFormulaOptions}
          label={t('form.prorateSalaryFormula.label')}
          helperText={t('form.prorateSalaryFormula.helperText')}
          dataTestId={`${dataTestId}-prorateSalaryFormula`}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="socialSecurityId"
          label={t('form.socialSecurityId.label')}
          helperText={t(`form.socialSecurityId.helperText`)}
          dataTestId={`${dataTestId}-socialSecurityId`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="isAypAssistESubmission"
          options={yesNoOptions}
          label={t('form.isAypAssistESubmission.label')}
          helperText={t('form.isAypAssistESubmission.helperText')}
          dataTestId={`${dataTestId}-isAypAssistESubmission`}
        />
      </Grid>
      {!!isAypAssistESubmission && (
        <>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              disableAutoComplete
              withFieldVisibility
              name="ssoEFilingUsername"
              label={t('form.ssoEFilingUsername.label')}
              helperText={t('form.ssoEFilingUsername.helperText')}
              dataTestId={`${dataTestId}-ssoEFilingUsername`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              disableAutoComplete
              type="password"
              name="ssoEFilingPassword"
              withFieldVisibility
              label={t('form.ssoEFilingPassword.label')}
              helperText={t('form.ssoEFilingPassword.helperText')}
              dataTestId={`${dataTestId}-ssoEFilingPassword`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              required
              disableAutoComplete
              withFieldVisibility
              name="revenueEFilingUsername"
              label={t('form.revenueEFilingUsername.label')}
              helperText={t('form.revenueEFilingUsername.helperText')}
              dataTestId={`${dataTestId}-revenueEFilingUsername`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="password"
              disableAutoComplete
              name="revenueEFilingPassword"
              withFieldVisibility
              label={t('form.revenueEFilingPassword.label')}
              helperText={t('form.revenueEFilingPassword.helperText')}
              dataTestId={`${dataTestId}-revenueEFilingPassword`}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Select
          required
          name="isUsingDisbursementService"
          options={onlyYesOptions}
          label={t('form.isUsingDisbursementService.label')}
          helperText={t(`form.isUsingDisbursementService.helperText`)}
          dataTestId={`${dataTestId}-isUsingDisbursementService`}
        />
      </Grid>
      <Typography
        variant="subtitle2"
        textAlign="center"
        marginLeft="1rem"
        marginTop="1rem"
        fontWeight="bold"
      >
        {t('form.supportingDocuments')}
      </Typography>

      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="companyAffidavitFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.companyAffidavitFile.label')}
          context={context}
          dataTestId={`${dataTestId}-companyAffidavitFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="payrollReportFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.payrollReportFile.label')}
          context={context}
          dataTestId={`${dataTestId}-payrollReportFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="ssoReportFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.ssoReportFile.label')}
          context={context}
          dataTestId={`${dataTestId}-ssoReportFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="pnd1ReportSinceJanuaryFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.pnd1ReportSinceJanuaryFile.label')}
          context={context}
          dataTestId={`${dataTestId}-pnd1ReportSinceJanuaryFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="pnd1ReportPreviousYearFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.pnd1ReportPreviousYearFile.label')}
          context={context}
          dataTestId={`${dataTestId}-pnd1ReportPreviousYearFile`}
        />
      </Grid>
    </Grid>
  );
};

export default ThFormFields;

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
import { Option } from '@ayp/typings/ui';
import { FC, useEffect, useMemo } from 'react';

import { FileUpload, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  COMPANY_POM_VN_SHUI_PROVIDER_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { BankAccount } from '../commons';
import { FormValues, initialValues as defaultValues } from './config';
import { initialBankAccount } from '../commons/config';

const VnFormFields: FC<{
  isEditing: boolean;
  companyId: string;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, companyId, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-vn-form');
  const context: FileManagementContext = {
    type: FileManagementContextType.COMPANY,
    companyId: companyId,
    hireType: HireType.POM,
    countryCode: CountryCode.VIETNAM,
  };

  const {
    values: {
      isAypAssistESubmission,
      isUsingDisbursementService,
      isGenerateBankFile,
    },
    setFieldValue,
    initialValues,
    setTouched,
  } = useFormikContext<FormValues>();

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('shuiUserId', null);
      setFieldValue('shuiPassword', null);
    }

    if (isEditing && isAypAssistESubmission) {
      setFieldValue('shuiUserId', initialValues.shuiUserId);
      setFieldValue('shuiPassword', initialValues.shuiPassword);
      setTouched({});
    }
  }, [
    initialValues.shuiPassword,
    initialValues.shuiUserId,
    isAypAssistESubmission,
    isEditing,
    setFieldValue,
    setTouched,
  ]);

  useEffect(() => {
    if (
      initialValues.isUsingDisbursementService !== isUsingDisbursementService
    ) {
      setFieldValue('isGenerateBankFile', defaultValues.isGenerateBankFile);
      setTouched({});
    }

    if (
      isEditing &&
      !isUsingDisbursementService &&
      initialValues.isGenerateBankFile
    ) {
      setFieldValue('isGenerateBankFile', initialValues.isGenerateBankFile);
    }
  }, [
    initialValues.isUsingDisbursementService,
    initialValues.isGenerateBankFile,
    isUsingDisbursementService,
    isEditing,
    initialValues.bankAccount,
    setFieldValue,
    setTouched,
  ]);

  useEffect(() => {
    if (!!isGenerateBankFile) {
      setFieldValue('bankAccount', initialBankAccount);
      setTouched({});
    }
    if (isEditing && !!isGenerateBankFile && initialValues.bankAccount) {
      setFieldValue('bankAccount', initialValues.bankAccount);
    }
  }, [
    isGenerateBankFile,
    isEditing,
    initialValues.bankAccount,
    setFieldValue,
    setTouched,
  ]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const isGenerateBankFileOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.filter(({ id }) => bankOptions.length || !id).map(
        (option) => ({
          ...option,
          label: t(option.label),
        })
      ),
    [t, bankOptions.length]
  );

  const payrollCycleOptions = useMemo(
    () =>
      PAYROLL_CYCLE_OPTIONS.filter(({ id }) => id === PayrollCycle.MONTHLY).map(
        (option) => ({
          ...option,
          label: t(option.label),
        })
      ),
    [t]
  );

  const dateOptions = useMemo(
    () =>
      DATE_OPTIONS.map((option) => ({
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

  const shuiProviderOptions = useMemo(
    () =>
      COMPANY_POM_VN_SHUI_PROVIDER_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const aypAssistESubmissionFields = useMemo(
    () => (
      <>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="shuiUserId"
            label={t('form.shuiUserId.label')}
            helperText={t('form.shuiUserId.helperText')}
            dataTestId={`${dataTestId}-shuiUserId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="shuiPassword"
            label={t('form.shuiPassword.label')}
            helperText={t('form.shuiPassword.helperText')}
            dataTestId={`${dataTestId}-shuiPassword`}
          />
        </Grid>
      </>
    ),
    [t, dataTestId]
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
          options={dateOptions}
          label={t('form.payrollCutOffDate.label')}
          helperText={t('form.payrollCutOffDate.helperText')}
          dataTestId={`${dataTestId}-payrollCutOffDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="payrollDate"
          options={dateOptions}
          label={t('form.payrollDate.label')}
          helperText={t('form.payrollDate.helperText')}
          dataTestId={`${dataTestId}-payrollDate`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="prorateSalaryFormula"
          options={prorateSalaryFormulaOptions}
          label={t('form.prorateSalaryFormula.label')}
          helperText={t('form.prorateSalaryFormula.helperText')}
          dataTestId={`${dataTestId}-prorateSalaryFormula`}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="shuiCode"
          label={t('form.shuiCode.label')}
          helperText={t('form.shuiCode.helperText')}
          dataTestId={`${dataTestId}-shuiCode`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="shuiProvider"
          options={shuiProviderOptions}
          label={t('form.shuiProvider.label')}
          helperText={t('form.shuiProvider.helperText')}
          dataTestId={`${dataTestId}-shuiProvider`}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          name="isAypAssistESubmission"
          options={yesNoOptions}
          label={t('form.isAypAssistESubmission.label')}
          helperText={t('form.isAypAssistESubmission.helperText')}
          dataTestId={`${dataTestId}-isAypAssistESubmission`}
        />
      </Grid>
      {!!isAypAssistESubmission && aypAssistESubmissionFields}
      <Grid item xs={12}>
        <Select
          name="isUsingDisbursementService"
          options={yesNoOptions}
          label={t('form.isUsingDisbursementService.label')}
          helperText={t('form.isUsingDisbursementService.helperText')}
          dataTestId={`${dataTestId}-isUsingDisbursementService`}
        />
      </Grid>
      {!isUsingDisbursementService && isUsingDisbursementService !== null && (
        <Grid item xs={12}>
          <Select
            required
            name="isGenerateBankFile"
            options={isGenerateBankFileOptions}
            label={t('form.isGenerateBankFile.label')}
            helperText={t(`form.isGenerateBankFile.helperText`)}
            dataTestId={`${dataTestId}-isGenerateBankFile`}
          />
        </Grid>
      )}
      {!!isGenerateBankFile && (
        <BankAccount dataTestId={dataTestId} bankOptions={bankOptions} />
      )}
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
          name="businessLicenceFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.businessLicenceFile.label')}
          context={context}
          dataTestId={`${dataTestId}-businessLicenceFile`}
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
          name="pitReportSinceQ1File"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.pitReportSinceQ1File.label')}
          context={context}
          dataTestId={`${dataTestId}-pitReportSinceQ1File`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="pitReportLastYearFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.pitReportLastYearFile.label')}
          context={context}
          dataTestId={`${dataTestId}-pitReportLastYearFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="shuiReportFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.shuiReportFile.label')}
          context={context}
          dataTestId={`${dataTestId}-shuiReportFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="labourContractsFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.labourContractsFile.label')}
          context={context}
          dataTestId={`${dataTestId}-labourContractsFile`}
        />
      </Grid>
    </Grid>
  );
};

export default VnFormFields;

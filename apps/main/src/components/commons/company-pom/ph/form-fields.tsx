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
import { Option } from '@ayp/typings/ui';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { FileUpload, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  COMPANY_POM_PH_STATUTORY_DEDUCTIONS_OPTIONS,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { BankAccount } from '../commons';
import { initialBankAccount } from '../commons/config';
import { FormValues, initialValues as defaultValues } from './config';

const PhFormFields: FC<{
  isEditing: boolean;
  companyId: string;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, companyId, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-ph-form');
  const context: FileManagementContext = {
    type: FileManagementContextType.COMPANY,
    companyId: companyId,
    hireType: HireType.POM,
    countryCode: CountryCode.PHILIPPINES,
  };
  const {
    values: {
      isAypAssistESubmission,
      isUsingDisbursementService,
      payrollCycle,
      isGenerateBankFile,
    },
    initialValues,
    setFieldValue,
    setTouched,
  } = useFormikContext<FormValues>();

  useEffect(() => {
    if (payrollCycle !== PayrollCycle.SEMI_MONTHLY) {
      setFieldValue('statutoryDeductions', null);
      setFieldValue('secondPayrollCutOffDate', null);
      setFieldValue('secondPayrollDate', null);
    }

    if (isEditing && payrollCycle !== PayrollCycle.SEMI_MONTHLY) {
      setFieldValue('statutoryDeductions', initialValues.statutoryDeductions);
      setFieldValue(
        'secondPayrollCutOffDate',
        initialValues.secondPayrollCutOffDate
      );
      setFieldValue('secondPayrollDate', initialValues.secondPayrollDate);
    }
  }, [
    payrollCycle,
    setFieldValue,
    initialValues.statutoryDeductions,
    initialValues.secondPayrollCutOffDate,
    initialValues.secondPayrollDate,
    isEditing,
  ]);

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('sssUserId', null);
      setFieldValue('sssPassword', null);
      setFieldValue('penId', null);
      setFieldValue('penPassword', null);
      setFieldValue('birTinId', null);
      setFieldValue('birUsername', null);
      setFieldValue('birPassword', null);
      setFieldValue('birSecurityQuestionAnswer', null);
    }

    if (isEditing && isAypAssistESubmission) {
      setFieldValue('sssUserId', initialValues.sssUserId);
      setFieldValue('sssPassword', initialValues.sssPassword);
      setFieldValue('penId', initialValues.penId);
      setFieldValue('penPassword', initialValues.penPassword);
      setFieldValue('birTinId', initialValues.birTinId);
      setFieldValue('birUsername', initialValues.birUsername);
      setFieldValue('birPassword', initialValues.birPassword);
      setFieldValue(
        'birSecurityQuestionAnswer',
        initialValues.birSecurityQuestionAnswer
      );
      setTouched({});
    }
  }, [
    isAypAssistESubmission,
    setFieldValue,
    setTouched,
    initialValues.sssUserId,
    initialValues.sssPassword,
    initialValues.penId,
    initialValues.penPassword,
    initialValues.birTinId,
    initialValues.birUsername,
    initialValues.birPassword,
    initialValues.birSecurityQuestionAnswer,
    isEditing,
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
      PAYROLL_CYCLE_OPTIONS.filter(
        ({ id }) =>
          id === PayrollCycle.MONTHLY || id === PayrollCycle.SEMI_MONTHLY
      ).map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const statutoryDeductionsOptions = useMemo(
    () =>
      COMPANY_POM_PH_STATUTORY_DEDUCTIONS_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
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
          id === ProrateSalaryFormula.WORKING_DAYS ||
          id === ProrateSalaryFormula.AVERAGE_WORKING_DAYS
      ).map((option) => ({
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
            name="sssUserId"
            label={t('form.sssUserId.label')}
            helperText={t('form.sssUserId.helperText')}
            dataTestId={`${dataTestId}-sssUserId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="sssPassword"
            label={t('form.sssPassword.label')}
            helperText={t('form.sssPassword.helperText')}
            dataTestId={`${dataTestId}-sssPassword`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="penId"
            label={t('form.penId.label')}
            helperText={t('form.penId.helperText')}
            dataTestId={`${dataTestId}-penId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="penPassword"
            label={t('form.penPassword.label')}
            helperText={t('form.penPassword.helperText')}
            dataTestId={`${dataTestId}-penPassword`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="birTinId"
            label={t('form.birTinId.label')}
            helperText={t('form.birTinId.helperText')}
            dataTestId={`${dataTestId}-birTinId`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="birUsername"
            label={t('form.birUsername.label')}
            helperText={t('form.birUsername.helperText')}
            dataTestId={`${dataTestId}-birUsername`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="birPassword"
            label={t('form.birPassword.label')}
            helperText={t('form.birPassword.helperText')}
            dataTestId={`${dataTestId}-birPassword`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            withFieldVisibility
            disableAutoComplete
            type="password"
            name="birSecurityQuestionAnswer"
            label={t('form.birSecurityQuestionAnswer.label')}
            helperText={t('form.birSecurityQuestionAnswer.helperText')}
            dataTestId={`${dataTestId}-birSecurityQuestionAnswer`}
          />
        </Grid>
      </>
    ),
    [t, dataTestId]
  );

  const payrollCycleDependencyFields = useMemo(() => {
    const isSemiPayrollCycle = payrollCycle === PayrollCycle.SEMI_MONTHLY;

    return (
      <>
        {!!isSemiPayrollCycle && (
          <Grid item xs={12}>
            <Select
              required
              name="statutoryDeductions"
              options={statutoryDeductionsOptions}
              label={t('form.statutoryDeductions.label')}
              helperText={t('form.statutoryDeductions.helperText')}
              dataTestId={`${dataTestId}-statutoryDeductions`}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="payrollCutOffDate"
            options={dateOptions}
            label={t(
              `form.payrollCutOffDate.${
                isSemiPayrollCycle ? 'semiLabel' : 'label'
              }`
            )}
            helperText={t('form.payrollCutOffDate.helperText')}
            dataTestId={`${dataTestId}-payrollCutOffDate`}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="payrollDate"
            options={dateOptions}
            label={t(
              `form.payrollDate.${isSemiPayrollCycle ? 'semiLabel' : 'label'}`
            )}
            helperText={t('form.payrollDate.helperText')}
            dataTestId={`${dataTestId}-payrollDate`}
          />
        </Grid>
        {!!isSemiPayrollCycle && (
          <>
            <Grid item xs={12}>
              <Select
                required
                name="secondPayrollCutOffDate"
                options={dateOptions}
                label={t('form.secondPayrollCutOffDate.label')}
                helperText={t('form.secondPayrollCutOffDate.helperText')}
                dataTestId={`${dataTestId}-secondPayrollCutOffDate`}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                required
                name="secondPayrollDate"
                options={dateOptions}
                label={t('form.secondPayrollDate.label')}
                helperText={t('form.secondPayrollDate.helperText')}
                dataTestId={`${dataTestId}-secondPayrollDate`}
              />
            </Grid>
          </>
        )}
      </>
    );
  }, [payrollCycle, dateOptions, statutoryDeductionsOptions, t, dataTestId]);

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
      {payrollCycleDependencyFields}
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
          name="secRegistrationFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.secRegistrationFile.label')}
          context={context}
          dataTestId={`${dataTestId}-secRegistrationFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="bir2303File"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.bir2303File.label')}
          context={context}
          dataTestId={`${dataTestId}-bir2303File`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="sssFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.sssFile.label')}
          context={context}
          dataTestId={`${dataTestId}-sssFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="penFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.penFile.label')}
          context={context}
          dataTestId={`${dataTestId}-penFile`}
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          required
          uploadFileOnChange
          name="pagFile"
          maxFileSizeInMb={10}
          allowedFileType={['.pdf', '.zip']}
          label={t('form.pagFile.label')}
          context={context}
          dataTestId={`${dataTestId}-pagFile`}
        />
      </Grid>
    </Grid>
  );
};

export default PhFormFields;

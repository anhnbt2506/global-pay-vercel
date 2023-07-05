import {
  CompanyPomSgCpfSubmissionPlatform,
  PayrollCycle,
  ProrateSalaryFormula,
} from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { BankAccount } from '@components/commons/company-pom/commons';
import { MultipleCheckbox, Select, TextField } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  COMPANY_POM_SG_CPF_PAYMENT_MODE_OPTIONS,
  COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_OPTIONS,
  COMPANY_POM_SG_E_SUBMISSION_SERVICE_LABEL_PREFIX,
  DATE_OPTIONS,
  PAYROLL_CYCLE_OPTIONS,
  PRORATE_SALARY_FORMULA_OPTIONS,
} from '@configs/constants';

import { initialBankAccount } from '../commons/config';
import {
  FormFieldValues,
  initialValues as defaultValues,
  eSubmissionServicesList,
} from './config';

const SgFormFields: FC<{
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}> = ({ isEditing, dataTestId, bankOptions }) => {
  const { t } = useTranslation('company-pom-sg-form');
  const {
    values: {
      isAypAssistESubmission,
      isUsingDisbursementService,
      cpfSubmissionPlatform,
      isGenerateBankFile,
    },
    initialValues,
    setFieldValue,
    setTouched,
  } = useFormikContext<FormFieldValues>();

  useEffect(() => {
    if (!isAypAssistESubmission) {
      setFieldValue('eSubmissionServices', null);
    }
  }, [isAypAssistESubmission, setFieldValue]);

  useEffect(() => {
    if (
      cpfSubmissionPlatform !== CompanyPomSgCpfSubmissionPlatform.CRIMSON_LOGIC
    ) {
      setFieldValue('crimsonLogicUsername', null);
      setFieldValue('crimsonLogicPassword', null);
    }
  }, [cpfSubmissionPlatform, setFieldValue]);

  useEffect(() => {
    if (isEditing && !isAypAssistESubmission) {
      setFieldValue('eSubmissionServices', initialValues.eSubmissionServices);
    }
  }, [
    initialValues.eSubmissionServices,
    isAypAssistESubmission,
    isEditing,
    setFieldValue,
  ]);

  useEffect(() => {
    if (
      isEditing &&
      cpfSubmissionPlatform !== CompanyPomSgCpfSubmissionPlatform.CRIMSON_LOGIC
    ) {
      setFieldValue('crimsonLogicUsername', initialValues.crimsonLogicUsername);
      setFieldValue('crimsonLogicPassword', initialValues.crimsonLogicPassword);
      setTouched({});
    }
  }, [
    cpfSubmissionPlatform,
    initialValues.crimsonLogicPassword,
    initialValues.crimsonLogicUsername,
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

  const cpfSubmissionPlatformOptions = useMemo(
    () =>
      COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const cpfPaymentModeOptions = useMemo(
    () =>
      COMPANY_POM_SG_CPF_PAYMENT_MODE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const eSubmissionServicesOptions = useMemo(
    () =>
      eSubmissionServicesList.map((item, index) => ({
        label: t(`${COMPANY_POM_SG_E_SUBMISSION_SERVICE_LABEL_PREFIX}${item}`),
        id: `eSubmissionServices[${index}].${item}`,
      })),
    [t]
  );

  const eSubmissionServicesField = useMemo(
    () => (
      <>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ color: (theme) => theme.palette.customs.doveGray }}>
            {t('form.eSubmissionServices.label')}
          </Typography>
          <Typography
            sx={{ color: (theme) => theme.palette.customs.doveGray }}
            marginY="0.5rem"
          >
            {t('form.eSubmissionServices.helperText')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MultipleCheckbox
            name="eSubmissionServices"
            options={eSubmissionServicesOptions}
            dataTestId="company-pom-sg-form-eSubmissionServices"
          />
        </Grid>
      </>
    ),
    [eSubmissionServicesOptions, t]
  );

  const fields = useMemo(
    () => (
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
            options={prorateSalaryFormulaOptions}
            label={t('form.prorateSalaryFormula.label')}
            helperText={t('form.prorateSalaryFormula.helperText')}
            dataTestId={`${dataTestId}-prorateSalaryFormula`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="cpfFilingNumber"
            label={t('form.cpfFilingNumber.label')}
            helperText={t('form.cpfFilingNumber.helperText')}
            dataTestId={`${dataTestId}-cpfFilingNumber`}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="cpfSubmissionPlatform"
            options={cpfSubmissionPlatformOptions}
            label={t('form.cpfSubmissionPlatform.label')}
            helperText={t('form.cpfSubmissionPlatform.helperText')}
            dataTestId={`${dataTestId}-cpfSubmissionPlatform`}
          />
        </Grid>
        {cpfSubmissionPlatform ===
          CompanyPomSgCpfSubmissionPlatform.CRIMSON_LOGIC && (
          <>
            <Grid item xs={12}>
              <TextField
                required
                disableAutoComplete
                name="crimsonLogicUsername"
                type="password"
                withFieldVisibility
                label={t('form.crimsonLogicUsername.label')}
                helperText={t('form.crimsonLogicUsername.helperText')}
                dataTestId={`${dataTestId}-crimsonLogicUsername`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                disableAutoComplete
                name="crimsonLogicPassword"
                type="password"
                withFieldVisibility
                label={t('form.crimsonLogicPassword.label')}
                helperText={t('form.crimsonLogicPassword.helperText')}
                dataTestId={`${dataTestId}-crimsonLogicPassword`}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="cpfPaymentMode"
            options={cpfPaymentModeOptions}
            label={t('form.cpfPaymentMode.label')}
            helperText={t('form.cpfPaymentMode.helperText')}
            dataTestId={`${dataTestId}-cpfPaymentMode`}
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
        {!!isAypAssistESubmission && eSubmissionServicesField}
        <Grid item xs={12}>
          <Select
            required
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
      </Grid>
    ),
    [
      payrollCycleOptions,
      t,
      dataTestId,
      prorateSalaryFormulaOptions,
      cpfSubmissionPlatformOptions,
      cpfSubmissionPlatform,
      cpfPaymentModeOptions,
      yesNoOptions,
      isAypAssistESubmission,
      eSubmissionServicesField,
      isUsingDisbursementService,
      isGenerateBankFileOptions,
      isGenerateBankFile,
      bankOptions,
    ]
  );

  return fields;
};

export default SgFormFields;

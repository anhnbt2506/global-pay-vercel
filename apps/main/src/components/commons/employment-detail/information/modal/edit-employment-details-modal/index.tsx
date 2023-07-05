import Grid from '@mui/material/Grid';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { TFunction, useTranslation } from 'next-i18next';
import { addDays } from 'date-fns';
import { useMemo } from 'react';
import { ContractType, EmploymentType } from '@ayp/typings/entities';
import { CountryCode } from '@ayp/typings/commons';
import { useFormikContext } from 'formik';

import { NumberField, TextEditor, TimePicker, Toast } from '@components/ui';
import { TextField, Select, DatePicker } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  HIRE_TYPE_OPTIONS,
} from '@configs/constants';

import { mapToRequestBody } from './config';
import { WorkerEmploymentFormValues } from '../../config';
import { EditModal } from '../commons';
import { validationSchema } from './config';

interface EmploymentDetailsFormProps {
  t: TFunction;
  countryCode: string;
}

const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({
  t,
  countryCode,
}) => {
  const {
    values: {
      contractType,
      startDate,
      employmentType,
      currency,
      workerRemuneration,
    },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<WorkerEmploymentFormValues>();

  const {
    isEligibleForPaidExpenses,
    isEntitledToOvertime,
    isEligibleForAdditionalIncome,
    isEligibleForAnnualBonus,
    isEligibleForVariablePay,
    isEligibleForCommission,
  } = workerRemuneration ?? {};

  useEffect(() => {
    if (contractType === ContractType.INDEFINITE) {
      setFieldValue('endDate', null);
      setFieldTouched('endDate', false);
    }
  }, [contractType, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (employmentType === EmploymentType.PART_TIME) {
      setFieldValue('startAt', null);
      setFieldValue('endAt', null);
      setFieldTouched('startAt', false);
      setFieldTouched('endAt', false);
    }
  }, [employmentType, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!isEligibleForPaidExpenses) {
      setFieldValue('workerRemuneration.paidExpensesDescription', null);
      setFieldTouched('workerRemuneration.paidExpensesDescription', false);
    }
  }, [isEligibleForPaidExpenses, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!isEntitledToOvertime) {
      setFieldValue('workerRemuneration.overtimeDescription', null);
      setFieldTouched('workerRemuneration.overtimeDescription', false);
    }
  }, [isEntitledToOvertime, setFieldValue, setFieldTouched]);

  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isEligibleForAdditionalIncome) {
      setFieldValue('workerRemuneration.additionalIncomeDescription', null);
      setFieldTouched('workerRemuneration.additionalIncomeDescription', false);
    }
  }, [isEligibleForAdditionalIncome, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!isEligibleForAnnualBonus) {
      setFieldValue('workerRemuneration.annualBonusDescription', null);
      setFieldTouched('workerRemuneration.annualBonusDescription', false);
    }
  }, [isEligibleForAnnualBonus, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!isEligibleForVariablePay) {
      setFieldValue('workerRemuneration.variablePayDescription', null);
      setFieldTouched('workerRemuneration.variablePayDescription', false);
    }
  }, [isEligibleForVariablePay, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!isEligibleForCommission) {
      setFieldValue('workerRemuneration.commissionDescription', null);
      setFieldTouched('workerRemuneration.commissionDescription', false);
    }
  }, [isEligibleForCommission, setFieldValue, setFieldTouched]);

  const hireTypeOptions = useMemo(
    () =>
      HIRE_TYPE_OPTIONS.map((hireType) => ({
        ...hireType,
        label: t(hireType.label),
      })),
    [t]
  );

  const contractTypeOptions = useMemo(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (countryCode === CountryCode.INDONESIA) {
      return CONTRACT_TYPE_OPTIONS.filter(
        ({ id }) => id === ContractType.FIXED
      ).map((contractType) => ({
        ...contractType,
        label: t(contractType.label),
      }));
    }
    return CONTRACT_TYPE_OPTIONS.map((contractType) => ({
      ...contractType,
      label: t(contractType.label),
    }));
  }, [t, countryCode]);

  const employmentTypeOptions = useMemo(
    () =>
      EMPLOYMENT_TYPE_OPTIONS.map((employmentType) => ({
        ...employmentType,
        label: t(employmentType.label),
      })),
    [t]
  );

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const form = useMemo(() => {
    return (
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <Select
            required
            name="hireType"
            options={hireTypeOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.hireType.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.hireType.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.hireType"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="title"
            label={t(
              'informationForm.editModals.employmentDetails.fields.title.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.title.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.title"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="titleAlternate"
            label={t(
              'informationForm.editModals.employmentDetails.fields.titleAlternate.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.titleAlternate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.titleAlternate"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="contractType"
            options={contractTypeOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.contractType.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.contractType.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.contractType"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="startDate"
            disableHighlightToday
            label={t(
              'informationForm.editModals.employmentDetails.fields.startDate.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.startDate.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.startDate"
          />
        </Grid>
        {contractType === ContractType.FIXED && (
          <Grid item xs={12}>
            <DatePicker
              required
              name="endDate"
              disableHighlightToday
              /* istanbul ignore next */
              // this case doesn't necessary to test
              minDate={startDate ? addDays(startDate, 1) : null}
              label={t(
                'informationForm.editModals.employmentDetails.fields.endDate.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.endDate.helperText'
              )}
              dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.endDate"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="employmentType"
            options={employmentTypeOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.employmentType.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.employmentType.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.employmentType"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="workingHoursPerWeek"
            label={t(
              'informationForm.editModals.employmentDetails.fields.workingHoursPerWeek.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workingHoursPerWeek.helperText'
            )}
            numberFormatProps={{
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.workingHoursPerWeek"
          />
        </Grid>
        {employmentType === EmploymentType.FULL_TIME && (
          <>
            <Grid item xs={12}>
              <TimePicker
                required
                name="startAt"
                label={t(
                  'informationForm.editModals.employmentDetails.fields.startAt.label'
                )}
                helperText={t(
                  'informationForm.editModals.employmentDetails.fields.startAt.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.startAt"
              />
            </Grid>
            <Grid item xs={12}>
              <TimePicker
                required
                name="endAt"
                label={t(
                  'informationForm.editModals.employmentDetails.fields.endAt.label'
                )}
                helperText={t(
                  'informationForm.editModals.employmentDetails.fields.endAt.helperText'
                )}
                dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.endAt"
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <TextField
            required
            name="managerName"
            label={t(
              'informationForm.editModals.employmentDetails.fields.managerName.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.managerName.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerName"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="managerTitle"
            label={t(
              'informationForm.editModals.employmentDetails.fields.managerTitle.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.managerTitle.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.managerTitle"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="workerRemuneration.salaryPerMonth"
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.salaryPerMonth.label'
            )}
            helperText={(value) => {
              const salaryPerMonth = parseFloat(value);

              return t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.salaryPerMonth.helperText',
                {
                  salaryPerYear: `${currency} ${new Intl.NumberFormat().format(
                    isNaN(salaryPerMonth) ? 0 : salaryPerMonth * 12
                  )}`,
                }
              );
            }}
            startAdornment={currency}
            numberFormatProps={{
              decimalScale: 2,
              allowNegative: false,
              fixedDecimalScale: true,
              thousandSeparator: true,
            }}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.salaryPerMonth"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            defaultValue=""
            name="workerRemuneration.isEligibleForInsurance"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForInsurance.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForInsurance.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForInsurance"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workerRemuneration.isEntitledToOvertime"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEntitledToOvertime.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEntitledToOvertime.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEntitledToOvertime"
          />
        </Grid>
        {!!isEntitledToOvertime && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.overtimeDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.overtimeDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.overtimeDescription.helperText'
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
            name="workerRemuneration.isEligibleForPaidExpenses"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForPaidExpenses.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForPaidExpenses.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForPaidExpenses"
          />
        </Grid>
        {!!isEligibleForPaidExpenses && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.paidExpensesDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.paidExpensesDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.paidExpensesDescription.helperText'
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
            name="workerRemuneration.isEligibleForAdditionalIncome"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForAdditionalIncome.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForAdditionalIncome.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAdditionalIncome"
          />
        </Grid>
        {!!isEligibleForAdditionalIncome && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.additionalIncomeDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.additionalIncomeDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.additionalIncomeDescription.helperText'
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
            name="workerRemuneration.isEligibleForVariablePay"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForVariablePay.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForVariablePay.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForVariablePay"
          />
        </Grid>
        {!!isEligibleForVariablePay && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.variablePayDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.variablePayDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.variablePayDescription.helperText'
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
            name="workerRemuneration.isEligibleForAnnualBonus"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForAnnualBonus.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForAnnualBonus.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForAnnualBonus"
          />
        </Grid>
        {!!isEligibleForAnnualBonus && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.annualBonusDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.annualBonusDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.annualBonusDescription.helperText'
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
            name="workerRemuneration.isEligibleForCommission"
            options={yesNoOptions}
            label={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForCommission.label'
            )}
            helperText={t(
              'informationForm.editModals.employmentDetails.fields.workerRemuneration.isEligibleForCommission.helperText'
            )}
            dataTestId="staffAuditClientHires-employmentId-editInformation.employmentDetails.fields.isEligibleForCommission"
          />
        </Grid>
        {!!isEligibleForCommission && (
          <Grid item xs={12}>
            <TextEditor
              required
              name="workerRemuneration.commissionDescription"
              label={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.commissionDescription.label'
              )}
              helperText={t(
                'informationForm.editModals.employmentDetails.fields.workerRemuneration.commissionDescription.helperText'
              )}
              init={{
                height: '12rem',
              }}
            />
          </Grid>
        )}
      </Grid>
    );
  }, [
    t,
    contractType,
    startDate,
    employmentType,
    currency,
    isEligibleForPaidExpenses,
    isEntitledToOvertime,
    isEligibleForAdditionalIncome,
    contractTypeOptions,
    employmentTypeOptions,
    hireTypeOptions,
    yesNoOptions,
    isEligibleForVariablePay,
    isEligibleForAnnualBonus,
    isEligibleForCommission,
  ]);

  return form;
};

interface EditCompanyInformationModalProps {
  initialValues: WorkerEmploymentFormValues;
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
  countryCode: string;
}

const EditEmploymentDetailsModal: React.FC<
  EditCompanyInformationModalProps
> = ({ initialValues, onCloseModal, onSuccess, setToast, countryCode }) => {
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  return (
    <EditModal
      modalTitle={t('informationForm.editModals.employmentDetails.title')}
      formFields={<EmploymentDetailsForm t={t} countryCode={countryCode} />}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      mapToRequestBody={mapToRequestBody}
    />
  );
};

export default EditEmploymentDetailsModal;

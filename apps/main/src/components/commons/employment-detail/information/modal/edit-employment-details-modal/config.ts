import { mapFilterObject, yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';
import format from 'date-fns/format';
import { ContractType, EmploymentType } from '@ayp/typings/entities';

import {
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  INVALID_NUMBER_FIELD_ERROR_MESSAGE,
  INVALID_TIME_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import {
  GP_BACKEND_DATE_FORMAT,
  GP_BACKEND_TIME_FORMAT,
} from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../config';

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        hireType: state.hireType,
        title: state.title,
        titleAlternate: state.titleAlternate,
        contractType: state.contractType,
        startDate: state.startDate,
        endDate: state.endDate,
        employmentType: state.employmentType,
        startAt: state.startAt,
        endAt: state.endAt,
        workingHoursPerWeek: state.workingHoursPerWeek,
        managerName: state.managerName,
        managerTitle: state.managerTitle,
        workerRemuneration: {
          salaryPerMonth: state.workerRemuneration.salaryPerMonth,
          isEligibleForInsurance:
            state.workerRemuneration.isEligibleForInsurance,
          isEntitledToOvertime: state.workerRemuneration.isEntitledToOvertime,
          overtimeDescription: state.workerRemuneration.overtimeDescription,
          isEligibleForPaidExpenses:
            state.workerRemuneration.isEligibleForPaidExpenses,
          paidExpensesDescription:
            state.workerRemuneration.paidExpensesDescription,
          isEligibleForAdditionalIncome:
            state.workerRemuneration.isEligibleForAdditionalIncome,
          additionalIncomeDescription:
            state.workerRemuneration.additionalIncomeDescription,
          isEligibleForVariablePay:
            state.workerRemuneration.isEligibleForVariablePay,
          variablePayDescription:
            state.workerRemuneration.variablePayDescription,
          isEligibleForAnnualBonus:
            state.workerRemuneration.isEligibleForAnnualBonus,
          annualBonusDescription:
            state.workerRemuneration.annualBonusDescription,
          isEligibleForCommission:
            state.workerRemuneration.isEligibleForCommission,
          commissionDescription: state.workerRemuneration.commissionDescription,
        },
      },
      state.startDate && {
        startDate: format(state.startDate, GP_BACKEND_DATE_FORMAT),
      },
      state.endDate && {
        endDate: format(state.endDate, GP_BACKEND_DATE_FORMAT),
      },
      state.startAt && {
        startAt: format(state.startAt, GP_BACKEND_TIME_FORMAT),
      },
      state.endAt && {
        endAt: format(state.endAt, GP_BACKEND_TIME_FORMAT),
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
  hireType: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  title: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  titleAlternate: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  contractType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  startDate: yup
    .date()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
  endDate: yup
    .date()
    .nullable()
    .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
    .when('contractType', {
      is: ContractType.FIXED,
      then: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
        .test({
          message:
            'staff-audit-client-hires-employment-id:informationForm.editModals.employmentDetails.fields.endDate.error.endDateMustBeLaterThanStartDate',
          test: function (value) {
            return yupCustomValidation.isDateAfter(
              value,
              this.parent.startDate
            );
          },
        }),
    }),
  employmentType: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  workingHoursPerWeek: yup
    .number()
    .nullable()
    .min(0, '')
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .typeError(INVALID_NUMBER_FIELD_ERROR_MESSAGE),
  startAt: yup
    .date()
    .nullable()
    .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE)
    .when('employmentType', {
      is: EmploymentType.FULL_TIME,
      then: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE),
    }),
  endAt: yup
    .date()
    .nullable()
    .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE)
    .when('employmentType', {
      is: EmploymentType.FULL_TIME,
      then: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE),
    }),
  managerName: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  managerTitle: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  workerRemuneration: yup.object({
    salaryPerMonth: yup
      .number()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    isEligibleForInsurance: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    isEntitledToOvertime: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    overtimeDescription: yup
      .string()
      .nullable()
      .when('isEntitledToOvertime', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForPaidExpenses: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    paidExpensesDescription: yup
      .string()
      .nullable()
      .when('isEligibleForPaidExpenses', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForAdditionalIncome: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    additionalIncomeDescription: yup
      .string()
      .nullable()
      .when('isEligibleForAdditionalIncome', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForVariablePay: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    variablePayDescription: yup
      .string()
      .nullable()
      .when('isEligibleForVariablePay', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForAnnualBonus: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    annualBonusDescription: yup
      .string()
      .nullable()
      .when('isEligibleForAnnualBonus', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForCommission: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    commissionDescription: yup
      .string()
      .nullable()
      .when('isEligibleForCommission', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
  }),
});

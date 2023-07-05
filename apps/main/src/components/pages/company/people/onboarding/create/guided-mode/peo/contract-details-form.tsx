import { CountryCode, UserSession } from '@ayp/typings/commons';
import {
  ContractType,
  EmploymentType,
  WorkplaceAddressType,
} from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { addDays } from 'date-fns';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DepartmentAction } from '@ayp/typings/entities';

import {
  Autocomplete,
  DatePicker,
  NumberField,
  Select,
  TextField,
  TimePicker,
  Toast,
} from '@components/ui';
import {
  CONTRACT_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  WORKER_SCHEDULE_OPTIONS,
  WORKPLACE_ADDRESS_TYPE_OPTIONS,
} from '@configs/constants';
import { DepartmentModal } from '@components/commons/department/department-modal';

import { GuidedModePeoFormValues, daysOfWeek } from './config';

const ContractDetailsForm: FC<{
  companyId: string;
  departmentOptions: Option[];
  fetchDepartmentOptions: (isSetDepartmentOptions: boolean) => void;
  session: UserSession;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  session,
  companyId,
  departmentOptions,
  fetchDepartmentOptions,
  setToast,
}) => {
  const { t } = useTranslation('company-people-onboarding-create');
  const {
    values: {
      hiringCountry,
      contractType,
      employmentType,
      startDate,
      workplaceAddressType,
      department,
    },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<GuidedModePeoFormValues>();

  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  useEffect(() => {
    if (contractType === ContractType.INDEFINITE) {
      setFieldValue('endDate', null);
      setFieldTouched('endDate', false);
    }
  }, [contractType, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (employmentType === EmploymentType.PART_TIME) {
      setFieldValue('startAt', null);
      setFieldTouched('startAt', false);
      setFieldValue('endAt', null);
      setFieldTouched('endAt', false);
    }
  }, [employmentType, setFieldValue, setFieldTouched]);

  useEffect(() => {
    if (!department) return;
    if (department.id === DepartmentAction.CREATE_NEW_DEPARTMENT) {
      setShowDepartmentModal(true);
    }
  }, [department]);

  const contractTypeOptions = useMemo(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (hiringCountry && hiringCountry.code === CountryCode.INDONESIA) {
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
  }, [t, hiringCountry]);

  const employmentTypeOptions = useMemo(
    () =>
      EMPLOYMENT_TYPE_OPTIONS.map((employmentType) => ({
        ...employmentType,
        label: t(employmentType.label),
      })),
    [t]
  );

  const workplaceAddressTypeOptions = useMemo(
    () =>
      WORKPLACE_ADDRESS_TYPE_OPTIONS.map((workplaceLocation) => ({
        ...workplaceLocation,
        label: t(workplaceLocation.label),
      })),
    [t]
  );

  const renderDepartmentModal = useMemo(
    () =>
      showDepartmentModal && (
        <DepartmentModal
          t={t}
          session={session}
          companyId={companyId}
          onSuccess={(department) => {
            fetchDepartmentOptions(true);
            department &&
              setFieldValue('department', {
                id: department.departmentId,
                label: department.name,
              });
            setShowDepartmentModal(false);
          }}
          onClose={() => {
            setFieldValue('department', null);
            setShowDepartmentModal(false);
          }}
          setToast={setToast}
        />
      ),
    [
      t,
      companyId,
      session,
      showDepartmentModal,
      fetchDepartmentOptions,
      setToast,
      setFieldValue,
    ]
  );

  const workerScheduleOptions = useMemo(
    () =>
      WORKER_SCHEDULE_OPTIONS.map((workerSchedule) => ({
        ...workerSchedule,
        label: t(workerSchedule.label),
      })),
    [t]
  );

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        {renderDepartmentModal}
        <Grid item xs={12}>
          <Select
            required
            name="contractType"
            options={contractTypeOptions}
            label={t('guidedMode.PEO.contractDetails.form.contractType.label')}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.contractType.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-contractType"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="startDate"
            disableHighlightToday
            label={t('guidedMode.PEO.contractDetails.form.startDate.label')}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.startDate.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-startDate"
          />
        </Grid>
        {contractType === ContractType.FIXED && (
          <Grid item xs={12}>
            <DatePicker
              required
              name="endDate"
              disableHighlightToday
              minDate={startDate ? addDays(startDate, 1) : null}
              label={t('guidedMode.PEO.contractDetails.form.endDate.label')}
              helperText={t(
                'guidedMode.PEO.contractDetails.form.endDate.helperText'
              )}
              dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-endDate"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Select
            required
            name="employmentType"
            options={employmentTypeOptions}
            label={t(
              'guidedMode.PEO.contractDetails.form.employmentType.label'
            )}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.employmentType.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-employmentType"
          />
        </Grid>
        <Grid item xs={12}>
          <NumberField
            required
            name="workingHoursPerWeek"
            label={t(
              'guidedMode.PEO.contractDetails.form.workingHoursPerWeek.label'
            )}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.workingHoursPerWeek.helperText'
            )}
            numberFormatProps={{
              allowNegative: false,
              thousandSeparator: true,
            }}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workingHoursPerWeek"
          />
        </Grid>
        {employmentType === EmploymentType.FULL_TIME && (
          <>
            <Grid item xs={12}>
              <TimePicker
                required
                name="startAt"
                label={t('guidedMode.PEO.contractDetails.form.startAt.label')}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.startAt.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-startAt"
              />
            </Grid>
            <Grid item xs={12}>
              <TimePicker
                required
                name="endAt"
                label={t('guidedMode.PEO.contractDetails.form.endAt.label')}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.endAt.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-endAt"
              />
            </Grid>
          </>
        )}
        {daysOfWeek.map((day) => (
          <Grid key={day} item xs={12}>
            <Select
              required
              name={`workerSchedule.${day}`}
              options={workerScheduleOptions}
              label={t(
                `guidedMode.PEO.contractDetails.form.workerSchedule.${day}.label`
              )}
              helperText={t(
                `guidedMode.PEO.contractDetails.form.workerSchedule.${day}.helperText`
              )}
              dataTestId={`companyPeopleOnboardingCreate-guidedMode-peo-field-workerSchedule-${day}`}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <TextField
            required
            name="managerName"
            label={t('guidedMode.PEO.contractDetails.form.managerName.label')}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.managerName.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-managerName"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="managerTitle"
            label={t('guidedMode.PEO.contractDetails.form.managerTitle.label')}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.managerTitle.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-managerTitle"
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            required
            name="department"
            options={departmentOptions}
            label={t('guidedMode.PEO.contractDetails.form.department.label')}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.department.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-department"
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            required
            name="workplaceAddressType"
            options={workplaceAddressTypeOptions}
            label={t(
              'guidedMode.PEO.contractDetails.form.workplaceAddressType.label'
            )}
            helperText={t(
              'guidedMode.PEO.contractDetails.form.workplaceAddressType.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddressType"
          />
        </Grid>
        {workplaceAddressType === WorkplaceAddressType.OTHERS && (
          <>
            <Grid item xs={12}>
              <TextField
                required
                name="workplaceAddress.addressLine"
                label={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.addressLine.label'
                )}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.addressLine.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-addressLine"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="workplaceAddress.city"
                label={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.city.label'
                )}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.city.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-city"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="workplaceAddress.state"
                label={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.state.label'
                )}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.state.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-state"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="workplaceAddress.postalCode"
                label={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.postalCode.label'
                )}
                helperText={t(
                  'guidedMode.PEO.contractDetails.form.workplaceAddress.postalCode.helperText'
                )}
                dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-workplaceAddress-postalCode"
              />
            </Grid>
          </>
        )}
      </Grid>
    ),
    [
      t,
      startDate,
      contractType,
      employmentType,
      workplaceAddressType,
      contractTypeOptions,
      employmentTypeOptions,
      workplaceAddressTypeOptions,
      departmentOptions,
      renderDepartmentModal,
      workerScheduleOptions,
    ]
  );

  return form;
};

export default ContractDetailsForm;

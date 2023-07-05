import { Attribute, CountryCode, UserSession } from '@ayp/typings/commons';
import {
  Company,
  CompanyCountries,
  HireType,
  Role,
} from '@ayp/typings/entities';
import { isErrorResponse, isUserPermitted } from '@ayp/utils';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction, Trans } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CountryOption, Option } from '@ayp/typings/ui';
import memoizee from 'memoizee';
import { uniqBy } from 'lodash-es';

import {
  Autocomplete,
  ButtonSubmit,
  Select,
  TextField,
  Toast,
  DatePicker,
} from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { CompanyApi, WorkerEmploymentApi } from '@services/apis/people';
import { CompanyPayrollApi } from '@services/apis/fintech';

import {
  FormValues,
  validationSchemaForStaff,
  validationSchemaForCompany,
  initialValues,
  mapToRequestBody,
} from './config';

const getCompanyListMemo = memoizee(
  async (session: UserSession): Promise<Option[]> => {
    const { companies } = await CompanyApi.listAll(session);

    return companies.map((company) => ({
      id: company.companyId,
      label: `[${company.companyId}] ${company.name}`,
    }));
  },
  { promise: true }
);

export const RunOffCyclePayrollModal: FC<{
  t: TFunction;
  session: UserSession;
  onSuccess: (payrollId: string) => void;
  onClose: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({ t, session, onClose, setToast, onSuccess }) => {
  const [workerEmploymentOptions, setWorkerEmploymentOptions] = useState<
    Option<string>[]
  >([]);
  const [companies, setCompanies] = useState<Option[]>([]);

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [companyCountries, setCompanyCountries] = useState<CompanyCountries[]>(
    []
  );
  const [hireTypeOptions, setHireTypeOptions] = useState<Option[]>([]);
  const [companyId, setCompanyId] = useState<Nullable<string>>(null);
  const [hireType, setHireType] = useState<Nullable<HireType>>(null);
  const [countryCode, setCountryCode] = useState<Nullable<CountryCode>>(null);
  const role = session?.user?.selectedUserContext?.role;

  const isStaffRole = isUserPermitted(
    [Role.GP_STAFF_ADMIN, Role.GP_STAFF_AUDITOR],
    role
  );

  const isCompanyRole = isUserPermitted([Role.GP_COMPANY_OWNER], role);

  const attributes = useMemo<Attribute<keyof Company>[]>(
    () => ['companyId', 'name', 'companyCountries.country:id,code,name'],
    []
  );

  const fetchDataCompany = useCallback(
    async (companyId: string) => {
      try {
        if (!companyId) return;
        const { company } = await CompanyApi.getByCompanyId(
          session,
          {
            attributes,
          },
          companyId ?? ''
        );

        if (company) {
          const { companyCountries } = company;
          const countries = companyCountries
            ? companyCountries.map((country) => {
                return {
                  id: country.country.code,
                  code: country.country.code,
                  label: country.country.name,
                };
              })
            : [];
          setCountries(uniqBy(countries, JSON.stringify));
          setCompanyCountries(companyCountries ?? []);
        }

        return;
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    },
    [session, attributes, setToast, t]
  );

  const fetchDataCompanies = useCallback(async () => {
    const data = await getCompanyListMemo(session);
    setCompanies(data);
  }, [session]);

  const fetchDataWorkerUsers = useCallback(
    async (companyId: string, hireType: HireType, countryCode: CountryCode) => {
      const { workerUsers } = await WorkerEmploymentApi.getPayrollQualified(
        session,
        hireType,
        companyId,
        countryCode
      );

      return workerUsers;
    },
    [session]
  );

  useEffect(() => {
    (async () => {
      if (!isCompanyRole) return;
      const companyId = session?.user.selectedUserContext.contextCompanyId;

      return fetchDataCompany(companyId ?? '');
    })();
  }, [fetchDataCompany, isCompanyRole, session?.user.selectedUserContext]);

  useEffect(() => {
    if (!isStaffRole) return;
    fetchDataCompanies();
  }, [fetchDataCompanies, isStaffRole]);

  const fetchWorkerEmployments = useCallback(
    async (companyId: string, hireType: HireType, countryCode: CountryCode) => {
      const workerUsers = await fetchDataWorkerUsers(
        companyId,
        hireType,
        countryCode
      );
      const options = workerUsers.map<Option<string>>(
        ({ firstName, lastName, email, employmentId }) => ({
          label: `${firstName} ${lastName}`,
          email,
          id: employmentId,
        })
      );
      options.sort((a, b) => a.label.localeCompare(b.label));
      setWorkerEmploymentOptions(options);
    },
    [fetchDataWorkerUsers]
  );

  useEffect(() => {
    (async () => {
      const id = isStaffRole
        ? companyId
        : session?.user.selectedUserContext.contextCompanyId;

      if (!hireType || !id || !countryCode) return;

      await fetchWorkerEmployments(id, hireType, countryCode);
    })();
  }, [
    companyId,
    session?.user.selectedUserContext,
    t,
    onSuccess,
    fetchDataWorkerUsers,
    fetchWorkerEmployments,
    hireType,
    isStaffRole,
    countryCode,
  ]);

  const filterOptions = useCallback(
    (options: Option<string | number>[], { inputValue } = { inputValue: '' }) =>
      options.filter(
        (option) =>
          (option.email as string)
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          (option.label as string)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
      ),
    []
  );

  const onChangeCompanyField = useCallback(
    (
      value: Option<string>,
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
      ) => void
    ) => {
      setCompanyId(value?.id);
      fetchDataCompany(value?.id);
      setFieldValue('country', null);
      setFieldValue('hireType', null);
      setFieldValue('workerEmployments', []);
      setHireTypeOptions([]);
      setHireType(null);
      setCountryCode(null);
    },
    [fetchDataCompany]
  );

  const onChangeCountryField = useCallback(
    (
      value: CountryOption,
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
      ) => void
    ) => {
      if (!value) return;

      const hireTypeOptions = companyCountries
        .filter((company) => company.countryCode === value.code)
        .map((company) => ({
          id: company.hireType,
          label: t(company.hireType),
        }));
      setFieldValue('hireType', null);
      setFieldValue('workerEmployments', []);
      setHireTypeOptions(hireTypeOptions);
      setCountryCode(value.code);
      setHireType(null);
    },
    [companyCountries, t]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { companyPayroll } = await CompanyPayrollApi.post(
          session,
          mapToRequestBody(values)
        );
        onSuccess(companyPayroll.companyPayrollId);
        setToast({
          severity: 'success',
          message: (
            <Trans
              i18nKey={`${t(
                'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.toast.success',
                {
                  number: 1,
                }
              )}`}
            />
          ),
        });
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
          onClose();
        }
      }
    },
    [onClose, setToast, t, onSuccess, session]
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          data-testid="staffAuditClientList-companyId-departmentModal-title"
        >
          {t(
            'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.title'
          )}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {t(
            'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.description'
          )}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={
            isStaffRole ? validationSchemaForStaff : validationSchemaForCompany
          }
        >
          {({ setFieldValue }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="name"
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.name.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-name"
                  />
                </Grid>
                {isStaffRole && (
                  <Grid item xs={12}>
                    <Autocomplete
                      required
                      name="company"
                      options={companies}
                      label={t(
                        'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.company.name.label'
                      )}
                      dataTestId="runOffCyclePayrolLModal-field-company-name"
                      onSelectedOption={(value) =>
                        onChangeCompanyField(
                          value as Option<string>,
                          setFieldValue
                        )
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Autocomplete
                    required
                    name="country"
                    options={countries}
                    variant="country"
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.country.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-country"
                    onSelectedOption={(value) =>
                      onChangeCountryField(
                        value as CountryOption,
                        setFieldValue
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    required
                    name="hireType"
                    options={hireTypeOptions}
                    onChange={(event) => {
                      setHireType(event.target.value as HireType);
                      setFieldValue('workerEmployments', []);
                    }}
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.hireType.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-hireType"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    required
                    name="periodStartDate"
                    disableHighlightToday
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.periodStartDate.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-periodStartDate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    required
                    name="periodEndDate"
                    disableHighlightToday
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.periodEndDate.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-periodEndDate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    required
                    name="payDate"
                    disableHighlightToday
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.payDate.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-payDate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    required
                    name="workerEmployments"
                    isMultipleOption
                    options={workerEmploymentOptions}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    label={t(
                      'payroll-run-off-cycle-payroll-modal:runOffCyclePayrolLModal.form.workerEmployments.label'
                    )}
                    dataTestId="runOffCyclePayrolLModal-field-workerEmployments"
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  gap: '2rem',
                  display: 'flex',
                  marginTop: '2rem',
                  justifyContent: 'space-around',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                      paddingX: '3rem',
                    }}
                    data-testid="runOffCyclePayrolLModal-cancelButton"
                  >
                    {t('common:cancel')}
                  </Button>
                </Box>
                <ButtonSubmit
                  variant="contained"
                  sx={{
                    paddingX: '3rem',
                  }}
                  data-testid="runOffCyclePayrolLModal-submitButton"
                >
                  {t('common:submit')}
                </ButtonSubmit>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

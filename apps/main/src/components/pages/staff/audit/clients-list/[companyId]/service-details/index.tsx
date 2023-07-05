import { ErrorCode } from '@ayp/typings/commons';
import { HireType } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import memoizee from 'memoizee';
import { TFunction } from 'next-i18next';
import dynamic from 'next/dynamic';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import CompanyPom from '@components/commons/company-pom';
import {
  Autocomplete,
  ButtonSubmit,
  Select,
  TextField,
  Toast,
} from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  HIRE_TYPE_OPTIONS,
  HIRING_COUNTRIES,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks';
import {
  CompanyApi,
  CompanyCreateServiceDetailsRequest,
  CountryApi,
} from '@services/apis/people';

import {
  initialValues,
  mapInitialServiceDetails,
  SelectionCountry,
  ServiceSelectionsFormValue,
  validationSchema,
} from './config';

interface ServiceDetailsProps {
  t: TFunction;
  companyId: string;
  setToast: Dispatch<SetStateAction<Toast>>;
}

const getHiringCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries
      .filter((country) => HIRING_COUNTRIES.includes(country.code))
      .map((country) => ({
        id: country.id,
        code: country.code,
        label: country.name,
      }));
  },
  { promise: true }
);

const HeaderSection: FC<{
  title: string;
  openModal: Dispatch<SetStateAction<boolean>>;
  hidePenIcon?: boolean;
  dataTestId?: string;
}> = ({ dataTestId, title, openModal, hidePenIcon }) => {
  return (
    <>
      <Grid item lg={3} xs={3}>
        <Typography
          sx={{
            color: (theme) => theme.palette.info.main,
            fontWeight: 'bold',
            padding: '1.5rem 0',
          }}
          data-testid={dataTestId}
        >
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        lg={9}
        xs={9}
        sx={{
          marginY: 'auto',
        }}
      >
        {hidePenIcon ? (
          <></>
        ) : (
          <IconButton
            onClick={() => openModal(true)}
            data-testid={`${dataTestId}-button-edit`}
          >
            <Edit fontSize="small" color="primary" />
          </IconButton>
        )}
      </Grid>
    </>
  );
};

const LineSection: FC<{
  title: string;
  value?: ReactNode;
  dataTestId?: string;
}> = ({ dataTestId, title, value }) => {
  return (
    <>
      <Grid
        item
        lg={3}
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
          }}
          data-testid={dataTestId}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item lg={9} xs={12}>
        {value}
      </Grid>
    </>
  );
};

const ServiceSelectionModal: FC<{
  t: TFunction;
  service: Nullable<ServiceSelectionsFormValue>;
  companyId: string;
  setShowServiceSelectionModal: Dispatch<SetStateAction<boolean>>;
  setService: Dispatch<SetStateAction<Nullable<ServiceSelectionsFormValue>>>;
  setToast: Dispatch<SetStateAction<Toast>>;
  setData: Dispatch<SetStateAction<Record<string, unknown>>>;
  setToken: Dispatch<SetStateAction<string>>;
}> = ({
  service,
  companyId,
  t,
  setShowServiceSelectionModal,
  setService,
  setToast,
  setData,
  setToken,
}) => {
  const { session } = useSessionCookies();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const hireTypeOptions = useMemo(
    () =>
      HIRE_TYPE_OPTIONS.map((hireType) => ({
        ...hireType,
        label: t(hireType.label),
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

  useEffect(() => {
    (async () => {
      try {
        const data = await getHiringCountriesMemo();
        setCountries(data);
      } catch {}
    })();
  }, []);

  const onSubmit = async (
    values: ServiceSelectionsFormValue,
    actions: FormikHelpers<ServiceSelectionsFormValue>
  ) => {
    const { hireType, country, shouldDecrypt, password } = values;
    if (country && hireType) {
      try {
        const { data, context } = await CompanyApi.getServiceDetails(
          session,
          hireType,
          country.code,
          !!shouldDecrypt && password
            ? {
                companyId,
                password,
              }
            : {
                companyId,
              }
        );

        setData(mapInitialServiceDetails(data.hireType));
        context?.token && setToken(context.token);
        setService({ hireType, country, shouldDecrypt });
        setShowServiceSelectionModal(false);
      } catch (e) {
        if (isErrorResponse(e)) {
          switch (e.error.code) {
            case ErrorCode.FORBIDDEN:
              actions.setErrors({
                password: t(
                  'serviceDetailsForm.modal.serviceSelection.form.password.error'
                ),
              });
              break;
            case ErrorCode.NOT_FOUND:
              actions.setErrors({
                country: t(
                  'serviceDetailsForm.modal.serviceSelection.form.country.error'
                ),
              });
              break;
            default:
              setToast({
                severity: 'error',
                message: e.error.name,
              });
          }
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    }
  };

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
        <Typography variant="h6" align="center">
          {t('serviceDetailsForm.modal.serviceSelection.title')}
        </Typography>
        <Typography variant="subtitle1">
          {t('serviceDetailsForm.modal.serviceSelection.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={service ? service : initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form noValidate>
              <Select
                required
                name="hireType"
                options={hireTypeOptions}
                label={t(
                  'serviceDetailsForm.modal.serviceSelection.form.hireType.label'
                )}
                helperText={t(
                  'serviceDetailsForm.modal.serviceSelection.form.hireType.helperText'
                )}
                dataTestId="staffAuditClientList-companyId-serviceDetail-updateService.field.hireType"
              />
              <Autocomplete
                required
                name="country"
                options={countries}
                variant="country"
                label={t(
                  'serviceDetailsForm.modal.serviceSelection.form.country.label'
                )}
                helperText={t(
                  'serviceDetailsForm.modal.serviceSelection.form.country.helperText'
                )}
                dataTestId="staffAuditClientList-companyId-serviceDetail-updateService.field.country"
              />
              <Select
                required
                name="shouldDecrypt"
                options={yesNoOptions}
                label={t(
                  'serviceDetailsForm.modal.serviceSelection.form.shouldDecrypt.label'
                )}
                helperText={t(
                  'serviceDetailsForm.modal.serviceSelection.form.shouldDecrypt.helperText'
                )}
                dataTestId="staffAuditClientList-companyId-serviceDetail-updateService.field.shouldDecrypt"
              />
              {!!values.shouldDecrypt && (
                <TextField
                  type="password"
                  required
                  withFieldVisibility
                  disableAutoComplete
                  name="password"
                  label={t(
                    'serviceDetailsForm.modal.serviceSelection.form.password.label'
                  )}
                  helperText={t(
                    'serviceDetailsForm.modal.serviceSelection.form.password.label'
                  )}
                  dataTestId="staffAuditClientList-companyId-serviceDetail-updateService.field.password"
                />
              )}
              <Box
                sx={{
                  gap: '2rem',
                  display: 'flex',
                  marginTop: '2rem',
                  justifyContent: 'space-around',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowServiceSelectionModal(false)}
                  sx={{
                    paddingX: '3rem',
                  }}
                  data-testid="staffAuditClientList-companyId-serviceDetail-updateService-cancelButton"
                >
                  {t('common:cancel')}
                </Button>
                <ButtonSubmit
                  variant="contained"
                  sx={{
                    paddingX: '3rem',
                  }}
                  data-testid="staffAuditClientList-companyId-serviceDetail-updateService-submitButton"
                >
                  {t('common:update')}
                </ButtonSubmit>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const ServiceDetails: FC<ServiceDetailsProps> = ({
  t,
  setToast,
  companyId,
}) => {
  const { session } = useSessionCookies();
  const [service, setService] =
    useState<Nullable<ServiceSelectionsFormValue>>(null);
  const [showServiceSelectionModal, setShowServiceSelectionModal] =
    useState(false);
  const [showCompanyPomModal, setShowCompanyPomModal] = useState(false);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [token, setToken] = useState<string>('');

  const renderUpdateStatus = useMemo(
    () =>
      showServiceSelectionModal && (
        <ServiceSelectionModal
          t={t}
          service={service}
          setShowServiceSelectionModal={setShowServiceSelectionModal}
          setService={setService}
          setToast={setToast}
          companyId={companyId}
          setData={setData}
          setToken={setToken}
        />
      ),
    [
      t,
      service,
      showServiceSelectionModal,
      setShowServiceSelectionModal,
      setToast,
      companyId,
    ]
  );

  const handleSubmitEditForm = async (
    values: CompanyCreateServiceDetailsRequest
  ) => {
    if (service?.country) {
      try {
        const data = await CompanyApi.updateCountryServiceDetails(
          session,
          HireType.POM,
          service.country.code,
          Object.assign({}, values, {
            companyId,
            token,
          })
        );
        setData(mapInitialServiceDetails(data.hireType));
        setShowCompanyPomModal(false);
        setToast({
          severity: 'success',
          message: t('common:savedSuccessfully'),
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
        }
      }
    }
  };

  const fields = useMemo(() => {
    if (!service) {
      return <></>;
    } else {
      const { country } = service;
      if (country) {
        const Fields = dynamic<SelectionCountry>(
          () => import(`./detail/${country.code.toLocaleLowerCase()}`)
        );
        return (
          <Fields values={data} t={t} isDecrypted={!!service.shouldDecrypt} />
        );
      }
    }
  }, [service, data, t]);

  return (
    <Grid spacing={2} container sx={{ paddingBottom: '2rem' }}>
      {renderUpdateStatus}
      <HeaderSection
        title={t('serviceDetailsForm.title.service')}
        openModal={setShowServiceSelectionModal}
        dataTestId="staffAuditClientList-companyId-serviceDetail.service"
      />
      <LineSection
        title={t('serviceDetailsForm.fields.hireType')}
        value={<Typography>{service?.hireType ?? '-'}</Typography>}
        dataTestId="staffAuditClientList-companyId-serviceDetail.service.fields.hireType"
      />
      <LineSection
        title={t('serviceDetailsForm.fields.country')}
        value={<Typography>{service?.country?.label ?? '-'}</Typography>}
        dataTestId="staffAuditClientList-companyId-serviceDetail.service.fields.country"
      />
      <LineSection
        title={t('serviceDetailsForm.fields.shouldDecrypt')}
        value={
          <Typography>
            {!service
              ? '-'
              : !!service.shouldDecrypt
              ? t('common:yes')
              : t('common:no')}
          </Typography>
        }
        dataTestId="staffAuditClientList-companyId-serviceDetail.service.fields.shouldDecrypt"
      />
      {service && (
        <>
          <HeaderSection
            title={t('serviceDetailsForm.title.details')}
            openModal={setShowCompanyPomModal}
            hidePenIcon={!service.shouldDecrypt}
            dataTestId="staffAuditClientList-companyId-serviceDetail.details"
          />
          {fields}
          {showCompanyPomModal && service.country && (
            <CompanyPom
              isEditing
              initialValues={data}
              country={service.country}
              handleSubmit={handleSubmitEditForm}
              onClose={() => {
                setShowCompanyPomModal(false);
              }}
              companyId={companyId}
              dataTestId={'companyPeopleOnboardingUpdate-bulkUploadMode-pom'}
            />
          )}
        </>
      )}
    </Grid>
  );
};

export default ServiceDetails;

import { HireType } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Autocomplete, Toast } from '@components/ui';
import { HIRING_COUNTRIES } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks';
import {
  CompanyApi,
  CompanyCreateServiceDetailsRequest,
} from '@services/apis/people';

import { BulkUploadPomFormValues } from '../config';

interface PayrollCountryFormProps {
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  dataTestId: string;
}

const PayrollCountryForm: FC<PayrollCountryFormProps> = ({
  countries,
  setToast,
  setLoading,
  dataTestId,
}) => {
  const { t } = useTranslation(
    'company-people-onboarding-create-bulk-upload-mode'
  );
  const { session } = useSessionCookies();
  const {
    values: { country },
    setFieldValue,
  } = useFormikContext<BulkUploadPomFormValues>();
  const [showCompanyPomModal, setShowCompanyPomModal] = useState(false);

  const contextCompanyId = session.user.selectedUserContext.contextCompanyId;

  const hiringCountryOptions = useMemo(
    () =>
      countries.filter((country) => HIRING_COUNTRIES.includes(country.code)),
    [countries]
  );

  useEffect(() => {
    if (country) {
      (async () => {
        try {
          setLoading(true);
          const { hasSubmitted } = await CompanyApi.checkCountryServiceDetails(
            session,
            HireType.POM,
            country.code
          );

          setLoading(false);
          if (!hasSubmitted) {
            setShowCompanyPomModal(true);
          }
        } catch (e) {
          if (isErrorResponse(e)) {
            setToast({
              severity: 'error',
              message: e.error.name,
            });
          } else {
            setToast({ severity: 'error', message: t(UNKNOWN_ERROR_MESSAGE) });
          }
          setFieldValue('country', null);
        }
      })();
    }
  }, [country, session, setLoading, setToast, setFieldValue, t]);

  const companyPom = useMemo(() => {
    if (showCompanyPomModal && country && contextCompanyId) {
      const CompanyPom = dynamic(
        () => import('@components/commons/company-pom')
      );

      const handleSubmit = async (
        values: CompanyCreateServiceDetailsRequest
      ) => {
        if (country) {
          try {
            await CompanyApi.createCountryServiceDetails(
              session,
              HireType.POM,
              country.code,
              values
            );
            setShowCompanyPomModal(false);
            setToast({
              severity: 'success',
              message: t('success'),
            });
          } catch (e) {
            /* istanbul ignore next */
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

      return (
        <CompanyPom
          country={country}
          handleSubmit={handleSubmit}
          onClose={() => {
            setFieldValue('country', null);
            setShowCompanyPomModal(false);
          }}
          companyId={contextCompanyId}
          dataTestId={`${dataTestId}-company`}
        />
      );
    }
  }, [
    showCompanyPomModal,
    country,
    setToast,
    session,
    t,
    dataTestId,
    setFieldValue,
    contextCompanyId,
  ]);

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <Autocomplete
          required
          variant="country"
          name="country"
          options={hiringCountryOptions}
          label={t('pom.steps.payrollCountry.form.country.label')}
          helperText={t('pom.steps.payrollCountry.form.country.helperText')}
          dataTestId={`${dataTestId}-field-country`}
        />
      </Grid>
      {companyPom}
    </Grid>
  );
};

export default PayrollCountryForm;

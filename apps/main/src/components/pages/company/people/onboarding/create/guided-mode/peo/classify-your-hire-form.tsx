import { HireType } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
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

import { Autocomplete, InformationCard, Select, Toast } from '@components/ui';
import { BOOLEAN_OPTIONS, HIRING_COUNTRIES } from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { LIVE_SUPPORT } from '@configs/routes';
import { useSessionCookies } from '@hooks';
import {
  CompanyApi,
  CompanyCreateServiceDetailsRequest,
} from '@services/apis/people';

import { GuidedModePeoFormValues } from './config';

interface ClassifyYourHireFormProps {
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onDisableNext: (disable: boolean) => void;
}

const ClassifyYourHireForm: FC<ClassifyYourHireFormProps> = ({
  countries,
  onDisableNext,
  setToast,
  setLoading,
}) => {
  const { t } = useTranslation('company-people-onboarding-create');
  const { session } = useSessionCookies();
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);

  const {
    values: {
      currency,
      hireType,
      hiringCountry,
      isHaveLegalEntity,
      isUseLegalEntity,
    },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<GuidedModePeoFormValues>();
  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!isHaveLegalEntity) {
      setFieldValue('isUseLegalEntity', null);
      setFieldTouched('isUseLegalEntity', false);
    }
  }, [isHaveLegalEntity, setFieldValue, setFieldTouched]);

  useEffect(() => {
    // select the country is not match with the selected currency: remove selected currency
    if (
      !hiringCountry ||
      (!!currency && !currency.code.includes(hiringCountry.code))
    ) {
      setFieldValue('currency', null);
    }
  }, [currency, hiringCountry, setFieldValue]);

  useEffect(() => {
    onDisableNext(!!isHaveLegalEntity && !!isUseLegalEntity);

    setFieldValue(
      'hireType',
      !!isHaveLegalEntity && !!isUseLegalEntity ? HireType.PEO : HireType.EOR
    );
  }, [isHaveLegalEntity, isUseLegalEntity, onDisableNext, setFieldValue]);

  const hiringCountryOptions = useMemo(
    () =>
      countries.filter((country) => HIRING_COUNTRIES.includes(country.code)),
    [countries]
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
    if (hiringCountry && hireType) {
      (async () => {
        try {
          setLoading(true);
          const { hasSubmitted } = await CompanyApi.checkCountryServiceDetails(
            session,
            hireType === HireType.EOR ? HireType.PEO : hireType,
            hiringCountry.code
          );

          setLoading(false);
          if (!hasSubmitted) {
            setShowServiceDetailModal(true);
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
  }, [
    session,
    setLoading,
    setToast,
    setFieldValue,
    t,
    hiringCountry,
    hireType,
  ]);

  const serviceDetails = useMemo(() => {
    if (showServiceDetailModal && hiringCountry) {
      const ServiceDetail = dynamic(
        () => import('@components/commons/company-peo-eor/service-details')
      );

      const handleSubmit = async (
        values: CompanyCreateServiceDetailsRequest
      ) => {
        /* istanbul ignore else */
        // This case cannot reproduce
        if (hiringCountry && hireType) {
          try {
            await CompanyApi.createCountryServiceDetails(
              session,
              hireType === HireType.EOR ? HireType.PEO : hireType,
              hiringCountry.code,
              values
            );
            setShowServiceDetailModal(false);

            setToast({
              severity: 'success',
              message: t('common:success'),
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
        <ServiceDetail
          country={hiringCountry}
          handleSubmit={handleSubmit}
          onClose={() => {
            setFieldValue('hiringCountry', null);
            setShowServiceDetailModal(false);
          }}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo"
        />
      );
    }
  }, [
    hireType,
    hiringCountry,
    session,
    setFieldValue,
    setToast,
    showServiceDetailModal,
    t,
  ]);

  const isPeoHiring = isHaveLegalEntity && isUseLegalEntity;
  const isEorHiring =
    isHaveLegalEntity === 0 || (isHaveLegalEntity && isUseLegalEntity === 0);

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <Autocomplete
          required
          name="hiringCountry"
          options={hiringCountryOptions}
          variant="country"
          label={t('guidedMode.classifyYourHire.form.country.label')}
          helperText={t('guidedMode.classifyYourHire.form.country.helperText')}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-country"
        />
      </Grid>
      {serviceDetails}
      <Grid item xs={12}>
        <Select
          required
          name="isHaveLegalEntity"
          options={yesNoOptions}
          label={t('guidedMode.classifyYourHire.form.legalEntity.label')}
          helperText={t(
            'guidedMode.classifyYourHire.form.legalEntity.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isHaveLegalEntity"
        />
      </Grid>
      {!!isHaveLegalEntity && (
        <Grid item xs={12}>
          <Select
            required
            name="isUseLegalEntity"
            options={yesNoOptions}
            label={t('guidedMode.classifyYourHire.form.hiringEntity.label')}
            helperText={t(
              'guidedMode.classifyYourHire.form.hiringEntity.helperText'
            )}
            dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isUseLegalEntity"
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <InformationCard
          description={
            isPeoHiring
              ? t(
                  'guidedMode.classifyYourHire.form.detailedExplanation.forPeoHiring'
                )
              : isEorHiring
              ? t(
                  'guidedMode.classifyYourHire.form.detailedExplanation.forEorHiring'
                )
              : ''
          }
          disabled={!isUseLegalEntity}
          hidden={!isPeoHiring && !isEorHiring}
          dataTestId=""
          href={LIVE_SUPPORT.path}
          onClick={() => {
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.CLIENT_PORTAL_ELIGIBLE_HIRE_PEO_ASSISTANCE,
            });
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ClassifyYourHireForm;

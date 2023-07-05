import { CitizenshipStatus } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';

import { Autocomplete, InformationCard, Select } from '@components/ui';
import {
  BOOLEAN_OPTIONS,
  CITIZENSHIP_STATUS_OPTIONS,
} from '@configs/constants';
import { LIVE_SUPPORT } from '@configs/routes';

import {
  GuidedModePeoFormValues,
  HIDDEN_CITIZENSHIP_STATUS_OPTIONS,
} from './config';

interface HiringDetailsFormProps {
  countries: CountryOption[];
  currencies: CurrencyOption[];
  onDisableNext: (disable: boolean) => void;
}

const HiringDetailsForm: FC<HiringDetailsFormProps> = ({
  countries,
  currencies,
  onDisableNext,
}) => {
  const { t } = useTranslation('company-people-onboarding-create');
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const {
    values: { isWorkPermitActive, hiringCountry, currency, citizenshipStatus },
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<GuidedModePeoFormValues>();
  useEffect(() => {
    /* istanbul ignore else */
    // This case cannot reproduce
    if (!!hiringCountry) {
      const options = currencies.filter((currency) =>
        currency.code.includes(hiringCountry.code)
      );
      setCurrencyOptions(options);

      /* istanbul ignore if */
      // This case cannot reproduce
      // select the country is not match with the selected currency
      if (!!currency && !currency.code.includes(hiringCountry.code)) {
        setFieldValue('currency', null);
        setFieldTouched('currency', false);
      }
    } else {
      setCurrencyOptions(currencies);
    }
  }, [currencies, currency, hiringCountry, setFieldValue, setFieldTouched]);

  useEffect(() => {
    onDisableNext(
      !!citizenshipStatus &&
        citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER &&
        !isWorkPermitActive &&
        isWorkPermitActive !== ''
    );
  }, [isWorkPermitActive, citizenshipStatus, onDisableNext]);

  useEffect(() => {
    if (citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER) return;

    setFieldValue('isWorkPermitActive', null);
    setFieldTouched('isWorkPermitActive', false);
  }, [citizenshipStatus, setFieldTouched, setFieldValue]);

  const citizenshipStatusOptions = useMemo(() => {
    const hiddenOptions = hiringCountry
      ? HIDDEN_CITIZENSHIP_STATUS_OPTIONS[hiringCountry.code]
      : /* istanbul ignore next */
        // This case cannot reproduce
        [];

    return CITIZENSHIP_STATUS_OPTIONS.filter(
      ({ id }) => !hiddenOptions.includes(id as CitizenshipStatus)
    ).map((hireType) => ({
      ...hireType,
      label: t(hireType.label),
    }));
  }, [t, hiringCountry]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <Autocomplete
          required
          name="nationality"
          options={countries}
          variant="country"
          label={t('guidedMode.PEO.hiringDetails.form.nationality.label')}
          helperText={t(
            'guidedMode.PEO.hiringDetails.form.nationality.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-nationality"
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          required
          name="citizenshipStatus"
          options={citizenshipStatusOptions}
          label={t('guidedMode.PEO.hiringDetails.form.citizenshipStatus.label')}
          helperText={t(
            'guidedMode.PEO.hiringDetails.form.citizenshipStatus.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-citizenshipStatus"
        />
      </Grid>
      {!!citizenshipStatus &&
        citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER && (
          <Grid item xs={12}>
            <Select
              required
              name="isWorkPermitActive"
              options={yesNoOptions}
              label={t(
                'guidedMode.PEO.hiringDetails.form.isWorkPermitActive.label'
              )}
              helperText={t(
                'guidedMode.PEO.hiringDetails.form.isWorkPermitActive.helperText'
              )}
              dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isWorkPermitActive"
            />
          </Grid>
        )}
      <Grid item xs={12}>
        <InformationCard
          description={t(
            'guidedMode.PEO.hiringDetails.form.isWorkPermitActive.detailedExplanation'
          )}
          disabled={false}
          hidden={
            !!isWorkPermitActive === true ||
            isWorkPermitActive === '' ||
            isWorkPermitActive === null
          }
          href={LIVE_SUPPORT.path}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-isWorkPermitActive-detailedExplanation"
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="currency"
          variant="currency"
          options={currencyOptions}
          label={t('guidedMode.PEO.hiringDetails.form.currency.label')}
          helperText={t(
            'guidedMode.PEO.hiringDetails.form.currency.helperText'
          )}
          dataTestId="companyPeopleOnboardingCreate-guidedMode-peo-field-currency"
        />
      </Grid>
    </Grid>
  );
};

export default HiringDetailsForm;

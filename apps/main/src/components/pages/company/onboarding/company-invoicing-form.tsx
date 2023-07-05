import { CountryCode } from '@ayp/typings/commons';
import { CurrencyOption } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo } from 'react';

import { Autocomplete, Select, TextField } from '@components/ui';
import { BOOLEAN_OPTIONS } from '@configs/constants';

import { CompanyOnboardingFormValues } from '@components/pages/company/onboarding/config';

interface CompanyInvoicingFormProps {
  currencies: CurrencyOption[];
}

const CompanyInvoicingForm: FC<CompanyInvoicingFormProps> = ({
  currencies,
}) => {
  const { t } = useTranslation('company-onboarding');

  const {
    values: { hasSgEntity, address },
    setFieldValue,
  } = useFormikContext<CompanyOnboardingFormValues>();

  useEffect(() => {
    if (!hasSgEntity) {
      setFieldValue('sgEntityUen', null);
      setFieldValue('sgEntityName', null);
    }
  }, [hasSgEntity, setFieldValue]);

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const isSgCompany = address?.countryCode === CountryCode.SINGAPORE;

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="registrationId"
          label={t('companyInvoicing.form.registrationId.label')}
          helperText={t('companyInvoicing.form.registrationId.helperText')}
          dataTestId="companyOnboarding-fields-registrationId"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="taxId"
          label={t('companyInvoicing.form.taxId.label')}
          helperText={t('companyInvoicing.form.taxId.helperText')}
          dataTestId="companyOnboarding-fields-taxId"
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="currency"
          variant="currency"
          options={currencies}
          label={t('companyInvoicing.form.currency.label')}
          helperText={t('companyInvoicing.form.currency.helperText')}
          dataTestId="companyOnboarding-fields-currency"
        />
      </Grid>
      {!isSgCompany && (
        <>
          <Grid item xs={12}>
            <Select
              required
              name="hasSgEntity"
              options={yesNoOptions}
              label={t('companyInvoicing.form.hasSgEntity.label')}
              helperText={t('companyInvoicing.form.hasSgEntity.helperText')}
              dataTestId="companyOnboarding-fields-hasSgEntity"
            />
          </Grid>
          {!!hasSgEntity && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  name="sgEntityUen"
                  label={t('companyInvoicing.form.sgEntityUen.label')}
                  helperText={t('companyInvoicing.form.sgEntityUen.helperText')}
                  dataTestId="companyOnboarding-fields-sgEntityUen"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="sgEntityName"
                  label={t('companyInvoicing.form.sgEntityName.label')}
                  helperText={t(
                    'companyInvoicing.form.sgEntityName.helperText'
                  )}
                  dataTestId="companyOnboarding-fields-sgEntityName"
                />
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default CompanyInvoicingForm;

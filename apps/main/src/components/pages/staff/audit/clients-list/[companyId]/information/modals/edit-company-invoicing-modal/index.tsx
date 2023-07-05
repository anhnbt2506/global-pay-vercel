import { CountryCode } from '@ayp/typings/commons';
import { CurrencyOption } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';

import { Autocomplete, Select, TextField, Toast } from '@components/ui';
import { BOOLEAN_OPTIONS } from '@configs/constants';

import { CompanyOnboardingEditFormValues } from '../../configs';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './configs';

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
  } = useFormikContext<CompanyOnboardingEditFormValues>();

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
          label={t(
            'company-onboarding:companyInvoicing.form.registrationId.label'
          )}
          helperText={t(
            'company-onboarding:companyInvoicing.form.registrationId.helperText'
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="taxId"
          label={t('company-onboarding:companyInvoicing.form.taxId.label')}
          helperText={t(
            'company-onboarding:companyInvoicing.form.taxId.helperText'
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="currency"
          variant="currency"
          options={currencies}
          label={t('company-onboarding:companyInvoicing.form.currency.label')}
          helperText={t(
            'company-onboarding:companyInvoicing.form.currency.helperText'
          )}
        />
      </Grid>
      {!isSgCompany && (
        <>
          <Grid item xs={12}>
            <Select
              required
              name="hasSgEntity"
              options={yesNoOptions}
              label={t(
                'company-onboarding:companyInvoicing.form.hasSgEntity.label'
              )}
              helperText={t(
                'company-onboarding:companyInvoicing.form.hasSgEntity.helperText'
              )}
            />
          </Grid>
          {!!hasSgEntity && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  name="sgEntityUen"
                  label={t(
                    'company-onboarding:companyInvoicing.form.sgEntityUen.label'
                  )}
                  helperText={t(
                    'company-onboarding:companyInvoicing.form.sgEntityUen.helperText'
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="sgEntityName"
                  label={t(
                    'company-onboarding:companyInvoicing.form.sgEntityName.label'
                  )}
                  helperText={t(
                    'companyInvoicing.form.sgEntityName.helperText'
                  )}
                />
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

interface EditCompanyInvoicingModalProps {
  initialValues: CompanyOnboardingEditFormValues;
  currencies: CurrencyOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const EditCompanyInvoicingModal: FC<EditCompanyInvoicingModalProps> = ({
  initialValues,
  currencies,
  setToast,
  onSuccess,
  onCloseModal,
}) => {
  const { t } = useTranslation('staff-audit-client-list-company-id');

  return (
    <EditModal
      formFields={<CompanyInvoicingForm currencies={currencies} />}
      initialValues={initialValues}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      companyId={initialValues.companyId}
      modalTitle={t('informationForm.editModals.companyInvoicing.title')}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
    />
  );
};

export default EditCompanyInvoicingModal;

import { CompanyBillingAddressType } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { TFunction, useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { COMPANY_BILLING_ADDRESS_TYPE_OPTIONS } from '@configs/constants';

import { Autocomplete, Select, TextField, Toast } from '@components/ui';

import { CompanyOnboardingEditFormValues } from '../../configs';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './configs';

interface CompanyBillingFormProps {
  countries: CountryOption[];
  t: TFunction;
  dataTestId: string;
}

const CompanyBillingForm: FC<CompanyBillingFormProps> = ({
  countries,
  t,
  dataTestId,
}) => {
  const {
    values: { billingAddressType },
    setFieldValue,
  } = useFormikContext<CompanyOnboardingEditFormValues>();

  const isAlternativeAdrress =
    billingAddressType === CompanyBillingAddressType.ALTERNATE_ADDRESS;

  useEffect(() => {
    if (!isAlternativeAdrress) {
      setFieldValue('billingAddress.country', null);
      setFieldValue('billingAddress.addressLine', null);
      setFieldValue('billingAddress.city', null);
      setFieldValue('billingAddress.state', null);
      setFieldValue('billingAddress.postalCode', null);
    }
  }, [isAlternativeAdrress, setFieldValue]);

  const companyBillingAddressTypeOptions = useMemo(
    () =>
      COMPANY_BILLING_ADDRESS_TYPE_OPTIONS.map((billingAddressType) => ({
        ...billingAddressType,
        label: t(billingAddressType.label),
      })),
    [t]
  );

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <Select
          required
          name="billingAddressType"
          options={companyBillingAddressTypeOptions}
          label={t(
            'informationForm.editModals.companyBilling.fields.billingInformation.label'
          )}
          helperText={t(
            'informationForm.editModals.companyBilling.fields.billingInformation.helperText'
          )}
          dataTestId={`${dataTestId}-billingAddressType`}
        />
      </Grid>
      {isAlternativeAdrress && (
        <>
          <Grid item xs={12}>
            <Autocomplete
              required
              name="billingAddress.country"
              variant="country"
              options={countries}
              label={t(
                'informationForm.editModals.companyBilling.fields.country.label'
              )}
              helperText={t(
                'informationForm.editModals.companyBilling.fields.country.helperText'
              )}
              dataTestId={`${dataTestId}-country`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="billingAddress.addressLine"
              label={t(
                'informationForm.editModals.companyBilling.fields.addressLine.label'
              )}
              helperText={t(
                'informationForm.editModals.companyBilling.fields.addressLine.helperText'
              )}
              dataTestId={`${dataTestId}-addressLine`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="billingAddress.city"
              label={t(
                'informationForm.editModals.companyBilling.fields.city.label'
              )}
              helperText={t(
                'informationForm.editModals.companyBilling.fields.city.helperText'
              )}
              dataTestId={`${dataTestId}-city`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="billingAddress.state"
              label={t(
                'informationForm.editModals.companyBilling.fields.state.label'
              )}
              helperText={t(
                'informationForm.editModals.companyBilling.fields.state.helperText'
              )}
              dataTestId={`${dataTestId}-state`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="billingAddress.postalCode"
              label={t(
                'informationForm.editModals.companyBilling.fields.postalCode.label'
              )}
              helperText={t(
                'informationForm.editModals.companyBilling.fields.postalCode.helperText'
              )}
              dataTestId={`${dataTestId}-postalCode`}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

interface EditCompanyBillingModalProps {
  initialValues: CompanyOnboardingEditFormValues;
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
  dataTestId: string;
}

const EditCompanyBillingModal: FC<EditCompanyBillingModalProps> = ({
  initialValues,
  countries,
  onCloseModal,
  onSuccess,
  setToast,
  dataTestId,
}) => {
  const { t } = useTranslation('staff-audit-client-list-company-id');

  return (
    <EditModal
      formFields={
        <CompanyBillingForm
          countries={countries}
          t={t}
          dataTestId={dataTestId}
        />
      }
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      companyId={initialValues.companyId}
      modalTitle={t('informationForm.editModals.companyBilling.title')}
    />
  );
};

export default EditCompanyBillingModal;

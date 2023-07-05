import { CountryOption, Option } from '@ayp/typings/ui';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import {
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from 'react';
import memoizee from 'memoizee';

import { Autocomplete, Select, TextField, Toast } from '@components/ui';
import { COMPANY_CATEGORY_OPTIONS } from '@configs/constants';
import { useSessionCookies } from '@hooks/use-session-cookies';
import { UserSession } from '@ayp/typings/commons';
import { IndustryApi } from '@services/apis/people';

import { CompanyOnboardingEditFormValues } from '../../configs';
import { EditModal } from '../commons';
import { mapToRequestBody, validationSchema } from './configs';

interface EditCompanyInformationModalProps {
  initialValues: CompanyOnboardingEditFormValues;
  countries: CountryOption[];
  setToast: Dispatch<SetStateAction<Toast>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
}

const getIndustryListMemo = memoizee(
  async (session: UserSession): Promise<Option[]> => {
    const { industries } = await IndustryApi.listSelection(session);

    return industries.map((industry) => ({
      id: industry.industryId,
      label: industry.name,
    }));
  },
  { promise: true }
);

const EditCompanyInformationModal: FC<EditCompanyInformationModalProps> = ({
  initialValues,
  countries,
  onCloseModal,
  onSuccess,
  setToast,
}) => {
  const { t } = useTranslation('staff-audit-client-list-company-id');
  const { session } = useSessionCookies();
  const [industries, setIndustries] = useState<Option[]>([]);

  const companyCategoryOptions = useMemo(
    () =>
      COMPANY_CATEGORY_OPTIONS.map((companyCategory) => ({
        ...companyCategory,
        label: t(companyCategory.label),
      })),
    [t]
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const industries = await getIndustryListMemo(session);
        setIndustries(industries);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, [t, session]);

  const companyInformationForm = useMemo(
    () => (
      <>
        <Grid container spacing={2} maxWidth="sm">
          <Grid item xs={12}>
            <Autocomplete
              required
              name="address.country"
              variant="country"
              options={countries}
              label={t(
                'informationForm.editModals.companyInformation.fields.country.label'
              )}
              helperText={t(
                'informationForm.editModals.companyInformation.fields.country.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.country"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="address.addressLine"
              label={t(
                'company-onboarding:companyInformation.form.addressLine.label'
              )}
              helperText={t(
                'company-onboarding:companyInformation.form.addressLine.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.addressLine"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="address.city"
              label={t('company-onboarding:companyInformation.form.city.label')}
              helperText={t(
                'company-onboarding:companyInformation.form.city.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.city"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="address.state"
              label={t(
                'company-onboarding:companyInformation.form.state.label'
              )}
              helperText={t(
                'company-onboarding:companyInformation.form.state.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.state"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name="address.postalCode"
              label={t(
                'company-onboarding:companyInformation.form.postalCode.label'
              )}
              helperText={t(
                'company-onboarding:companyInformation.form.postalCode.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.postalCode"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="industry.industryId"
              options={industries}
              label={t(
                'company-onboarding:companyInformation.form.industry.label'
              )}
              helperText={t(
                'company-onboarding:companyInformation.form.industry.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.industry"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              required
              name="category"
              options={companyCategoryOptions}
              label={t(
                'company-onboarding:companyInformation.form.category.label'
              )}
              helperText={t(
                'company-onboarding:companyInformation.form.category.helperText'
              )}
              dataTestId="staffAuditClientList-editCompanyInformation.fields.category"
            />
          </Grid>
        </Grid>
      </>
    ),
    [companyCategoryOptions, industries, countries, t]
  );

  return (
    <EditModal
      formFields={companyInformationForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
      mapToRequestBody={mapToRequestBody}
      onCloseModal={onCloseModal}
      onSuccess={onSuccess}
      setToast={setToast}
      companyId={initialValues.companyId}
      modalTitle={t('informationForm.editModals.companyInformation.title')}
    />
  );
};

export default EditCompanyInformationModal;

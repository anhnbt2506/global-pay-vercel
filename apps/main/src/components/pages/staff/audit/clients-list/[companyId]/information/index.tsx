import { Company, CompanyUser } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption } from '@ayp/typings/ui';
import { Edit } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { TFunction } from 'next-i18next';
import { FC, ReactNode, useMemo, useState } from 'react';

import { CountryFlag, Toast } from '@components/ui';
import {
  COMPANY_CATEGORY_LABEL_PREFIX,
  COMPANY_STATUS_LABEL_PREFIX,
  COMPANY_BILLING_ADDRESS_TYPE_LABEL_PREFIX,
} from '@configs/constants';

import {
  ListEditedSection,
  mapToCompanyOnboardingEditFormValues,
} from './configs';
import EditCompanyInformationModal from './modals/edit-company-information-modal';
import EditCompanyInvoicingModal from './modals/edit-company-invoicing-modal';
import EditCompanyBillingModal from './modals/edit-company-billing-modal';

interface InformationProps {
  t: TFunction;
  company: Company;
  countries: CountryOption[];
  currencies: CurrencyOption[];
}

const HeaderSection: FC<{
  title: string;
  dataTestId?: string;
  onEdit?: VoidFunction;
}> = ({ title, dataTestId, onEdit }) => {
  return (
    <>
      <Grid item lg={onEdit ? 3 : 12}>
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
      {onEdit && (
        <Grid
          item
          lg={9}
          sx={{
            marginY: 'auto',
          }}
        >
          <IconButton
            onClick={onEdit}
            data-testid={`${dataTestId}-button-edit`}
          >
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </Grid>
      )}
    </>
  );
};

const LineSection: FC<{
  title: string;
  value?: ReactNode;
  dataTestId?: string;
}> = ({ title, value, dataTestId }) => {
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

const CountryValue: FC<{ countryCode: string; countryName: string }> = ({
  countryCode,
  countryName,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <CountryFlag code={countryCode} />
    <Typography ml={2}>{countryName}</Typography>
  </Box>
);

const Information: FC<InformationProps> = ({
  t,
  company,
  countries,
  currencies,
}) => {
  const {
    companyId,
    currency,
    registeredBy,
    status,
    address,
    registrationId,
    taxId,
    hasSgEntity,
    sgEntityUen,
    sgEntityName,
    category,
    industry,
    billingAddressType,
    billingAddress,
  } = company;
  const [selectedEditModal, setSelectedEditModal] =
    useState<Nullable<ListEditedSection>>(null);
  const [toast, setToast] = useState<Toast>({});

  const currentModal = useMemo(() => {
    const initialValues = mapToCompanyOnboardingEditFormValues(
      company,
      countries,
      currencies
    );
    switch (selectedEditModal) {
      case ListEditedSection.COMPANY_INFORMATION:
        return (
          <EditCompanyInformationModal
            initialValues={initialValues}
            countries={countries}
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={() => window.location.reload()}
            setToast={setToast}
          />
        );
      case ListEditedSection.COMPANY_INVOICING:
        return (
          <EditCompanyInvoicingModal
            initialValues={initialValues}
            currencies={currencies}
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={() => window.location.reload()}
            setToast={setToast}
          />
        );
      case ListEditedSection.COMPANY_BILLING:
        return (
          <EditCompanyBillingModal
            initialValues={initialValues}
            countries={countries}
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={() => window.location.reload()}
            setToast={setToast}
            dataTestId="staffAuditClientList-editCompanyBilling-fields"
          />
        );
      default:
        return <></>;
    }
  }, [company, selectedEditModal, countries, currencies]);

  return (
    <>
      {selectedEditModal && currentModal}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffAuditClientList-companyId-information-toast"
      >
        {toast.message}
      </Toast>
      <Grid container spacing={2} sx={{ paddingBottom: '2rem' }}>
        <HeaderSection
          title={t('informationForm.title.verification')}
          dataTestId="staffAuditClientList-companyId-information.verification"
        />
        <LineSection
          title={t('informationForm.fields.status')}
          value={
            <Typography>
              {t(`${COMPANY_STATUS_LABEL_PREFIX}${status}`)}
            </Typography>
          }
          dataTestId="staffAuditClientList-companyId-information.verification.fields.status"
        />
        <LineSection
          title={t('informationForm.fields.entityLinkingId')}
          value={<Typography>{companyId}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.verification.fields.entityLinkingId"
        />
        <HeaderSection
          title={t('informationForm.title.companyRegistrant')}
          dataTestId="staffAuditClientList-companyId-information.companyRegistrant"
        />
        <LineSection
          title={t('informationForm.fields.registeredBy.user.firstName')}
          value={<Typography>{registeredBy.user.firstName}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyRegistrant.fields.firstName"
        />
        <LineSection
          title={t('informationForm.fields.registeredBy.user.lastName')}
          value={<Typography>{registeredBy.user.lastName}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyRegistrant.fields.lastName"
        />
        <LineSection
          title={t('informationForm.fields.registeredBy.info.jobTitle')}
          value={
            <Typography>
              {(registeredBy.info as CompanyUser).jobTitle}
            </Typography>
          }
          dataTestId="staffAuditClientList-companyId-information.companyRegistrant.fields.jobTitle"
        />
        <LineSection
          title={t('informationForm.fields.email')}
          value={<Typography>{registeredBy.user.email}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyRegistrant.fields.email"
        />
        <HeaderSection
          title={t('informationForm.title.companyInformation')}
          onEdit={() =>
            setSelectedEditModal(ListEditedSection.COMPANY_INFORMATION)
          }
          dataTestId="staffAuditClientList-companyId-information.companyInformation"
        />
        <LineSection
          title={t('informationForm.fields.country')}
          value={
            address?.country ? (
              <CountryValue
                countryCode={address.country.code}
                countryName={address.country.name}
              />
            ) : (
              <Typography>-</Typography>
            )
          }
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.country"
        />
        <LineSection
          title={t('informationForm.fields.addressLine')}
          value={<Typography>{address?.addressLine ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.addressLine"
        />
        <LineSection
          title={t('informationForm.fields.city')}
          value={<Typography>{address?.city ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.city"
        />
        <LineSection
          title={t('informationForm.fields.state')}
          value={<Typography>{address?.state ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.state"
        />
        <LineSection
          title={t('informationForm.fields.postalCode')}
          value={<Typography>{address?.postalCode ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.postalCode"
        />
        <LineSection
          title={t('informationForm.fields.category')}
          value={
            <Typography>
              {t(`${COMPANY_CATEGORY_LABEL_PREFIX}${category}`)}
            </Typography>
          }
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.category"
        />
        <LineSection
          title={t('informationForm.fields.industry')}
          value={<Typography>{industry?.name ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInformation.fields.industry"
        />
        <HeaderSection
          title={t('informationForm.title.companyBilling')}
          onEdit={() => setSelectedEditModal(ListEditedSection.COMPANY_BILLING)}
          dataTestId="staffAuditClientList-companyId-information.companyBilling"
        />
        <LineSection
          title={t('informationForm.fields.billingInformation')}
          value={
            <Typography>
              {t(
                `${COMPANY_BILLING_ADDRESS_TYPE_LABEL_PREFIX}${billingAddressType}`
              )}
            </Typography>
          }
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.billingInformation"
        />
        <LineSection
          title={t('informationForm.fields.billingAddress.countryCode')}
          value={
            billingAddress?.country ? (
              <CountryValue
                countryCode={billingAddress.country.code}
                countryName={billingAddress.country.name}
              />
            ) : (
              <Typography>-</Typography>
            )
          }
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.countryCode"
        />
        <LineSection
          title={t('informationForm.fields.billingAddress.addressLine')}
          value={<Typography>{billingAddress?.addressLine ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.addressLine"
        />
        <LineSection
          title={t('informationForm.fields.billingAddress.city')}
          value={<Typography>{billingAddress?.city ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.city"
        />
        <LineSection
          title={t('informationForm.fields.billingAddress.state')}
          value={<Typography>{billingAddress?.state ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.state"
        />
        <LineSection
          title={t('informationForm.fields.billingAddress.postalCode')}
          value={<Typography>{billingAddress?.postalCode ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyBilling.fields.postalCode"
        />
        <HeaderSection
          title={t('informationForm.title.companyInvoicing')}
          onEdit={() =>
            setSelectedEditModal(ListEditedSection.COMPANY_INVOICING)
          }
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing"
        />
        <LineSection
          title={t('informationForm.fields.registrationId')}
          value={<Typography>{registrationId ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.registrationId"
        />
        <LineSection
          title={t('informationForm.fields.taxId')}
          value={<Typography>{taxId ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.taxId"
        />
        <LineSection
          title={t('informationForm.fields.currency')}
          value={<Typography>{currency ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.currency"
        />
        <LineSection
          title={t('informationForm.fields.hasSgEntity')}
          value={
            <Typography>
              {hasSgEntity === null
                ? '-'
                : !!hasSgEntity
                ? t('common:yes')
                : t('common:no')}
            </Typography>
          }
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.hasSgEntity"
        />
        <LineSection
          title={t('informationForm.fields.sgEntityName')}
          value={<Typography>{sgEntityName ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityName"
        />
        <LineSection
          title={t('informationForm.fields.sgEntityUen')}
          value={<Typography>{sgEntityUen ?? '-'}</Typography>}
          dataTestId="staffAuditClientList-companyId-information.companyInvoicing.fields.sgEntityUen"
        />
      </Grid>
    </>
  );
};

export default Information;

import { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { Grid, Typography } from '@mui/material';
import { CurrencyCode, FileManagementContext } from '@ayp/typings/commons';
import { MaritalStatus } from '@ayp/typings/entities';

import { NumberField } from '@components/ui';
import { FileUpload } from '@components/ui';
import { TextField } from '@components/ui';

import { WorkerOnboardingFormValues } from '../../config';

const LineSection: FC<{
  name: string;
  label: string;
  helperText: string;
  dataTestId?: string;
}> = ({ name, label, helperText, dataTestId }) => (
  <Grid item xs={12}>
    <NumberField
      required
      name={name}
      label={label}
      helperText={helperText}
      dataTestId={dataTestId}
      numberFormatProps={{
        allowNegative: false,
        thousandSeparator: true,
      }}
      startAdornment={CurrencyCode.THAILAND}
    />
  </Grid>
);

const ThForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const {
    values: { workerUser },
  } = useFormikContext<WorkerOnboardingFormValues>();

  const { maritalStatus } = workerUser;

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.thForm.regulatoryInformation.title')}
        </Typography>
        <LineSection
          name="additionalInfo.fatherAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.fatherAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.fatherAllowance.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.fatherAllowance"
        />
        <LineSection
          name="additionalInfo.motherAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.motherAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.motherAllowance.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.motherAllowance"
        />
        {maritalStatus === MaritalStatus.MARRIED && (
          <>
            <LineSection
              name="additionalInfo.spouseFatherAllowance"
              label={t(
                'additionalInformation.thForm.regulatoryInformation.spouseFatherAllowance.label'
              )}
              helperText={t(
                'additionalInformation.thForm.regulatoryInformation.spouseFatherAllowance.helperText'
              )}
              dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.spouseFatherAllowance"
            />
            <LineSection
              name="additionalInfo.spouseMotherAllowance"
              label={t(
                'additionalInformation.thForm.regulatoryInformation.spouseMotherAllowance.label'
              )}
              helperText={t(
                'additionalInformation.thForm.regulatoryInformation.spouseMotherAllowance.helperText'
              )}
              dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.spouseMotherAllowance"
            />
          </>
        )}
        <LineSection
          name="additionalInfo.insurancePremium"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.insurancePremium.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.insurancePremium.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.insurancePremium"
        />
        {maritalStatus === MaritalStatus.MARRIED && (
          <LineSection
            name="additionalInfo.spouseInsurancePremium"
            label={t(
              'additionalInformation.thForm.regulatoryInformation.spouseInsurancePremium.label'
            )}
            helperText={t(
              'additionalInformation.thForm.regulatoryInformation.spouseInsurancePremium.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.spouseInsurancePremium"
          />
        )}
        <LineSection
          name="additionalInfo.fatherInsurancePremium"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.fatherInsurancePremium.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.fatherInsurancePremium.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.fatherInsurancePremium"
        />
        <LineSection
          name="additionalInfo.motherInsurancePremium"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.motherInsurancePremium.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.motherInsurancePremium.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.motherInsurancePremium"
        />
        <LineSection
          name="additionalInfo.interestHousingLoan"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.interestHousingLoan.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.interestHousingLoan.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.interestHousingLoan"
        />
        <LineSection
          name="additionalInfo.educationDonationAmount"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.educationDonationAmount.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.educationDonationAmount.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.educationDonationAmount"
        />
        <LineSection
          name="additionalInfo.rmfAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.rmfAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.rmfAllowance.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.rmfAllowance"
        />
        <LineSection
          name="additionalInfo.ltfAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.ltfAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.ltfAllowance.helperText'
          )}
          dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.ltfAllowance"
        />
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.hospitalForUnemploymentInsurance"
            label={t(
              'additionalInformation.thForm.regulatoryInformation.hospitalForUnemploymentInsurance.label'
            )}
            helperText={t(
              'additionalInformation.thForm.regulatoryInformation.hospitalForUnemploymentInsurance.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.hospitalForUnemploymentInsurance"
          />
        </Grid>
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.hkForm.supportingDocuments')}
        </Typography>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="nationalIdFile"
            name="workerIdentity.nationalIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.thForm.workerIdentity.nationalIdFile.label'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.nationalIdFile"
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="houseRegistrationFile"
            name="additionalInfo.houseRegistrationFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.thForm.houseRegistrationFile.label'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.houseRegistrationFile"
          />
        </Grid>
      </Grid>
    ),
    [t, maritalStatus, context]
  );

  return form;
};

export default ThForm;

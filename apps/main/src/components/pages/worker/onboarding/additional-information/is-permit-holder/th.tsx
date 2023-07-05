import { CurrencyCode, FileManagementContext } from '@ayp/typings/commons';
import { MaritalStatus } from '@ayp/typings/entities';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { FileUpload, NumberField, TextField } from '@components/ui';

import { WorkerOnboardingFormValues } from '../../config';

const LineSection: FC<{
  name: string;
  label: string;
  helperText: string;
}> = ({ name, label, helperText }) => (
  <Grid item xs={12}>
    <NumberField
      required
      name={name}
      label={label}
      helperText={helperText}
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
        />
        <LineSection
          name="additionalInfo.motherAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.motherAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.motherAllowance.helperText'
          )}
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
            />
            <LineSection
              name="additionalInfo.spouseMotherAllowance"
              label={t(
                'additionalInformation.thForm.regulatoryInformation.spouseMotherAllowance.label'
              )}
              helperText={t(
                'additionalInformation.thForm.regulatoryInformation.spouseMotherAllowance.helperText'
              )}
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
        />
        <LineSection
          name="additionalInfo.motherInsurancePremium"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.motherInsurancePremium.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.motherInsurancePremium.helperText'
          )}
        />
        <LineSection
          name="additionalInfo.interestHousingLoan"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.interestHousingLoan.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.interestHousingLoan.helperText'
          )}
        />
        <LineSection
          name="additionalInfo.educationDonationAmount"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.educationDonationAmount.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.educationDonationAmount.helperText'
          )}
        />
        <LineSection
          name="additionalInfo.rmfAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.rmfAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.rmfAllowance.helperText'
          )}
        />
        <LineSection
          name="additionalInfo.ltfAllowance"
          label={t(
            'additionalInformation.thForm.regulatoryInformation.ltfAllowance.label'
          )}
          helperText={t(
            'additionalInformation.thForm.regulatoryInformation.ltfAllowance.helperText'
          )}
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
          />
        </Grid>
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.thForm.supportingDocuments')}
        </Typography>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="permitIdFile"
            name="workerIdentity.permitIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.thForm.workerIdentity.permitIdFile.label'
            )}
            context={context}
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
          />
        </Grid>
      </Grid>
    ),
    [t, maritalStatus, context]
  );

  return form;
};

export default ThForm;

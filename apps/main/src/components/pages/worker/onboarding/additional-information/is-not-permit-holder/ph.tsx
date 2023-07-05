import { FileManagementContext } from '@ayp/typings/commons';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { DatePicker, FileUpload, TextField } from '@components/ui';

const PhForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.phForm.regulatoryInformation.title')}
        </Typography>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.fatherName"
            label={t(
              'additionalInformation.phForm.regulatoryInformation.fatherName.label'
            )}
            helperText={t(
              'additionalInformation.phForm.regulatoryInformation.fatherName.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.fatherName"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="additionalInfo.fatherDateOfBirth"
            label={t(
              'additionalInformation.phForm.regulatoryInformation.fatherDateOfBirth.label'
            )}
            helperText={t(
              'additionalInformation.phForm.regulatoryInformation.fatherDateOfBirth.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.fatherDateOfBirth"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.motherName"
            label={t(
              'additionalInformation.phForm.regulatoryInformation.motherName.label'
            )}
            helperText={t(
              'additionalInformation.phForm.regulatoryInformation.motherName.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.motherName"
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            required
            name="additionalInfo.motherDateOfBirth"
            label={t(
              'additionalInformation.phForm.regulatoryInformation.motherDateOfBirth.label'
            )}
            helperText={t(
              'additionalInformation.phForm.regulatoryInformation.motherDateOfBirth.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.motherDateOfBirth"
          />
        </Grid>
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.phForm.supportingDocuments.title')}
        </Typography>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="tinIdFile"
            name="additionalInfo.tinIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.phForm.supportingDocuments.workerIdentity.tinIdFile'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.tinIdFile"
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="sssIdFile"
            name="additionalInfo.sssIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.phForm.supportingDocuments.workerIdentity.sssIdFile'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.sssIdFile"
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="healthIdFile"
            name="additionalInfo.healthIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.phForm.supportingDocuments.workerIdentity.healthIdFile'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.healthIdFile"
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="hdmfIdFile"
            name="additionalInfo.hdmfIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.phForm.supportingDocuments.workerIdentity.hdmfIdFile'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.hdmfIdFile"
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="birthCertificateFile"
            name="additionalInfo.birthCertificateFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.phForm.supportingDocuments.workerIdentity.birthCertificateFile'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.birthCertificateFile"
          />
        </Grid>
      </Grid>
    ),
    [t, context]
  );

  return form;
};

export default PhForm;

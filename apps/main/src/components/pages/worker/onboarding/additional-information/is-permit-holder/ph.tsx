import { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { Grid, Typography } from '@mui/material';

import { FileUpload, TextField, DatePicker } from '@components/ui';
import { FileManagementContext } from '@ayp/typings/commons';

const PhForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.thForm.regulatoryInformation.title')}
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
          />
        </Grid>
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.phForm.supportingDocuments.title')}
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
              'additionalInformation.phForm.supportingDocuments.workerIdentity.permitIdFile.label'
            )}
            context={context}
          />
        </Grid>
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
          />
        </Grid>
      </Grid>
    ),
    [t, context]
  );

  return form;
};

export default PhForm;

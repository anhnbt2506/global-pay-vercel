import { FileManagementContext } from '@ayp/typings/commons';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { FileUpload, TextField } from '@components/ui';

const HkForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.hkForm.regulatoryInformation.title')}
        </Typography>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.mpfId"
            label={t(
              'additionalInformation.hkForm.regulatoryInformation.label'
            )}
            helperText={t(
              'additionalInformation.hkForm.regulatoryInformation.helperText'
            )}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.mpfId"
          />
        </Grid>
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.hkForm.supportingDocuments')}
        </Typography>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="passportFile"
            name="workerIdentity.passportFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.hkForm.workerIdentity.passportFile.label'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.passportFile"
          />
        </Grid>
      </Grid>
    ),
    [t, context]
  );

  return form;
};

export default HkForm;

import { FileManagementContext } from '@ayp/typings/commons';
import { useTranslation } from 'next-i18next';
import { Grid, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

import { FileUpload } from '@components/ui';

const VnForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.form.title')}
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
              'additionalInformation.form.workerIdentity.nationalIdFile.label'
            )}
            context={context}
            dataTestId="workerOnboarding-additionalInformation-field-workerIdentity.nationalIdFile"
          />
        </Grid>
      </Grid>
    ),
    [t, context]
  );

  return form;
};

export default VnForm;

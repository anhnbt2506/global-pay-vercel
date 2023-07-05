import { FileManagementContext } from '@ayp/typings/commons';
import { useTranslation } from 'next-i18next';
import { Grid, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

import { FileUpload, NumberField } from '@components/ui';

const IdForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.idForm.title')}
        </Typography>
        <Grid item xs={12}>
          <NumberField
            required
            name="additionalInfo.numberOfChildren"
            label={t('additionalInformation.idForm.numberOfChildren.label')}
            helperText={t(
              'additionalInformation.idForm.numberOfChildren.helperText'
            )}
            numberFormatProps={{
              decimalScale: 0,
              allowNegative: false,
            }}
          />
        </Grid>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ margin: '1.5rem 0 0 1rem' }}
        >
          {t('additionalInformation.form.title')}
        </Typography>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="familyCardFile"
            name="additionalInfo.familyCardFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t('additionalInformation.idForm.familyCardFile.label')}
            context={context}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="npwpCardFile"
            name="additionalInfo.npwpCardFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t('additionalInformation.idForm.npwpCardFile.label')}
            context={context}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="bpjsKetenagakerjaanCardFile"
            name="additionalInfo.bpjsKetenagakerjaanCardFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.idForm.bpjsKetenagakerjaanCardFile.label'
            )}
            context={context}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="bpjsKesehatanCardFile"
            name="additionalInfo.bpjsKesehatanCardFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.idForm.bpjsKesehatanCardFile.label'
            )}
            context={context}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required
            uploadFileOnChange
            keyName="permitIdFile"
            name="workerIdentity.permitIdFile"
            maxFileSizeInMb={10}
            allowedFileType={['.jpg', '.png', '.pdf']}
            label={t(
              'additionalInformation.form.workerIdentity.permitIdFile.label'
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

export default IdForm;

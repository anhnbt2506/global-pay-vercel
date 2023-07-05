import { FileManagementContext } from '@ayp/typings/commons';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.numberOfChildren"
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.familyCardFile"
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.npwpCardFile"
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.bpjsKetenagakerjaanCardFile"
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.bpjsKesehatanCardFile"
          />
        </Grid>
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
            dataTestId="workerOnboarding-additionalInformation-field-additionalInfo.nationalIdFile"
          />
        </Grid>
      </Grid>
    ),
    [t, context]
  );

  return form;
};

export default IdForm;

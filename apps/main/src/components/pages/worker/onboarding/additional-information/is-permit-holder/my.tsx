import { useTranslation } from 'next-i18next';
import { Grid, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { MaritalStatus } from '@ayp/typings/entities';
import { FileManagementContext } from '@ayp/typings/commons';

import { FileUpload, TextField, Select } from '@components/ui';
import { BOOLEAN_OPTIONS } from '@configs/constants';

import { WorkerOnboardingFormValues } from '../../config';

const MyForm: FC<{ context: FileManagementContext }> = ({ context }) => {
  const { t } = useTranslation('worker-onboarding');

  const {
    values: { workerUser },
  } = useFormikContext<WorkerOnboardingFormValues>();

  const { maritalStatus } = workerUser;

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t]
  );

  const form = useMemo(
    () => (
      <Grid container spacing={2} maxWidth="sm">
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.myForm.regulatoryInformation.title')}
        </Typography>
        <Grid item xs={12}>
          <TextField
            required
            name="additionalInfo.epfId"
            label={t(
              'additionalInformation.myForm.regulatoryInformation.label'
            )}
            helperText={t(
              'additionalInformation.myForm.regulatoryInformation.helperText'
            )}
          />
        </Grid>
        {maritalStatus === MaritalStatus.MARRIED && (
          <Grid item xs={12}>
            <Select
              required
              name="additionalInfo.isSpouseWorking"
              options={yesNoOptions}
              label={t('additionalInformation.myForm.spouseWorking.label')}
              helperText={t(
                'additionalInformation.myForm.spouseWorking.helperText'
              )}
            />
          </Grid>
        )}
        <Typography variant="h6" textAlign="center" marginLeft="1rem">
          {t('additionalInformation.myForm.supportingDocuments')}
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
              'additionalInformation.myForm.workerIdentity.permitIdFile.label'
            )}
            context={context}
          />
        </Grid>
      </Grid>
    ),
    [t, yesNoOptions, maritalStatus, context]
  );

  return form;
};

export default MyForm;

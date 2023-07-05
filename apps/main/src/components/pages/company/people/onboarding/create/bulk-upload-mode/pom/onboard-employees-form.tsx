import {
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import { HireType } from '@ayp/typings/entities';
import { Grid, List, ListItem, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';

import { FileUpload, Link } from '@components/ui';

import { BulkUploadPomFormValues, getBulkUploadByCountry } from './config';

const OnboardEmployee: FC<{
  dataTestId?: string;
}> = ({ dataTestId }) => {
  const { t } = useTranslation(
    'company-people-onboarding-create-bulk-upload-mode'
  );

  const context: FileManagementContext = {
    type: FileManagementContextType.COMPANY,
    hireType: HireType.POM,
  };

  const {
    values: { country },
  } = useFormikContext<BulkUploadPomFormValues>();

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <List>
          <ListItem>
            <Typography variant="body1">
              {t('pom.steps.onboardEmployees.form.step1.description')}{' '}
              {!!country?.code && (
                <Link
                  href={getBulkUploadByCountry(country.code)}
                  newTab
                  external
                >
                  {t('pom.steps.onboardEmployees.form.step1.here')}
                </Link>
              )}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              {t('pom.steps.onboardEmployees.form.step2.description')}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              {t('pom.steps.onboardEmployees.form.step3.description')}
            </Typography>
          </ListItem>
          <ListItem
            sx={{
              paddingX: '2rem',
            }}
          >
            <FileUpload
              required
              name="file"
              label={t(
                'pom.steps.onboardEmployees.form.step3.csvBulkUpload.label'
              )}
              maxFileSizeInMb={10}
              allowedFileType={['.csv']}
              context={context}
              dataTestId={`${dataTestId}-file`}
              withoutUpload
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default OnboardEmployee;

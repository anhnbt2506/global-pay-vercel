import {
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import { isErrorResponse } from '@ayp/utils';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction } from 'react';

import { ButtonSubmit, FileUpload, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { S3Api } from '@services/s3';

import {
  FileManagementReUploadValues,
  initialValues,
  validationSchema,
} from './config';

const ReUploadModal: FC<{
  keyName: string;
  t: TFunction;
  setShowReUploadModal: Dispatch<SetStateAction<boolean>>;
  setToast: Dispatch<SetStateAction<Toast>>;
  fetchDataAfterReUpload: () => Promise<void>;
}> = ({
  keyName,
  t,
  setShowReUploadModal,
  setToast,
  fetchDataAfterReUpload,
}) => {
  const context: FileManagementContext = {
    type: FileManagementContextType.S3_PATH,
  };

  const onSubmit = async (values: FileManagementReUploadValues) => {
    try {
      const { reUploadFile, uploadContext } = values;
      /* istanbul ignore next */
      // this case doesn't necessary to test
      if (!reUploadFile || !uploadContext) return;

      await S3Api.upload(
        reUploadFile,
        uploadContext.presignedUrl,
        uploadContext.headers
      );

      await fetchDataAfterReUpload();

      setToast({
        severity: 'success',
        message: t('file-management:reUploadModal.fileUploaded'),
      });
    } catch (e) {
      /* istanbul ignore next */
      // this case doesn't necessary to test
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
        });
      } else {
        setToast({
          severity: 'error',
          message: t(UNKNOWN_ERROR_MESSAGE),
        });
      }
    } finally {
      setShowReUploadModal(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          paddingX: '2rem',
          paddingTop: '2rem',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          align="center"
          data-testid="fileManagement-table-reUploadModal-title"
        >
          {t('file-management:reUploadModal.title')}
        </Typography>
        <Typography variant="subtitle1">
          {t('file-management:reUploadModal.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ dirty, isValid }) => (
            <Form noValidate>
              <Grid maxWidth="sm" sx={{ marginTop: '1rem' }}>
                <Grid item xs={12}>
                  <FileUpload
                    name={'reUploadFile'}
                    keyName={keyName}
                    maxFileSizeInMb={10}
                    context={context}
                    dataTestId="fileManagement-table-reUploadModal-reUploadFile"
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  gap: '2rem',
                  display: 'flex',
                  marginTop: '2rem',
                  justifyContent: 'space-around',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowReUploadModal(false)}
                  sx={{
                    paddingX: '3rem',
                  }}
                  data-testid="fileManagement-table-reUploadModal-buttonCancel"
                >
                  {t('common:cancel')}
                </Button>
                <ButtonSubmit
                  variant="contained"
                  sx={{
                    paddingX: '3rem',
                  }}
                  disabled={!dirty || !isValid}
                  data-testid="fileManagement-table-reUploadModal-buttonUpdate"
                >
                  {t('common:update')}
                </ButtonSubmit>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ReUploadModal;

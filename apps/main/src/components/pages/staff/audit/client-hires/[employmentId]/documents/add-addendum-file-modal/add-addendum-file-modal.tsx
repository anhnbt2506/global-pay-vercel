import {
  BackendResource,
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import { KnownError, isErrorResponse } from '@ayp/utils';
import { useSessionCookies } from '@hooks/use-session-cookies';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WorkerEmploymentApi } from '@services/apis/people';
import { Form, Formik } from 'formik';
import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonSubmit,
  Checkbox,
  MultipleFileUpload,
  Textarea,
  Toast,
  useMultipleFileUploadApiRef,
} from '@components/ui';
import {
  SELECT_MIN_FILE_ERROR_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from '@configs/forms';

import {
  AddAddendumFileFormValues,
  initialFormValues,
  mapToRequestBody,
  validationSchema,
} from './config';

interface AddAddendumFileModalProps {
  onClose: VoidFunction;
  onSuccess: () => void;
  setToast: Dispatch<SetStateAction<Toast>>;
  workerEmploymentId: string;
  dataTestId?: string;
}

export const AddAddendumFileModal: FC<AddAddendumFileModalProps> = ({
  onClose,
  onSuccess,
  dataTestId,
  workerEmploymentId,
  setToast,
}) => {
  const theme = useTheme();
  const { session } = useSessionCookies();
  const { t } = useTranslation('staff-audit-client-hires-employment-id');
  const multipleFileUploadApiRef = useMultipleFileUploadApiRef();

  const onSubmit = async (values: AddAddendumFileFormValues) => {
    /* istanbul ignore next */
    // this case cannot happen
    if (!multipleFileUploadApiRef?.current)
      throw new KnownError('MultipleFileUploadApiRefUndefined');

    try {
      const context: FileManagementContext = {
        type: FileManagementContextType.WORKER_ADDENDUM,
        workerEmploymentId,
      };

      const addendumFileKeys = await multipleFileUploadApiRef.current.upload(
        context
      );

      const requestBody = mapToRequestBody({
        ...values,
        addendumFileKeys,
      });

      await WorkerEmploymentApi.update(
        session,
        workerEmploymentId,
        requestBody
      );

      /* istanbul ignore next */
      // this case doesn't necessary to test
      onSuccess();
    } catch (e) {
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
      onClose();
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '2rem',
        }}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={initialFormValues}
          validationSchema={validationSchema}
        >
          {({ values }) => {
            return (
              <Form>
                <Box
                  display="flex"
                  justifyContent="center"
                  marginBottom="1rem"
                  sx={{ flexDirection: 'column' }}
                >
                  <Typography variant="h6" textAlign="center">
                    {t('addFile.title')}
                  </Typography>
                  <Typography variant="subtitle1" textAlign="center">
                    {t('addFile.description')}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultipleFileUpload
                      name="addendumFiles"
                      ref={multipleFileUploadApiRef}
                      keyName="workerAddendumFile"
                      backendResource={BackendResource.GP_PEOPLE}
                      label={t('addFile.form.addendumFiles.label')}
                      customErrorHelperText={t(SELECT_MIN_FILE_ERROR_MESSAGE, {
                        min: 1,
                      })}
                      dataTestId={`${dataTestId}.form.addendumFiles`}
                      required
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        paddingTop: '1rem',
                        width: '100%',
                      }}
                    >
                      <Checkbox
                        defaultChecked
                        name="notifyChange"
                        sx={{
                          padding: 0,
                          marginRight: '0.5rem',
                        }}
                        dataTestId={`${dataTestId}.form.notifyChange`}
                      />
                      <Typography variant="body2">
                        {t('addFile.form.notifyChange.label')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {values.notifyChange && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          paddingY: '0.5rem',
                        }}
                      >
                        {t('addFile.form.addComment.label')}
                      </Typography>
                      <Textarea
                        name="comment"
                        value={
                          values.notifyChange && values.comment === undefined
                            ? (values.comment = t(
                                'addFile.form.comment.prefilledComment'
                              ))
                            : values.comment || ''
                        }
                        style={{
                          width: '100%',
                          height: '5rem',
                          padding: '0.5rem',
                          overflow: 'auto',
                          resize: 'none',
                          borderRadius: '0.25rem',
                          borderColor: theme.palette.customs.doveGray,
                        }}
                        dataTestId={`${dataTestId}.form.comment`}
                      />
                    </Grid>
                  </Grid>
                )}

                <Stack
                  direction="row"
                  sx={{
                    gap: '2rem',
                    marginTop: '2rem',
                    justifyContent: 'space-around',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                      paddingX: '3rem',
                    }}
                    data-testid={`${dataTestId}-buttonCancel`}
                  >
                    {t('common:cancel')}
                  </Button>
                  <ButtonSubmit
                    data-testid={`${dataTestId}-buttonSubmit`}
                    variant="contained"
                    sx={{
                      paddingX: '3rem',
                    }}
                  >
                    {t('common:submit')}
                  </ButtonSubmit>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

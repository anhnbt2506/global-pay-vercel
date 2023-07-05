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
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonSubmit,
  MultipleFileUpload,
  Textarea,
  Toast,
  useMultipleFileUploadApiRef,
} from '@components/ui';
import {
  SELECT_MIN_FILE_ERROR_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from '@configs/forms';
import { WorkerEmploymentApi } from '@services/apis/people';
import { COMPANY_PEOPLE_ONBOARDING } from '@configs/routes';

import {
  GuidedModePeoFormValues,
  mapToPatchRequestBody,
  mapToPostRequestBody,
} from '../config';
import {
  RequestAddendumFormValues,
  initialFormValues,
  validationSchema,
} from './config';

interface RequestAddendumFileModalProps {
  onClose: VoidFunction;
  workerEmploymentValues: GuidedModePeoFormValues;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}
export const RequestAddendumFileModal: FC<RequestAddendumFileModalProps> = ({
  dataTestId,
  onClose,
  setToast,
  workerEmploymentValues,
}) => {
  const { t } = useTranslation('company-people-onboarding-create');
  const theme = useTheme();
  const { session } = useSessionCookies();
  const router = useRouter();
  const multipleFileUploadApiRef = useMultipleFileUploadApiRef();

  const handleUploadFiles = useCallback(
    async (
      { comment }: RequestAddendumFormValues,
      workerEmploymentId: string
    ) => {
      /* istanbul ignore next */
      // this case cannot happen
      if (!multipleFileUploadApiRef?.current)
        throw new KnownError('MultipleFileUploadApiRefUndefined');

      const context: FileManagementContext = {
        type: FileManagementContextType.WORKER_ADDENDUM,
        workerEmploymentId,
      };
      const addendumFileKeys = await multipleFileUploadApiRef.current.upload(
        context
      );

      const requestBody = Object.assign(
        {},
        await mapToPatchRequestBody(workerEmploymentValues),
        {
          comment,
          addendumFileKeys: addendumFileKeys.length
            ? addendumFileKeys
            : undefined,
        }
      );

      await WorkerEmploymentApi.update(
        session,
        workerEmploymentId,
        requestBody
      );
    },
    [multipleFileUploadApiRef, session, workerEmploymentValues]
  );

  const onSubmit = async (values: RequestAddendumFormValues) => {
    try {
      if (router.query?.employmentId) {
        await handleUploadFiles(values, router.query.employmentId as string);
      } else {
        const { workerEmployment } = await WorkerEmploymentApi.post(
          session,
          await mapToPostRequestBody(workerEmploymentValues)
        );

        await handleUploadFiles(values, workerEmployment.employmentId);
      }

      /* istanbul ignore next */
      router.push(COMPANY_PEOPLE_ONBOARDING.path);
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
          initialValues={initialFormValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Box
              display="flex"
              justifyContent="center"
              marginBottom="1rem"
              sx={{ flexDirection: 'column' }}
            >
              <Typography variant="h6" textAlign="center">
                {t('guidedMode.PEO.employmentContract.requestAddendum.label')}
              </Typography>
              <Typography variant="subtitle1" textAlign="center">
                {t(
                  'guidedMode.PEO.employmentContract.requestAddendum.description'
                )}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MultipleFileUpload
                  name="addendumFiles"
                  ref={multipleFileUploadApiRef}
                  keyName="workerAddendumFile"
                  backendResource={BackendResource.GP_PEOPLE}
                  label={t(
                    'guidedMode.PEO.employmentContract.requestAddendum.form.addendumFiles.label'
                  )}
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
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    paddingY: '0.5rem',
                  }}
                >
                  {t(
                    'guidedMode.PEO.employmentContract.requestAddendum.form.addComment.label'
                  )}
                </Typography>
                <Textarea
                  name="comment"
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
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

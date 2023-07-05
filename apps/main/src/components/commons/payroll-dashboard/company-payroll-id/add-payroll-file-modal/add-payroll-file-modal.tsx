import { KnownError, isErrorResponse } from '@ayp/utils';
import { useSessionCookies } from '@hooks';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { Trans, useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction } from 'react';

import {
  ButtonSubmit,
  Checkbox,
  MultipleFileUpload,
  Textarea,
  Toast,
  useMultipleFileUploadApiRef,
} from '@components/ui';
import { CompanyPayrollApi } from '@services/apis/fintech';

import {
  BackendResource,
  FileManagementContext,
  FileManagementContextType,
} from '@ayp/typings/commons';
import {
  SELECT_MIN_FILE_ERROR_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from '@configs/forms';

import {
  AddFileFormValues,
  initialFormValues,
  mapToRequestBody,
  validationSchema,
} from './config';

interface AddPayrollFileModalProps {
  onClose: VoidFunction;
  onSuccess: (hasAddedComment: boolean) => void;
  companyPayrollId: string;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}

export const AddPayrollFileModal: FC<AddPayrollFileModalProps> = ({
  onClose,
  onSuccess,
  companyPayrollId,
  setToast,
  dataTestId,
}) => {
  const multipleFileUploadApiRef = useMultipleFileUploadApiRef();
  const { session } = useSessionCookies();
  const theme = useTheme();
  const { t } = useTranslation('add-payroll-file-modal');

  const {
    session: {
      user: {
        selectedUserContext: { role },
      },
    },
  } = useSessionCookies();

  const context: FileManagementContext = {
    type: FileManagementContextType.COMPANY_PAYROLL_FILE,
    companyPayrollId,
  };

  const onSubmit = async (values: AddFileFormValues) => {
    /* istanbul ignore next */
    // this case cannot happen
    if (!multipleFileUploadApiRef?.current)
      throw new KnownError('MultipleFileUploadApiRefUndefined');

    try {
      const fileKeys = await multipleFileUploadApiRef.current.upload(context);

      const requestBody = mapToRequestBody({
        ...values,
        fileKeys,
      });

      await CompanyPayrollApi.createCompanyPayrollFiles(
        session,
        companyPayrollId,
        requestBody
      );
      /* istanbul ignore next */
      // this case doesn't necessary to test
      if (fileKeys.length > 1) {
        setToast({
          severity: 'success',
          message: (
            <Trans
              i18nKey={`${t('form.toast.successMultipleFiles', {
                numberOfFiles: fileKeys.length,
              })}`}
            />
          ),
        });
      } else {
        setToast({
          severity: 'success',
          message: <Trans i18nKey={`${t('form.toast.success')}`} />,
        });
      }

      onSuccess(!!values.notifyChange);
      onClose();
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
                    {t('title')}
                  </Typography>
                  <Typography variant="subtitle1" textAlign="center">
                    {t('description')}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MultipleFileUpload
                      name="payrollFiles"
                      ref={multipleFileUploadApiRef}
                      keyName="companyPayrollFile"
                      backendResource={BackendResource.GP_FINTECH}
                      label={t('form.payrollFiles.label')}
                      customErrorHelperText={t(SELECT_MIN_FILE_ERROR_MESSAGE, {
                        min: 1,
                      })}
                      dataTestId={`${dataTestId}.form.payrollFiles`}
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
                        name="notifyChange"
                        sx={{
                          padding: 0,
                          marginRight: '0.5rem',
                        }}
                        dataTestId={`${dataTestId}.form.notifyChange`}
                      />

                      <Typography variant="body2">
                        {role && role.includes('staff')
                          ? t('form.notifyChanges.staff.label')
                          : t('form.notifyChanges.client.label')}
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
                        {t('form.addComment.label')}
                      </Typography>
                      <Textarea
                        name="comment"
                        value={
                          values.notifyChange && values.comment === undefined
                            ? (values.comment = t(
                                'form.comment.prefilledComment'
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

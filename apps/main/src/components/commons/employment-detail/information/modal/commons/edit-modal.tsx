import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction } from 'react';
import type { SchemaOf } from 'yup';

import { ButtonSubmit, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks/use-session-cookies';
import { WorkerEmploymentApi } from '@services/apis/people';

import { WorkerEmploymentFormValues } from '../../config';

export const EditModal: FC<{
  modalTitle: string;
  formFields: JSX.Element;
  initialValues: WorkerEmploymentFormValues;
  validationSchema?: SchemaOf<unknown>;
  mapToRequestBody: (
    state: WorkerEmploymentFormValues
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  modalTitle,
  formFields,
  initialValues,
  validationSchema,
  mapToRequestBody,
  onCloseModal,
  onSuccess,
  setToast,
}) => {
  const { session } = useSessionCookies();
  const { t } = useTranslation('staff-audit-client-hires-employment-id');

  const onSubmit = async (values: WorkerEmploymentFormValues) => {
    try {
      await WorkerEmploymentApi.update(
        session,
        initialValues.employmentId,
        await mapToRequestBody(values)
      );
      setToast({
        severity: 'success',
        message: t('common:savedSuccessfully'),
      });
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
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1.5rem',
          }}
        >
          <Typography variant="h6" align="center" sx={{ marginBottom: '1rem' }}>
            {modalTitle}
          </Typography>
          <Typography variant="subtitle1" align="center">
            {t('informationForm.editModals.description')}
          </Typography>
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form noValidate>
            {formFields}
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
                onClick={onCloseModal}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientHires-editModal-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientHires-editModal-submitButton"
              >
                {t('common:update')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

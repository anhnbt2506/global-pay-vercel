import { isErrorResponse } from '@ayp/utils';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, Dispatch, SetStateAction } from 'react';
import type { SchemaOf } from 'yup';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';

import { ButtonSubmit, Toast } from '@components/ui';
import { useSessionCookies } from '@hooks';
import { CompanyApi } from '@services/apis/people';

import { CompanyOnboardingEditFormValues } from '../../configs';

export const EditModal: FC<{
  companyId: string;
  modalTitle: string;
  formFields: JSX.Element;
  initialValues: CompanyOnboardingEditFormValues;
  mapToRequestBody: (
    state: CompanyOnboardingEditFormValues
  ) => Record<string, unknown>;
  validationSchema: SchemaOf<unknown>;
  onCloseModal: VoidFunction;
  onSuccess: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  companyId,
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
  const { t } = useTranslation('staff-audit-client-list-company-id');

  const onSubmit = async (values: CompanyOnboardingEditFormValues) => {
    try {
      if (values) {
        await CompanyApi.updateByCompanyId(
          session,
          companyId,
          mapToRequestBody(values)
        );
        onCloseModal();
        setToast({
          severity: 'success',
          message: t('common:savedSuccessfully'),
        });
        onSuccess();
      }
    } catch (e) {
      if (isErrorResponse(e)) {
        setToast({
          severity: 'error',
          message: e.error.name,
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
            {t('informationForm.editModals.companyInformation.description')}
          </Typography>
        </Box>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
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
                data-testid="staffAuditClientList-editModal-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-editModal-submitButton"
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

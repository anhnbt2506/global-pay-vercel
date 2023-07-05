import { ErrorCode, UserSession } from '@ayp/typings/commons';
import { Department } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import { ButtonSubmit, TextField, Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { DepartmentApi } from '@services/apis/people';

import { FormValues, validationSchema } from './config';

export const DepartmentModal: FC<{
  t: TFunction;
  session: UserSession;
  isEditing?: boolean;
  name?: string;
  companyId: string;
  departmentId?: string;
  assignedEmployeeOptions?: Option<string>[];
  onSuccess: (value?: Department) => void;
  onClose: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  t,
  isEditing,
  companyId,
  departmentId = '',
  name = '',
  session,
  onClose,
  setToast,
  onSuccess,
}) => {
  const onSubmit = useCallback(
    async (values: FormValues, actions: FormikHelpers<FormValues>) => {
      try {
        if (isEditing) {
          await DepartmentApi.patch(
            session,
            companyId,
            values.name,
            departmentId
          );
          onSuccess();
        } else {
          const { department } = await DepartmentApi.post(
            session,
            companyId,
            values.name
          );
          onSuccess(department);
        }
        setToast({
          severity: 'success',
          message: t('common:savedSuccessfully'),
        });
      } catch (e) {
        if (isErrorResponse(e)) {
          switch (e.error.code) {
            case ErrorCode.BAD_REQUEST:
              actions.setErrors({
                name: t(
                  'company-department:departmentModal.toastMessage.departmentNameExisted'
                ),
              });
              break;
            default:
              setToast({
                severity: 'error',
                message: e.error.name,
              });
              onClose();
              break;
          }
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
          onClose();
        }
      }
    },
    [
      companyId,
      departmentId,
      isEditing,
      onClose,
      onSuccess,
      session,
      setToast,
      t,
    ]
  );

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
          data-testid="staffAuditClientList-companyId-departmentModal-title"
        >
          {isEditing
            ? t('company-department:departmentModal.editDepartment.title')
            : t('company-department:departmentModal.addNewDepartment.title')}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {isEditing
            ? t('company-department:departmentModal.editDepartment.description')
            : t(
                'company-department:departmentModal.addNewDepartment.description'
              )}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{ name }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form noValidate>
            <TextField
              required
              name="name"
              label={t('company-department:departmentModal.form.name.label')}
              helperText={t(
                'company-department:departmentModal.form.name.helperText'
              )}
              dataTestId="staffAuditClientList-companyId-departmentModal-field-name"
            />
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
                onClick={onClose}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-companyId-departmentModal-cancelButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffAuditClientList-companyId-departmentModal-submitButton"
              >
                {t('common:submit')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

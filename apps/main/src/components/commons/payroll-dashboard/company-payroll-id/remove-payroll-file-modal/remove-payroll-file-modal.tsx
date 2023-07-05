import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import { ButtonSubmit, Toast } from '@components/ui';
import { UserSession } from '@ayp/typings/commons';
import { FileManagementApi } from '@services/apis/fintech';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { isErrorResponse } from '@ayp/utils';

interface RemoveFileModalProps {
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  session: UserSession;
  filePath: string;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}

export const RemovePayrollFileModal: FC<RemoveFileModalProps> = ({
  onClose,
  onSuccess,
  session,
  filePath,
  setToast,
  dataTestId,
}) => {
  const { t } = useTranslation('payroll-company-payroll-id');

  const onSubmit = useCallback(async () => {
    try {
      await FileManagementApi.delete(session, filePath);
      setToast({
        severity: 'success',
        message: t('removeFileDialog.toast.success'),
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
    } finally {
      onClose();
    }
  }, [filePath, onClose, onSuccess, session, setToast, t]);

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '2rem',
        }}
      >
        <Formik onSubmit={onSubmit} initialValues={{}}>
          <Form>
            <Box
              display="flex"
              justifyContent="center"
              marginBottom="1rem"
              sx={{ flexDirection: 'column' }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                data-testid={`${dataTestId}-title`}
              >
                {t('removeFileDialog.title')}
              </Typography>
              <Typography variant="subtitle1" textAlign="center">
                {t('removeFileDialog.description')}
              </Typography>
            </Box>
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
                data-testid={`${dataTestId}-buttonCancel`}
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid={`${dataTestId}-buttonRemove`}
              >
                {t('removeFileDialog.form.confirmRemove')}
              </ButtonSubmit>
            </Box>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { TFunction } from 'next-i18next';
import { FC, Dispatch, SetStateAction } from 'react';

import { TextField, ButtonSubmit, Toast } from '@components/ui';
import { UserSession } from '@ayp/typings/commons';
import { IndustryApi } from '@services/apis/people';
import { isErrorResponse } from '@ayp/utils';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';

import { validationSchema, IndustryModalFormValues } from '../config';

const IndustryModal: FC<{
  t: TFunction;
  session: UserSession;
  isEditMode?: boolean;
  name: string;
  industryId: string;
  onSuccess: VoidFunction;
  onClose: VoidFunction;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({
  t,
  isEditMode,
  industryId,
  session,
  name,
  onClose,
  setToast,
  onSuccess,
}) => {
  const onSubmit = async (values: IndustryModalFormValues) => {
    try {
      if (!isEditMode) {
        await IndustryApi.post(session, values.name);
      } else {
        await IndustryApi.patch(session, values.name, industryId);
      }
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
    } finally {
      onClose();
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
        <Typography variant="h6">
          {!isEditMode
            ? t('industry.addNewIndustry.title')
            : t('industry.editIndustry.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          data-testid="staffSetupIndustry-selectionModal-title"
        >
          {!isEditMode
            ? t('industry.addNewIndustry.description')
            : t('industry.addNewIndustry.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            name,
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form noValidate>
            <TextField
              required
              name="name"
              label={t('industry.modal.form.name.label')}
              helperText={t('industry.modal.form.name.helperText')}
              dataTestId="staffSetupIndustry-AddOrEditIndustry-nameTextField"
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
                data-testid="staffSetupIndustry-AddOrEditIndustry-closeButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffSetupIndustry-AddOrEditIndustry-submitButton"
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

export default IndustryModal;

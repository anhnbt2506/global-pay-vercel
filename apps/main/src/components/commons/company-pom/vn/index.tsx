import { Option } from '@ayp/typings/ui';
import { fireGtmEvent } from '@ayp/utils';
import { Box, Button } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { ButtonSubmit } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';

import {
  FormValues,
  initialValues as defaultInitialValues,
  validationSchema,
} from './config';
import VnFormFields from './form-fields';

interface CompanyPomVnFormProps {
  onSubmit: (values: FormValues, action: FormikHelpers<FormValues>) => void;
  onClose: VoidFunction;
  initialValues?: FormValues;
  isEditing: boolean;
  companyId: string;
  dataTestId?: string;
  bankOptions: Option<string>[];
}

const CompanyPomVnForm: FC<CompanyPomVnFormProps> = ({
  initialValues = defaultInitialValues,
  onSubmit,
  onClose,
  isEditing,
  companyId,
  dataTestId,
  bankOptions,
}) => {
  const { t } = useTranslation('company-pom-vn-form');

  const onSubmitForm = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    onSubmit(values, actions);

    fireGtmEvent<GTM_EVENTS>({
      event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_VN_DONE,
    });
  };

  return (
    <Formik
      onSubmit={onSubmitForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Form noValidate>
        <Box display="flex" justifyContent="center" marginY="3rem">
          <VnFormFields
            bankOptions={bankOptions}
            isEditing={isEditing}
            companyId={companyId}
            dataTestId={`${dataTestId}-field`}
          />
        </Box>
        <Box
          sx={(theme) => ({
            marginTop: '1rem',
            gap: '2rem',
            display: 'flex',
            justifyContent: 'center',
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column-reverse',
            },
          })}
        >
          <Button
            variant="outlined"
            onClick={() => {
              fireGtmEvent<GTM_EVENTS>({
                event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_VN_LEAVE,
              });
              onClose();
            }}
            sx={{
              paddingX: '3rem',
            }}
            data-testid={`${dataTestId}-button-close`}
          >
            {t('common:close')}
          </Button>
          <ButtonSubmit
            variant="contained"
            sx={(theme) => ({
              paddingX: '3rem',
              [theme.breakpoints.down('sm')]: {
                width: '100%',
              },
            })}
            data-testid={`${dataTestId}-button-submit`}
          >
            {t('common:submit')}
          </ButtonSubmit>
        </Box>
      </Form>
    </Formik>
  );
};

export default CompanyPomVnForm;

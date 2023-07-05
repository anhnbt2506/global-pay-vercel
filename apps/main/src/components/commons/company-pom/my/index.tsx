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
import MyFormFields from './form-fields';

interface CompanyPomMyFormProps {
  onSubmit: (values: FormValues, action: FormikHelpers<FormValues>) => void;
  onClose: VoidFunction;
  initialValues?: FormValues;
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}

const CompanyPomMyForm: FC<CompanyPomMyFormProps> = ({
  initialValues = defaultInitialValues,
  onSubmit,
  onClose,
  isEditing,
  dataTestId,
  bankOptions,
}) => {
  const { t } = useTranslation('company-pom-my-form');

  const onSubmitForm = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    onSubmit(values, actions);

    fireGtmEvent<GTM_EVENTS>({
      event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_MY_DONE,
    });
  };

  return (
    <Formik
      onSubmit={onSubmitForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <Form noValidate>
        <MyFormFields
          bankOptions={bankOptions}
          isEditing={isEditing}
          dataTestId={`${dataTestId}-field`}
        />
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
                event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_MY_LEAVE,
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

export default CompanyPomMyForm;

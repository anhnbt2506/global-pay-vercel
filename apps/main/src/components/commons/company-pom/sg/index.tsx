import { Option } from '@ayp/typings/ui';
import { fireGtmEvent } from '@ayp/utils';
import { Box, Button } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { ButtonSubmit } from '@components/ui';
import { GTM_EVENTS } from '@configs/constants/gtm-events';

import {
  FormFieldValues,
  FormValueFromApi,
  initialValues as defaultInitialValues,
  mapInitialESubmissionServices,
  validationSchema,
} from './config';
import SgFormFields from './form-fields';

interface CompanyPomSgFormProps {
  onSubmit: (
    values: FormFieldValues,
    action: FormikHelpers<FormFieldValues>
  ) => void;
  onClose: VoidFunction;
  initialValues?: FormValueFromApi;
  isEditing: boolean;
  dataTestId: string;
  bankOptions: Option<string>[];
}

const CompanyPomSgForm: FC<CompanyPomSgFormProps> = ({
  initialValues = defaultInitialValues,
  onSubmit,
  onClose,
  isEditing,
  dataTestId,
  bankOptions,
}) => {
  const { t } = useTranslation('company-pom-sg-form');
  const { eSubmissionServices } = initialValues;

  const initValues = useMemo(
    () => ({
      ...initialValues,
      eSubmissionServices: mapInitialESubmissionServices(eSubmissionServices),
    }),
    [eSubmissionServices, initialValues]
  );

  const onSubmitForm = async (
    values: FormFieldValues,
    actions: FormikHelpers<FormFieldValues>
  ) => {
    onSubmit(values, actions);

    fireGtmEvent<GTM_EVENTS>({
      event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_SG_DONE,
    });
  };

  return (
    <Formik
      onSubmit={onSubmitForm}
      initialValues={initValues}
      validationSchema={validationSchema}
    >
      <Form noValidate>
        <SgFormFields
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
                event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_SG_LEAVE,
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

export default CompanyPomSgForm;

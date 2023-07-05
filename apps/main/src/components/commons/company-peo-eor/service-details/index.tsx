import { CountryOption } from '@ayp/typings/ui';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { SchemaOf } from 'yup';

import { ButtonSubmit } from '@components/ui';
import { CompanyCreateServiceDetailsRequest } from '@services/apis/people';

import { ServiceDetailsCountry } from './config';

interface ServiceDetailProps {
  country: CountryOption;
  dataTestId: string;
  handleSubmit: (values: CompanyCreateServiceDetailsRequest) => Promise<void>;
  onClose: VoidFunction;
}

const ServiceDetail: FC<ServiceDetailProps> = ({
  country,
  onClose,
  handleSubmit,
  dataTestId,
}) => {
  const { t } = useTranslation(
    'company-people-onboarding-create-peo-eor-service-details'
  );
  const [initialFormValues, setInitialFormValues] = useState();
  const [validationSchema, setValidationSchema] = useState<SchemaOf<unknown>>();

  useEffect(() => {
    (async () => {
      const { initialValues } = await import(
        `@components/commons/company-peo-eor/service-details/${country.code.toLocaleLowerCase()}/config`
      );
      const { validationSchema } = await import(
        `@components/commons/company-peo-eor/service-details/${country.code.toLocaleLowerCase()}/config`
      );
      setInitialFormValues(initialValues);
      setValidationSchema(validationSchema);
    })();
  }, [country.code]);

  const onSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      const { mapToRequestBody } = await import(
        `@components/commons/company-peo-eor/service-details/${country.code.toLocaleLowerCase()}/config`
      );
      handleSubmit(mapToRequestBody(values));
    },
    [handleSubmit, country]
  );

  const DynamicForm = useMemo(
    () =>
      dynamic<ServiceDetailsCountry>(
        () =>
          import(
            `@components/commons/company-peo-eor/service-details/${country.code.toLocaleLowerCase()}`
          )
      ),
    [country.code]
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '2rem',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={initialFormValues || {}}
          validationSchema={validationSchema}
        >
          <Form noValidate>
            <Box
              display="flex"
              justifyContent="center"
              marginY="1rem"
              sx={{ flexDirection: 'column' }}
            >
              <Typography variant="h6" textAlign="center">
                {t('serviceDetail.title')}
              </Typography>
              <Typography variant="subtitle1" textAlign="center">
                {t('serviceDetail.description')}
              </Typography>
            </Box>
            <DynamicForm
              dataTestId={`${dataTestId}-companyPeoEor-serviceDetail-${country.code}`}
              t={t}
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
                  onClose();
                }}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid={`${dataTestId}-companyPeoEor-serviceDetail-${country.code}-button-close`}
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
                onClick={() => onSubmit}
                data-testid={`${dataTestId}-companyPeoEor-serviceDetail-${country.code}-button-submit`}
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
export default ServiceDetail;

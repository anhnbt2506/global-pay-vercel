import { BackendResource, UserSession } from '@ayp/typings/commons';
import {
  ServiceAgreement,
  ServiceAgreementStatus,
} from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Form, Formik, FormikProps } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';

import { ConversationBox } from '@components/commons';
import {
  StaffAuditClientServiceAgreementFormValues,
  validationSchema,
} from '@components/pages/staff/audit/client-service-agreements/[id]/config';
import { TextEditor, Toast } from '@components/ui';
import { CONVERSATION_CONTEXT_TYPE_SERVICE_AGREEMENT } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { ServiceAgreementApi } from '@services/apis/people';
import { light } from '@themes';

interface AgreementProps {
  t: TFunction;
  serviceAgreement: Pick<
    ServiceAgreement,
    'serviceAgreementId' | 'conversationId' | 'status' | 'content'
  >;
  session: UserSession;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId: string;
}

export const Agreement: FC<AgreementProps> = ({
  t,
  session,
  serviceAgreement,
  setToast,
  dataTestId,
}) => {
  const theme = useTheme();

  const [isDisabled, setIsDisabled] = useState(
    serviceAgreement.status !== ServiceAgreementStatus.IN_REVIEW
  );
  const formRef =
    useRef<FormikProps<StaffAuditClientServiceAgreementFormValues>>(null);

  const onSubmit = async (
    values: StaffAuditClientServiceAgreementFormValues
  ) => {
    try {
      await ServiceAgreementApi.update(
        session,
        serviceAgreement.serviceAgreementId,
        {
          content: values.content,
          status: ServiceAgreementStatus.WAITING_CONFIRMATION,
        }
      );
      setIsDisabled(true);
      setToast({
        severity: 'success',
        message: t('common:savedSuccessfully'),
      });
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
    <Grid container spacing={2}>
      <Grid item xs={12} lg={8}>
        <Box
          sx={{
            height: '100%',
          }}
        >
          <Formik
            onSubmit={onSubmit}
            initialValues={{ content: serviceAgreement.content }}
            validationSchema={validationSchema}
            innerRef={formRef}
          >
            <Form>
              <TextEditor
                name="content"
                disabled={isDisabled}
                init={{ height: '65vh' }}
              />
            </Form>
          </Formik>
        </Box>
      </Grid>
      <Grid item xs={12} lg={4}>
        <ConversationBox
          conversationId={serviceAgreement?.conversationId ?? null}
          conversationSx={{
            border: `1px solid ${light.palette.text.disabled}`,
            boxShadow: light.palette.customs.boxShadow,
            maxHeight: '65vh',
            [theme.breakpoints.up('lg')]: {
              height: '65vh',
            },
          }}
          header={
            <>
              <Typography variant="h6">{t('conversation.title')}</Typography>
              <Typography variant="subtitle1">
                {t('conversation.description')}
              </Typography>
            </>
          }
          contextId={serviceAgreement.serviceAgreementId}
          contextType={CONVERSATION_CONTEXT_TYPE_SERVICE_AGREEMENT}
          onError={() => {
            setToast({
              severity: 'error',
              message: t(UNKNOWN_ERROR_MESSAGE),
            });
          }}
          backendResource={BackendResource.GP_PEOPLE}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: 'center',
        }}
      >
        <Button
          variant="contained"
          data-testid={`${dataTestId}-update-button`}
          disabled={isDisabled}
          sx={(theme) => ({
            paddingX: '3rem',
            marginTop: '0.5rem',
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          })}
          onClick={() => {
            formRef.current?.handleSubmit();
          }}
        >
          {t('common:update')}
        </Button>
      </Grid>
    </Grid>
  );
};

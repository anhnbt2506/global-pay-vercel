import { BackendResource } from '@ayp/typings/commons';
import {
  HireType,
  ServiceAgreement,
  ServiceAgreementStatus,
} from '@ayp/typings/entities';
import { fireGtmEvent, isErrorResponse } from '@ayp/utils';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Form, Formik, FormikProps } from 'formik';
import { TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react';

import { ConversationBox, LegalDocument } from '@components/commons';
import { Checkbox, Toast } from '@components/ui';
import { CONVERSATION_CONTEXT_TYPE_SERVICE_AGREEMENT } from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { useSessionCookies } from '@hooks';
import { ServiceAgreementApi } from '@services/apis/people';

import {
  AgreementModalFormValues,
  initialValues,
  validationSchema,
} from './config';

export const AgreementModal: FC<{
  t: TFunction;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  serviceAgreement: ServiceAgreement;
  setToast: Dispatch<SetStateAction<Toast>>;
}> = ({ t, onClose, onSuccess, serviceAgreement, setToast }) => {
  const { session } = useSessionCookies();
  const formRef = useRef<FormikProps<AgreementModalFormValues>>(null);
  const theme = useTheme();

  const onSubmit = async () => {
    try {
      await ServiceAgreementApi.signAgreement(
        session,
        serviceAgreement.serviceAgreementId
      );

      switch (serviceAgreement.hireType) {
        case HireType.PEO:
        case HireType.EOR:
          fireGtmEvent<GTM_EVENTS>({
            event: GTM_EVENTS.CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_ACK,
          });
          break;
        case HireType.POM:
          fireGtmEvent<GTM_EVENTS>({
            event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_ACK,
          });
          break;
        /* istanbul ignore next */
        // Scenario never exists
        default:
          break;
      }

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

  const onCreateConversation = async () => {
    await ServiceAgreementApi.update(
      session,
      serviceAgreement?.serviceAgreementId,
      { status: ServiceAgreementStatus.IN_REVIEW }
    );
  };

  const onReplyConversation = async () => {
    await ServiceAgreementApi.update(
      session,
      serviceAgreement?.serviceAgreementId,
      { status: ServiceAgreementStatus.IN_REVIEW }
    );
  };

  const onClickedReviewLater = useCallback(async () => {
    switch (serviceAgreement.hireType) {
      case HireType.PEO:
      case HireType.EOR:
        fireGtmEvent<GTM_EVENTS>({
          event: GTM_EVENTS.CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_LATER,
        });
        break;
      case HireType.POM:
        fireGtmEvent<GTM_EVENTS>({
          event: GTM_EVENTS.CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_LATER,
        });
        break;
      /* istanbul ignore next */
      // Scenario never exists
      default:
        break;
    }
    onClose();
  }, [serviceAgreement.hireType, onClose]);

  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogContent
        sx={{
          padding: '2rem',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Grid container maxWidth="lg" spacing={2}>
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                height: '65vh',
                padding: '2rem',
                overflow: 'auto',
              }}
            >
              <LegalDocument content={serviceAgreement.content} />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ConversationBox
              conversationId={serviceAgreement.conversationId}
              header={
                <>
                  <Typography variant="h6">
                    {t('employmentServices.conversation.title')}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t('employmentServices.conversation.description')}
                  </Typography>
                </>
              }
              contextId={serviceAgreement.serviceAgreementId}
              contextType={CONVERSATION_CONTEXT_TYPE_SERVICE_AGREEMENT}
              hireType={serviceAgreement.hireType}
              onCreate={onCreateConversation}
              onReply={onReplyConversation}
              onError={() => {
                setToast({
                  severity: 'error',
                  message: t(UNKNOWN_ERROR_MESSAGE),
                });
              }}
              conversationSx={{
                maxHeight: '65vh',
                [theme.breakpoints.up('lg')]: {
                  height: '65vh',
                },
              }}
              backendResource={BackendResource.GP_PEOPLE}
            />
          </Grid>
          <Formik
            innerRef={formRef}
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            <Form>
              <Grid
                item
                xs={12}
                container
                sx={{
                  display: 'flex',
                  padding: '1rem',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={2} lg={0.5}>
                  <Checkbox
                    required
                    name="isSigned"
                    dataTestId="companyPeopleOnboardingCreate-employment-services-agreement-field-isSigned"
                  />
                </Grid>
                <Grid item xs={10} lg={11.5}>
                  <Typography variant="subtitle1">
                    {t('employmentServices.form.isSigned.label', {
                      name: `${session?.user.firstName} ${session?.user.lastName}`,
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Grid>
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
            onClick={onClickedReviewLater}
            sx={{
              paddingX: '3rem',
            }}
            data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-review-later"
          >
            {t('employmentServices.form.reviewLater')}
          </Button>
          <Button
            variant="contained"
            sx={{
              paddingX: '3rem',
            }}
            onClick={() => formRef.current?.handleSubmit()}
            data-testid="companyPeopleOnboardingCreate-employment-services-agreement-button-acknowledge"
          >
            {t('employmentServices.form.acknowledge')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

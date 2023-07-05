import { NextPage } from '@ayp/typings/commons';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import type { GetServerSideProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppLayout, Loading } from '@components/commons';
import {
  getServiceAgreementOptions,
  StaffContractsServiceAgreementFormValues,
  validationSchema,
} from '@components/pages/staff/contracts/service-agreement/config';
import { Autocomplete, ButtonSubmit, TextEditor, Toast } from '@components/ui';
import { AgreementTemplateApi } from '@services/apis/people';

type ServiceAgreementOptionType = Nullable<Option<string>>;

const SelectServiceAgreementModal: FC<{
  t: TFunction;
  currentSelectedServiceAgreement: ServiceAgreementOptionType;
  setCurrentSelectedServiceAgreement: Dispatch<
    SetStateAction<ServiceAgreementOptionType>
  >;
  serviceAgreementOptions: Option[];
  onClose: () => void;
}> = ({
  t,
  currentSelectedServiceAgreement,
  setCurrentSelectedServiceAgreement,
  serviceAgreementOptions,
  onClose,
}) => {
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
          {t('selectServiceAgreement.title')}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {t('selectServiceAgreement.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            serviceAgreement: currentSelectedServiceAgreement,
          }}
          onSubmit={(values: {
            serviceAgreement: ServiceAgreementOptionType;
          }) => {
            setCurrentSelectedServiceAgreement(values.serviceAgreement);
            onClose();
          }}
        >
          <Form>
            <Autocomplete
              required
              name="serviceAgreement"
              options={serviceAgreementOptions}
              label={t('selectServiceAgreement.form.serviceAgreement.label')}
              helperText={t(
                'selectServiceAgreement.form.serviceAgreement.helperText'
              )}
              dataTestId="staffContractsServiceAgreement-sectionNameSelectField"
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
                data-testid="staffContractsServiceAgreement-selectServiceAgreement-closeButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffContractsServiceAgreement-selectServiceAgreement-submitButton"
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

const StaffContractsServiceAgreement: NextPage = ({ session, isDesktop }) => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>({});
  const { t } = useTranslation('staff-contracts-service-agreement');

  const [autoFillTags, setAutoFillTags] = useState<string[]>([]);
  const [showSelectServiceAgreement, setShowSelectServiceAgreement] =
    useState(false);
  const [currentSelectedServiceAgreement, setCurrentSelectedServiceAgreement] =
    useState<ServiceAgreementOptionType>(null);

  const [initialValues, setInitialValues] =
    useState<StaffContractsServiceAgreementFormValues>({
      content: '',
    });

  useEffect(() => {
    const fetch = async () => {
      try {
        if (currentSelectedServiceAgreement?.id) {
          setLoading(true);
          const { agreementTemplate, autoFillTags } =
            await AgreementTemplateApi.get(
              session,
              currentSelectedServiceAgreement?.id
            );
          setAutoFillTags(autoFillTags);
          setInitialValues({
            content: agreementTemplate.content,
          });
        } else {
          setInitialValues({
            content: '',
          });
        }
      } catch {
        setInitialValues({
          content: '',
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentSelectedServiceAgreement, session]);

  const SelectServiceAgreementType = useMemo(
    () =>
      showSelectServiceAgreement && (
        <SelectServiceAgreementModal
          t={t}
          setCurrentSelectedServiceAgreement={
            setCurrentSelectedServiceAgreement
          }
          currentSelectedServiceAgreement={currentSelectedServiceAgreement}
          serviceAgreementOptions={getServiceAgreementOptions(t)}
          onClose={() => setShowSelectServiceAgreement(false)}
        />
      ),
    [showSelectServiceAgreement, t, currentSelectedServiceAgreement]
  );

  const form = useMemo(() => {
    const onSubmit = async (
      values: StaffContractsServiceAgreementFormValues
    ) => {
      try {
        if (currentSelectedServiceAgreement) {
          await AgreementTemplateApi.update(session, {
            agreementTemplateId: currentSelectedServiceAgreement.id,
            content: values.content,
          });
          setToast({
            severity: 'success',
            message: t('success'),
          });
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
      <Formik
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        <Form noValidate>
          <TextEditor
            name="content"
            autoFillTags={autoFillTags}
            init={{
              height: '60vh',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              marginY: '1.5rem',
              justifyContent: 'center',
            }}
          >
            <ButtonSubmit
              variant="contained"
              sx={{
                paddingX: '3rem',
              }}
              data-testid="staffContractsServiceAgreement-submitButton"
            >
              {t('common:submit')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    );
  }, [
    initialValues,
    autoFillTags,
    t,
    session,
    currentSelectedServiceAgreement,
  ]);

  return (
    <AppLayout
      isDesktop={isDesktop}
      pageName={t('pageName')}
      sx={{
        flexDirection: 'column',
      }}
    >
      {SelectServiceAgreementType}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffContractsServiceAgreement-toast"
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Box>
          {`${t('serviceAgreementSelected')}: `}
          <b>{currentSelectedServiceAgreement?.label}</b>
        </Box>
        <IconButton
          onClick={() => setShowSelectServiceAgreement(true)}
          data-testid="staffContractsServiceAgreement-selectionButton"
        >
          <Edit fontSize="small" color="primary" />
        </IconButton>
      </Box>
      {loading ? <Loading /> : form}
    </AppLayout>
  );
};

export default StaffContractsServiceAgreement;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'service-agreement',
      'staff-contracts-service-agreement',
    ])),
  },
});

import { CountryOption, Option } from '@ayp/typings/ui';
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
import { EmailTemplates, NextPage, UserSession } from '@ayp/typings/commons';
import { Form, Formik } from 'formik';
import { sortBy } from 'lodash-es';
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
import memoizee from 'memoizee';

import { AppLayout, Loading } from '@components/commons';
import {
  StaffEmailTemplatesFormValues,
  validationSchema,
} from '@components/pages/staff/email-templates/config';
import {
  ButtonSubmit,
  TextEditor,
  Toast,
  Autocomplete,
  TextField,
} from '@components/ui';
import { EmailTemplateApi, CountryApi } from '@services/apis/people';
import { HIRING_COUNTRIES } from '@configs/constants';
import { useCallback } from 'react';

const getHiringCountriesMemo = memoizee(
  async (): Promise<CountryOption[]> => {
    const { countries } = await CountryApi.getCountries();

    return countries
      .filter((country) => HIRING_COUNTRIES.includes(country.code))
      .map((country) => ({
        id: country.id,
        code: country.code,
        label: country.name,
      }));
  },
  { promise: true }
);

const SelectTemplate: FC<{
  t: TFunction;
  session: UserSession;
  templateName: Nullable<Option<EmailTemplates>>;
  setTemplateName: Dispatch<SetStateAction<Nullable<Option<EmailTemplates>>>>;
  setShowSelectTemplate: Dispatch<SetStateAction<boolean>>;
}> = ({ t, templateName, setTemplateName, setShowSelectTemplate }) => {
  const [templateNames, setTemplateNames] = useState<Option[]>([]);

  const getExistTemplate = useMemo(
    () =>
      (t: TFunction): Option[] => {
        const emailTemplates = Object.values(EmailTemplates);

        return emailTemplates.map((emailTemplate) => ({
          id: emailTemplate,
          label: t(`templateNames.${emailTemplate}`),
        }));
      },
    []
  );

  useEffect(() => {
    const templateName = getExistTemplate(t);
    setTemplateNames(sortBy(templateName, ['label']));
  }, [t, getExistTemplate]);

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
        <Typography variant="h6">{t('selectTemplate.title')}</Typography>
        <Typography variant="subtitle1" align="center">
          {t('selectTemplate.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            templateName,
          }}
          onSubmit={(values: {
            templateName: Nullable<Option<EmailTemplates>>;
          }) => {
            setTemplateName(values.templateName);
            setShowSelectTemplate(false);
          }}
        >
          <Form>
            <Autocomplete
              required
              name="templateName"
              options={templateNames}
              label={t('selectTemplate.form.template.label')}
              helperText={t('selectTemplate.form.template.helperText')}
              dataTestId="staffEmailTemplates-sectionNameSelectField"
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
                onClick={() => setShowSelectTemplate(false)}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffEmailTemplates-selectTemplates-closeButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffEmailTemplates-selectTemplates-submitButton"
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

const StaffEmailTemplates: NextPage = ({ session, isDesktop }) => {
  const { t } = useTranslation('staff-email-templates');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>({});
  const [templateName, setTemplateName] =
    useState<Nullable<Option<EmailTemplates>>>(null);
  const [showSelectTemplate, setShowSelectTemplate] = useState(false);
  const [initialValues, setInitialValues] =
    useState<StaffEmailTemplatesFormValues>({
      templateName: null,
      subjectPart: '',
      htmlPart: '',
      autoFillTags: [],
    });

  const [countries, setCountries] = useState<CountryOption[]>([]);

  const isStaffAddendumManualRequest = useMemo(
    () =>
      templateName &&
      [EmailTemplates.STAFF_ADDENDUM_MANUAL_REQUEST].includes(templateName.id),
    [templateName]
  );

  useEffect(() => {
    (async () => {
      try {
        if (isStaffAddendumManualRequest) {
          const data = await getHiringCountriesMemo();
          setCountries(data);
        }
      } catch {}
    })();
  }, [isStaffAddendumManualRequest]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (templateName) {
          if (isStaffAddendumManualRequest) {
            setInitialValues({
              templateName: null,
              country: null,
              subjectPart: '',
              htmlPart: '',
              cc: [],
              autoFillTags: [],
            });
          } else {
            setLoading(true);
            const data = await EmailTemplateApi.getTemplate(
              session,
              templateName.id
            );
            setInitialValues({
              ...data,
              cc: data.cc?.map((cc) => ({
                id: cc,
                label: cc,
              })),
            });
          }
        }
      } catch {
        setInitialValues({
          templateName: null,
          subjectPart: '',
          htmlPart: '',
          autoFillTags: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [session, templateName, isStaffAddendumManualRequest]);

  const onHandleChangeCountry = useCallback(
    async (value: CountryOption) => {
      try {
        /* istanbul ignore next */
        // this case doesn't necessary to test
        if (!templateName) return;

        const data = await EmailTemplateApi.getTemplate(
          session,
          `${templateName.id}-${value.code.toLowerCase()}`
        );
        setInitialValues({
          ...data,
          country: value,
          cc: data.cc?.map((cc) => ({
            id: cc,
            label: cc,
          })),
        });
      } catch (e) {
        setInitialValues({
          templateName: null,
          country: null,
          subjectPart: '',
          htmlPart: '',
          cc: [],
          autoFillTags: [],
        });
      } finally {
        setLoading(false);
      }
    },
    [session, templateName]
  );

  const selectTemplate = useMemo(
    () =>
      showSelectTemplate && (
        <SelectTemplate
          t={t}
          session={session}
          templateName={templateName}
          setTemplateName={setTemplateName}
          setShowSelectTemplate={setShowSelectTemplate}
        />
      ),
    [t, session, templateName, showSelectTemplate]
  );

  const form = useMemo(() => {
    const onSubmit = async (values: StaffEmailTemplatesFormValues) => {
      try {
        if (templateName) {
          await EmailTemplateApi.update(
            session,
            isStaffAddendumManualRequest
              ? `${templateName.id}-${values?.country?.code.toLowerCase()}`
              : templateName.id,
            values.subjectPart,
            values.htmlPart,
            values.isCcEnabled ? values.cc?.map((cc) => cc.id) : undefined
          );

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
        validationSchema={() => validationSchema(templateName?.id as string)}
      >
        <Form noValidate>
          {isStaffAddendumManualRequest && (
            <>
              <Typography
                sx={{
                  margin: '0.5rem 0',
                }}
              >
                {t('country.title')}
              </Typography>
              <Autocomplete
                required
                name="country"
                options={countries}
                variant="country"
                helperText={t('country.helperText')}
                onSelectedOption={(value: Option) =>
                  onHandleChangeCountry(value as CountryOption)
                }
                sx={{
                  margin: '0.5rem 0',
                }}
                dataTestId="staffEmailTemplates-country"
              />
            </>
          )}
          <Typography
            sx={{
              margin: '0.5rem 0',
            }}
          >
            {t('subjectPart.title')}
          </Typography>
          <TextField
            required
            name="subjectPart"
            dataTestId="staffEmailTemplates-textField-subjectPart"
          />

          {initialValues.isCcEnabled && (
            <>
              <Typography
                sx={{
                  margin: '0.5rem 0',
                }}
              >
                {t('cc.title')}
              </Typography>
              <Autocomplete
                isMultipleOption
                freeSolo
                name="cc"
                options={[]}
                sx={{
                  margin: '0.5rem 0',
                }}
                dataTestId="staffEmailTemplates-email-cc"
              />
            </>
          )}
          <Typography
            sx={{
              margin: '0.5rem 0',
            }}
          >
            {t('htmlPart.title')}
          </Typography>
          <TextEditor
            helperText={t('htmlPart.helperText')}
            name="htmlPart"
            init={{
              height: '60vh',
            }}
            autoFillTags={initialValues.autoFillTags}
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
              data-testid="staffEmailTemplates-submitButton"
            >
              {t('common:submit')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    );
  }, [
    initialValues,
    t,
    templateName,
    session,
    countries,
    isStaffAddendumManualRequest,
    onHandleChangeCountry,
  ]);

  return (
    <AppLayout
      isDesktop={isDesktop}
      pageName={t('pageName')}
      sx={{
        flexDirection: 'column',
      }}
    >
      {selectTemplate}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffEmailTemplates-toast"
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
          {`${t('templateSelected')}: `}
          <b>{templateName?.label}</b>
        </Box>
        <IconButton
          onClick={() => setShowSelectTemplate(true)}
          data-testid="staffEmailTemplates-selectionButton"
        >
          <Edit fontSize="small" color="primary" />
        </IconButton>
      </Box>
      {loading ? <Loading /> : form}
    </AppLayout>
  );
};

export default StaffEmailTemplates;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'staff-email-templates',
    ])),
  },
});

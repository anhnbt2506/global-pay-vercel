import { NextPage, UserSession } from '@ayp/typings/commons';
import { CountryOption } from '@ayp/typings/ui';
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
import memoizee from 'memoizee';
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
  StaffContractsEorAgreementFormValues,
  validationSchema,
} from '@components/pages/staff/contracts/eor-agreement/config';
import { Autocomplete, ButtonSubmit, TextEditor, Toast } from '@components/ui';
import {
  EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX,
  HIRING_COUNTRIES,
} from '@configs/constants';
import { AgreementTemplateApi, CountryApi } from '@services/apis/people';

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

const SelectCountry: FC<{
  t: TFunction;
  session: UserSession;
  country: CountryOption | null;
  setCountry: Dispatch<SetStateAction<CountryOption | null>>;
  setShowSelectCountry: Dispatch<SetStateAction<boolean>>;
}> = ({ t, session, country, setCountry, setShowSelectCountry }) => {
  const [countries, setCountries] = useState<CountryOption[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHiringCountriesMemo();
        setCountries(data);
      } catch {}
    };
    fetch();
  }, [session]);

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
        <Typography variant="h6">{t('selectCountry.title')}</Typography>
        <Typography variant="subtitle1" align="center">
          {t('selectCountry.description')}
        </Typography>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '2rem',
        }}
      >
        <Formik
          initialValues={{
            country,
          }}
          onSubmit={(values: { country: CountryOption | null }) => {
            setCountry(values.country);
            setShowSelectCountry(false);
          }}
        >
          <Form>
            <Autocomplete
              required
              name="country"
              options={countries}
              variant="country"
              label={t('selectCountry.form.country.label')}
              helperText={t('selectCountry.form.country.helperText')}
              dataTestId="staffContractsEorAgreement-sectionNameSelectField"
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
                onClick={() => setShowSelectCountry(false)}
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffContractsEorAgreement-selectCountry-closeButton"
              >
                {t('common:cancel')}
              </Button>
              <ButtonSubmit
                variant="contained"
                sx={{
                  paddingX: '3rem',
                }}
                data-testid="staffContractsEorAgreement-selectCountry-submitButton"
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

const StaffContractsEorAgreement: NextPage = ({ session, isDesktop }) => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>({});
  const { t } = useTranslation('staff-contracts-eor-agreement');

  const [autoFillTags, setAutoFillTags] = useState<string[]>([]);
  const [showSelectCountry, setShowSelectCountry] = useState(false);
  const [country, setCountry] = useState<CountryOption | null>(null);

  const [initialValues, setInitialValues] =
    useState<StaffContractsEorAgreementFormValues>({
      content: '',
    });

  useEffect(() => {
    const fetch = async () => {
      try {
        if (country) {
          setLoading(true);
          const { agreementTemplate, autoFillTags } =
            await AgreementTemplateApi.get(
              session,
              `${EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX}${country?.code.toLowerCase()}`
            );
          setAutoFillTags(autoFillTags);
          setInitialValues({
            content: agreementTemplate.content,
          });
        }
      } catch {
        /* istanbul ignore next */
        // this case doesn't necessary to test
        setInitialValues({
          content: '',
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [session, country]);

  const selectCountry = useMemo(
    () =>
      showSelectCountry && (
        <SelectCountry
          t={t}
          session={session}
          country={country}
          setCountry={setCountry}
          setShowSelectCountry={setShowSelectCountry}
        />
      ),
    [t, session, country, showSelectCountry]
  );

  const form = useMemo(() => {
    const onSubmit = async (values: StaffContractsEorAgreementFormValues) => {
      try {
        await AgreementTemplateApi.update(session, {
          agreementTemplateId: `${EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX}${country?.code.toLowerCase()}`,
          content: values.content,
        });
        setToast({
          severity: 'success',
          message: t('success'),
        });
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
            helperText={t('form.content.helperText')}
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
              data-testid="staffContractsEorAgreement-submitButton"
            >
              {t('common:submit')}
            </ButtonSubmit>
          </Box>
        </Form>
      </Formik>
    );
  }, [t, country, initialValues, session, autoFillTags]);

  return (
    <AppLayout
      isDesktop={isDesktop}
      pageName={t('pageName')}
      sx={{
        flexDirection: 'column',
      }}
    >
      {selectCountry}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffContractsEorAgreement-toast"
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
          {`${t('countrySelected')}: `}
          <b>{country?.label}</b>
        </Box>
        <IconButton
          data-testid="staffContractsEorAgreement-selectionButton"
          onClick={() => setShowSelectCountry(true)}
        >
          <Edit fontSize="small" color="primary" />
        </IconButton>
      </Box>
      {loading ? <Loading /> : form}
    </AppLayout>
  );
};

export default StaffContractsEorAgreement;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'staff-contracts-eor-agreement',
    ])),
  },
});

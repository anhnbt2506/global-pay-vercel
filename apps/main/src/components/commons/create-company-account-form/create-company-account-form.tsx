import { CountryOption, Option } from '@ayp/typings/ui';
import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { TFunction, Trans } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import memoizee from 'memoizee';

import { PasswordCriteria } from '@components/commons';
import { CreateCompanyAccountFormValues } from '@components/commons/create-company-account-form/config';
import { Autocomplete, Link, Select, TextField } from '@components/ui';
import {
  COMPANY_CATEGORY_OPTIONS,
  COMPANY_INTEREST_OPTIONS,
  COMPLIANCE_EXTERNAL_URLS,
} from '@configs/constants';
import { UserSession } from '@ayp/typings/commons';
import { IndustryApi } from '@services/apis/people';
import { useSessionCookies } from '@hooks/use-session-cookies';

interface CreateCompanyAccountFormProps {
  countries: CountryOption[];
  t: TFunction;
}

const getIndustryListMemo = memoizee(
  async (session: UserSession): Promise<Option[]> => {
    const { industries } = await IndustryApi.listSelection(session);

    return industries.map((industry) => ({
      id: industry.industryId,
      label: industry.name,
    }));
  },
  { promise: true }
);

const CREATE_COMPANY_ACCOUNT_FORM_PREFIX = 'create-company-account-form:';

const CreateCompanyAccountForm: FC<CreateCompanyAccountFormProps> = ({
  t,
  countries,
}) => {
  const { values } = useFormikContext<CreateCompanyAccountFormValues>();
  const [password] = useDebounce(values.password, 250);
  const { session } = useSessionCookies();
  const [industries, setIndustries] = useState<Option[]>([]);

  const passwordCriteria = useMemo(
    () => <PasswordCriteria t={t} password={password} />,
    [t, password]
  );

  const companyInterestOptions = useMemo(
    () =>
      COMPANY_INTEREST_OPTIONS.map((companyInterest) => ({
        ...companyInterest,
        label: t(companyInterest.label),
      })),
    [t]
  );

  const companyCategoryOptions = useMemo(
    () =>
      COMPANY_CATEGORY_OPTIONS.map((companyCategory) => ({
        ...companyCategory,
        label: t(companyCategory.label),
      })),
    [t]
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        if (values.hasIndustryField) {
          const industries = await getIndustryListMemo(session);
          setIndustries(industries);
        }
      } catch {}
    };
    fetch();
  }, [t, session, values.hasIndustryField]);

  return (
    <Grid container spacing={2} maxWidth="sm">
      <Grid item xs={12}>
        <TextField
          required
          name="firstName"
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.firstName.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.firstName.helperText`
          )}
          dataTestId="companySignUp-firstNameField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="lastName"
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.lastName.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.lastName.helperText`
          )}
          dataTestId="companySignUp-lastNameField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="companyName"
          label={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.companyName.label`
          )}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.companyName.helperText`
          )}
          dataTestId="companySignUp-companyNameField"
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          required
          name="country"
          variant="country"
          options={countries}
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.country.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.country.helperText`
          )}
          dataTestId="companySignUp-countryField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="jobTitle"
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.jobTitle.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.jobTitle.helperText`
          )}
          dataTestId="companySignUp-jobTitleField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="email"
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.email.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.email.helperText`
          )}
          dataTestId="companySignUp-emailField"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          name="password"
          type="password"
          withFieldVisibility
          autoComplete="password"
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.password.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.password.helperText`
          )}
          dataTestId="companySignUp-passwordField"
        />
      </Grid>
      {passwordCriteria}
      <Grid item xs={12}>
        <Select
          required
          name="interest"
          options={companyInterestOptions}
          label={t(`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.interest.label`)}
          helperText={t(
            `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.interest.helperText`
          )}
          dataTestId="companySignUp-interestField"
        />
      </Grid>
      {values.hasIndustryField && (
        <Grid item xs={12}>
          <Select
            required
            name="industry"
            options={industries}
            label={t(
              `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.industry.label`
            )}
            helperText={t(
              `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.industry.helperText`
            )}
            dataTestId="companySignUp-industryField"
          />
        </Grid>
      )}
      {values.hasCategoryField && (
        <Grid item xs={12}>
          <Select
            required
            name="category"
            options={companyCategoryOptions}
            label={t(
              `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.category.label`
            )}
            helperText={t(
              `${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}form.category.helperText`
            )}
            dataTestId="companySignUp-categoryField"
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          <Trans
            i18nKey={`${CREATE_COMPANY_ACCOUNT_FORM_PREFIX}complianceText`}
          >
            By creating an account, you agree to the&nbsp;
            <Link href={COMPLIANCE_EXTERNAL_URLS.tou} external newTab>
              Term Of Use
            </Link>
            ,&nbsp;
            <Link href={COMPLIANCE_EXTERNAL_URLS.privacy} external newTab>
              Privacy Policy
            </Link>
            &nbsp;and&nbsp;
            <Link href={COMPLIANCE_EXTERNAL_URLS.pdpa} external newTab>
              Personal Data Protection Agreement (PDPA)
            </Link>
          </Trans>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CreateCompanyAccountForm;

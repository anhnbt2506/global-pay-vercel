import { NextPage } from '@ayp/typings/commons';
import { Company } from '@ayp/typings/entities';
import { CountryOption, CurrencyOption } from '@ayp/typings/ui';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import {
  HireTypeQuery,
  ModeQuery,
} from '@components/pages/company/people/onboarding/create/guided-mode/peo/config';
import { RedirectionError } from '@configs/errors';
import { CompanyApi, CountryApi, CurrencyApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

const DynamicEmploymentServicesForm = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/employment-services'
    )
);

const DynamicGuidedModePeo = dynamic(
  () =>
    import('@components/pages/company/people/onboarding/create/guided-mode/peo')
);

const DynamicBulkUploadModePom = dynamic(
  () =>
    import(
      '@components/pages/company/people/onboarding/create/bulk-upload-mode/pom'
    )
);

interface CompanyPeopleOnboardingCreateProps {
  company: Company;
  countries: CountryOption[];
  currencies: CurrencyOption[];
}

const CompanyPeopleOnboardingCreate: NextPage<
  CompanyPeopleOnboardingCreateProps
> = ({ isDesktop, company, countries = [], currencies = [] }) => {
  const router = useRouter();
  const { hireType, mode } = router.query;

  const setFormMode = (formMode: Nullable<ModeQuery>) => {
    const { pathname } = router;

    switch (formMode) {
      case ModeQuery.GUIDED:
        router.push(
          {
            pathname,
            query: {
              hireType: HireTypeQuery.EOR,
              mode: ModeQuery.GUIDED,
              step: 0,
            },
          },
          undefined,
          { shallow: true }
        );
        break;
      case ModeQuery.BULK_UPLOAD:
        router.push(
          {
            pathname,
            query: {
              hireType: HireTypeQuery.POM,
              mode: ModeQuery.BULK_UPLOAD,
            },
          },
          undefined,
          { shallow: true }
        );
        break;
      default:
        router.push(pathname, undefined, { shallow: true });
    }
  };

  const renderComponent = () => {
    if (hireType === HireTypeQuery.EOR && ModeQuery.GUIDED) {
      return (
        <DynamicGuidedModePeo
          company={company}
          isDesktop={isDesktop}
          countries={countries}
          currencies={currencies}
          setFormMode={setFormMode}
        />
      );
    } else if (
      hireType === HireTypeQuery.POM &&
      mode === ModeQuery.BULK_UPLOAD
    ) {
      return (
        <DynamicBulkUploadModePom countries={countries} isDesktop={isDesktop} />
      );
    }

    return (
      <DynamicEmploymentServicesForm
        isDesktop={isDesktop}
        setFormMode={setFormMode}
      />
    );
  };

  return renderComponent();
};

export default CompanyPeopleOnboardingCreate;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSideSession(context);
    const [{ company }, { countries }, { currencies }] = await Promise.all([
      CompanyApi.get(session),
      CountryApi.getCountries(),
      CurrencyApi.getCurrencies(session),
    ]);

    return {
      props: {
        company,
        countries: countries.map((country) => ({
          id: country.id,
          code: country.code,
          label: country.name,
        })),
        currencies: currencies.map((currency) => ({
          id: currency.id,
          code: currency.code,
          label: currency.name,
        })),
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'comment-type',
          'common',
          'hire-type',
          'conversation',
          'calendar-unit',
          'contract-type',
          'employment-type',
          'country-constant',
          'citizenship-status',
          'company-pom',
          'company-pom-hk-form',
          'company-pom-my-form',
          'company-pom-sg-form',
          'company-pom-hk-mpf-provider',
          'company-pom-id-form',
          'company-pom-id-contribution-for-bpjs-on-salary',
          'company-pom-sg-form',
          'company-pom-sg-cpf-payment-mode',
          'company-pom-sg-cpf-submission-platform',
          'company-pom-sg-e-submission-service',
          'company-pom-th-form',
          'company-pom-vn-form',
          'company-people-onboarding-create-peo-eor-service-details',
          'company-people-onboarding-create',
          'company-people-onboarding-create-bulk-upload-mode',
          'company-pom-vn-shui-provider',
          'company-pom-ph-form',
          'company-pom-ph-statutory-deductions',
          'company-department',
          'payroll-cycle',
          'prorate-salary-formula',
          'workplace-address-type',
          'religion',
          'race',
          'reference-documents',
          'emergency-contact-relationship',
          'permit-type',
          'gender',
          'marital-status',
          'hire-status',
          'insurance',
          'file-upload-status',
          'worker-payment-option',
          'worker-payment-schedule',
          'worker-contract-term',
          'worker-schedule',
          'worker-contract-type',
          'worker-has-signed-agreement',
          'worker-tax-status',
          'workplace-address-type',
          'worker-cpf-contribution-type',
          'worker-managerial-type',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {},
    };
  }
};

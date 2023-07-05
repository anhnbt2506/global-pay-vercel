import { NextPage } from '@ayp/typings/commons';
import type { GetServerSideProps } from 'next';

import { LegalDocument } from '@components/commons';
import { COMPANY_DASHBOARD } from '@configs/routes';
import { AgreementApi } from '@services/apis/people';
import { RedirectionError } from '@configs/errors';
import { getServerSideSession } from '@utils';

interface CompanyAgreementProps {
  content: string;
}

const CompanyAgreement: NextPage<CompanyAgreementProps> = ({ content }) => (
  <LegalDocument print content={content} />
);

export default CompanyAgreement;

export const getServerSideProps: GetServerSideProps<
  CompanyAgreementProps
> = async (context) => {
  try {
    const { agreementId } = context.query;
    const session = await getServerSideSession(context);

    if (typeof agreementId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: COMPANY_DASHBOARD.path,
        },
      };

    const { agreement } = await AgreementApi.get(session, agreementId);

    return {
      props: {
        content: agreement.content,
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      redirect: {
        permanent: false,
        destination: COMPANY_DASHBOARD.path,
      },
    };
  }
};

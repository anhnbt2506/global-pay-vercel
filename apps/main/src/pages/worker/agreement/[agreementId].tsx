import { NextPage } from '@ayp/typings/commons';
import type { GetServerSideProps } from 'next';

import { LegalDocument } from '@components/commons';
import { RedirectionError } from '@configs/errors';
import { WORKER_HOME } from '@configs/routes';
import { AgreementApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

interface WorkerAgreementProps {
  content: string;
}

const WorkerAgreement: NextPage<WorkerAgreementProps> = ({ content }) => (
  <LegalDocument print content={content} />
);

export default WorkerAgreement;

export const getServerSideProps: GetServerSideProps<
  WorkerAgreementProps
> = async (context) => {
  try {
    const { agreementId } = context.query;
    const session = await getServerSideSession(context);

    if (typeof agreementId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: WORKER_HOME.path,
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
        destination: WORKER_HOME.path,
      },
    };
  }
};

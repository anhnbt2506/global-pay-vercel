import { NextPage } from '@ayp/typings/commons';
import { GetServerSideProps } from 'next';

import { LegalDocument } from '@components/commons';
import { RedirectionError } from '@configs/errors';
import { STAFF_HOME } from '@configs/routes';
import { AgreementApi, WorkerEmploymentApi } from '@services/apis/people';
import { getServerSideSession } from '@utils';

interface StaffAuditClientHiresEmploymentIdDownloadProps {
  content: string;
}

const StaffAuditClientHiresEmploymentIdDownload: NextPage<
  StaffAuditClientHiresEmploymentIdDownloadProps
> = ({ content }) => <LegalDocument print content={content} />;

export default StaffAuditClientHiresEmploymentIdDownload;

export const getServerSideProps: GetServerSideProps<
  StaffAuditClientHiresEmploymentIdDownloadProps
> = async (context) => {
  try {
    const { employmentId } = context.query;

    if (typeof employmentId !== 'string')
      return {
        redirect: {
          permanent: false,
          destination: STAFF_HOME.path,
        },
      };

    const session = await getServerSideSession(context);

    const { workerEmployment } = await WorkerEmploymentApi.getByEmploymentId(
      session,
      {
        attributes: [
          'id',
          'hireType',
          'title',
          'startDate',
          'endDate',
          'agreement',
        ],
      },
      employmentId
    );

    const { agreement } = await AgreementApi.get(
      session,
      workerEmployment.agreement.agreementId
    );

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
        destination: STAFF_HOME.path,
      },
    };
  }
};

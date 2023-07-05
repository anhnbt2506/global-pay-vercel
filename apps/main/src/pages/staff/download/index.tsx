import { NextPage } from '@ayp/typings/commons';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { S3DownloadPage } from '@components/commons';
import { STAFF_HOME } from '@configs/routes';

const StaffDownload: NextPage = ({ session }) => {
  const router = useRouter();
  const { filePath } = router.query;

  useEffect(() => {
    if (typeof filePath !== 'string') {
      router.push({
        pathname: STAFF_HOME.path,
      });
    }
  }, [router, filePath]);

  return (
    <>
      {filePath && typeof filePath === 'string' && (
        <S3DownloadPage
          session={session}
          filePath={filePath}
          redirectPath={STAFF_HOME.path}
        />
      )}
    </>
  );
};

export default StaffDownload;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['s3-download-page'])),
  },
});

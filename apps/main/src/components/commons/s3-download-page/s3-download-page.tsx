import { ErrorCode, UserSession } from '@ayp/typings/commons';
import { isErrorResponse } from '@ayp/utils';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import type { UrlObject } from 'url';

import { FileManagementApi } from '@services/apis/people';
import { S3Api } from '@services/s3';

import { Loading } from '../loading';

export const S3DownloadPage: FC<{
  session: UserSession;
  filePath: string;
  redirectPath: string;
}> = ({ session, filePath, redirectPath }) => {
  const router = useRouter();
  const { t } = useTranslation('s3-download-page');

  const onDownload = useCallback(async () => {
    const urlObj: UrlObject = { pathname: redirectPath };

    try {
      const { presignedUrl, key } = await FileManagementApi.get(
        session,
        filePath
      );
      await S3Api.download(presignedUrl, key);

      Object.assign(urlObj, {
        query: {
          message: t('toastMessage.downloadInProgress'),
          code: 200,
        },
      });
    } catch (e) {
      if (isErrorResponse(e)) {
        switch (e.error.code) {
          case ErrorCode.NOT_FOUND:
            Object.assign(urlObj, {
              query: {
                message: t('toastMessage.fileExpired'),
                code: ErrorCode.NOT_FOUND,
              },
            });
            break;
          case ErrorCode.FORBIDDEN:
            Object.assign(urlObj, {
              query: {
                message: t('toastMessage.unauthorized'),
                code: ErrorCode.FORBIDDEN,
              },
            });
            break;
        }
      }
    }

    router.push(urlObj, !!urlObj.pathname ? redirectPath : undefined);
  }, [t, filePath, session, router, redirectPath]);

  useEffect(() => {
    (async () => {
      onDownload();
    })();
  }, [onDownload]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loading />
    </Box>
  );
};

export default S3DownloadPage;

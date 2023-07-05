import { SortBy, SortByOperator } from '@ayp/typings/commons';
import { FileManagementSortBy } from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';
import { LinearProgress } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';

import { Toast } from '@components/ui';
import { DOCUMENTS_FOLDER_DEFAULT } from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { STAFF_AUDIT_CLIENT_HIRES } from '@configs/routes';
import { useSessionCookies } from '@hooks';
import { FileManagementApi } from '@services/apis/people';
import { S3Api } from '@services/s3';

import BreadCrumbs from './breadcumb';
import {
  ADDENDUM_FOLDER,
  FileManagementTableData,
  QUERY_PARAM_FOLDER,
  mapDataForTable,
} from './configs';
import FileManagementTable from './table';

interface FileManagementProps {
  tPrefix: string;
  filePrefix: string; //e.g company/companyId/
  translationPrefix?: string;
  fetchAddendumFiles?: VoidFunction;
}

export const FileManagement: FC<FileManagementProps> = ({
  tPrefix,
  filePrefix,
  translationPrefix,
  fetchAddendumFiles,
}) => {
  const { t, i18n } = useTranslation(tPrefix);
  const { session } = useSessionCookies();
  const [toast, setToast] = useState<Toast>({});
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FileManagementTableData>(
    mapDataForTable(null, filePrefix, translationPrefix ?? null)
  );

  const { folder } = router.query;
  const [currentFolderKey, setCurrentFolderKey] = useState<string>(
    typeof folder === 'string' ? folder : DOCUMENTS_FOLDER_DEFAULT
  );

  const handleFetchData = useCallback(
    async (path: string, sortBy?: SortBy<FileManagementSortBy>) => {
      try {
        setLoading(true);
        const isFetchAddendumFiles = path.endsWith(ADDENDUM_FOLDER);
        const response = isFetchAddendumFiles
          ? fetchAddendumFiles
            ? await fetchAddendumFiles?.()
            : []
          : await FileManagementApi.getList(
              session,
              `${filePrefix}${path}&sortBy=${sortBy ?? SortByOperator.DESC}`
            );

        if (
          !response?.length &&
          path !== DOCUMENTS_FOLDER_DEFAULT &&
          (!isFetchAddendumFiles ||
            !router.pathname?.includes(STAFF_AUDIT_CLIENT_HIRES.path))
        ) {
          setCurrentFolderKey(DOCUMENTS_FOLDER_DEFAULT);
        } else {
          setData(
            mapDataForTable(
              response ?? [],
              filePrefix,
              translationPrefix ?? null
            )
          );
        }
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [
      fetchAddendumFiles,
      session,
      filePrefix,
      router.pathname,
      translationPrefix,
      t,
    ]
  );

  const handleFileManagementGet = useCallback(
    async (key: string, downloadedFileName: string) => {
      try {
        const response = await FileManagementApi.get(session, key);
        await S3Api.download(response.presignedUrl, downloadedFileName);
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    },
    [session, t]
  );

  useEffect(() => {
    (async () => {
      handleFetchData(currentFolderKey);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderKey]);

  useEffect(() => {
    if (folder === currentFolderKey) {
      return;
    }

    let path = window.location.pathname;
    let queryString = `tab=documents`;
    const urlParams = new URLSearchParams(window.location.search);

    for (const [key, value] of Object.entries(urlParams)) {
      if (typeof value != 'string') break;

      if (path.includes(`[${key}]`)) {
        path = path.replace(`[${key}]`, value);

        continue;
      }

      if (!['tab', QUERY_PARAM_FOLDER].includes(key)) {
        queryString = `${queryString}&${key}=${value}`;
      }
    }

    path = `${path}?${queryString}&${QUERY_PARAM_FOLDER}=${currentFolderKey}`;
    const data = {
      ...window.history.state,
      url: path,
      as: path,
    };

    window.history.pushState(data, '', path);
  }, [currentFolderKey, folder]);

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="fileManagement-toast"
      >
        {toast.message}
      </Toast>
      <BreadCrumbs
        currentFolderKey={currentFolderKey}
        handleFetchData={handleFetchData}
        setCurrentFolderKey={setCurrentFolderKey}
        t={t}
        i18n={i18n}
        tPrefix={tPrefix}
        dataTestId="fileManagement-breadCrumbs"
      />
      {loading && (
        <LinearProgress
          sx={{
            height: 2,
            marginY: '1rem',
            color: (theme) => theme.palette.primary.main,
          }}
        />
      )}
      {!loading && (
        <LinearProgress
          color="inherit"
          value={0}
          variant="determinate"
          sx={{ height: 2, marginY: '1rem' }}
        />
      )}

      <FileManagementTable
        t={t}
        data={data}
        handleFetchData={handleFetchData}
        setCurrentFolderKey={setCurrentFolderKey}
        filePrefix={filePrefix}
        i18n={i18n}
        tPrefix={tPrefix}
        setToast={setToast}
        currentFolderKey={currentFolderKey}
        handleFileManagementGet={handleFileManagementGet}
      />
    </>
  );
};

import { SortBy } from '@ayp/typings/commons';
import { FileManagementSortBy } from '@ayp/typings/entities';
import { Box, Grid, MenuItem, Typography } from '@mui/material';
import { I18n, TFunction } from 'next-i18next';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AnchorMenu, DataGrid, Toast } from '@components/ui';
import { KeyboardArrowDown } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';

import {
  ADDENDUM_FOLDER,
  FileManagementObjectType,
  FileManagementTableData,
} from '../configs';
import File from './file';
import Folder from './folder';
import ReUploadModal from './re-upload-modal';

interface FileTableProps {
  data: FileManagementTableData;
  filePrefix: string;
  currentFolderKey: string;
  t: TFunction;
  i18n: I18n;
  tPrefix: string;
  handleFetchData: (
    path: string,
    sortBy?: SortBy<FileManagementSortBy>
  ) => Promise<void>;
  setCurrentFolderKey: Dispatch<SetStateAction<string>>;
  setToast: Dispatch<SetStateAction<Toast>>;
  handleFileManagementGet: (
    key: string,
    downloadedFileName: string
  ) => Promise<void>;
}

const FileTable: FC<FileTableProps> = ({
  data,
  filePrefix,
  currentFolderKey,
  setToast,
  t,
  i18n,
  tPrefix,
  handleFetchData,
  setCurrentFolderKey,
  handleFileManagementGet,
}) => {
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [path, setPath] = useState<Nullable<string>>(null);
  const [label, setLabel] = useState<Nullable<string>>(null);
  const [showReUploadModal, setShowReUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] =
    useState<SortBy<FileManagementSortBy>>('lastModified,desc');

  const onHandleClick =
    (path: string, label: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setPath(path);
      setLabel(label);
    };

  const fetchDataAfterReUpload = async () => {
    handleFetchData(currentFolderKey, sortBy);
  };

  const getFileLabel = useCallback(
    (labelKey: string, name: string) => {
      const formula = `${tPrefix}:${labelKey}.label`;
      if (i18n.exists(formula)) {
        return t(formula);
      }

      return name;
    },
    [tPrefix, i18n, t]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'labelKey',
        headerName: t('file-management:name'),
        sortable: false,
        filterable: false,
        flex: 3,
        renderCell: ({ row }) => {
          return (
            <Box>
              {row.type === FileManagementObjectType.FILE ? (
                <File label={getFileLabel(row.labelKey, row.name)} />
              ) : (
                <Folder
                  label={t(`${row.labelKey}.label`)}
                  currentKey={row.key}
                  dataTestId="fileManagement-table-row-folder"
                />
              )}
            </Box>
          );
        },
      },
      {
        field: 'lastModified',
        headerName: t('file-management:lastModified'),
        sortable: true,
        filterable: false,
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box>
              <Typography>{row.lastModified}</Typography>
            </Box>
          );
        },
      },
      {
        field: 'lastModifiedBy.lastUpdatedBy',
        headerName: t('file-management:lastUpdatedBy'),
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box>
              <Typography>{row.lastModifiedBy ?? '-'}</Typography>
            </Box>
          );
        },
      },
      {
        field: 'action',
        headerName: '',
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box>
              {row.type === FileManagementObjectType.FILE && (
                <Box
                  sx={{ height: 'fit-content', ml: '0.5rem' }}
                  onClick={onHandleClick(
                    row.key,
                    getFileLabel(row.labelKey, row.name)
                  )}
                  data-testid="fileManagement-table-itemOptions"
                >
                  <KeyboardArrowDown fontSize="small" fill="black" />
                </Box>
              )}
            </Box>
          );
        },
      },
    ],
    [getFileLabel, t]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      await handleFetchData(currentFolderKey, sortBy);
      setLoading(false);
    })();
  }, [currentFolderKey, handleFetchData, sortBy]);

  return (
    <>
      <AnchorMenu
        open={!!anchorEl}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        paperPropsSx={{ ml: '0.6rem', mt: '0rem' }}
      >
        {!path?.includes(ADDENDUM_FOLDER) && (
          <MenuItem
            key="reUpload"
            onClick={() => setShowReUploadModal(true)}
            data-testid="fileManagement-table-reUpload"
          >
            <Typography>
              {t('file-management:anchorElMenuItem.reUpload')}
            </Typography>
          </MenuItem>
        )}
        {!!path && !!label && (
          <MenuItem
            key="download"
            onClick={() =>
              handleFileManagementGet(`${filePrefix}${path}`, label)
            }
            data-testid="fileManagement-table-download"
          >
            <Typography>
              {t('file-management:anchorElMenuItem.download')}
            </Typography>{' '}
          </MenuItem>
        )}
      </AnchorMenu>
      <Grid container sx={{ marginTop: '1rem' }}>
        {showReUploadModal && path && (
          <ReUploadModal
            keyName={`${filePrefix}${path}`}
            t={t}
            setShowReUploadModal={setShowReUploadModal}
            setToast={setToast}
            fetchDataAfterReUpload={fetchDataAfterReUpload}
          />
        )}
      </Grid>
      <Grid
        container
        sx={{
          display: 'flex',
          minHeight: '65vh',
        }}
      >
        <DataGrid<[], SortBy<FileManagementSortBy>>
          rows={data}
          columns={columns}
          loading={loading}
          setSortBy={setSortBy}
          components={{
            NoRowsOverlay: () => <></>,
          }}
          onCellClick={(params) => {
            /* istanbul ignore next */
            // this case doesn't necessary to test
            if (
              params.field !== 'labelKey' ||
              params.row.type !== FileManagementObjectType.FOLDER
            )
              return;

            handleFetchData(params.row.key, sortBy);
            setCurrentFolderKey(params.row.key);
          }}
          sortingMode="server"
          getRowId={(row) => row.key + row.labelKey}
          hideFooterPagination
          hideFooter
        />
      </Grid>
    </>
  );
};

export default FileTable;

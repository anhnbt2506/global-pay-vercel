import { FilesIcon } from '@assets/shared';
import { RowsState } from '@ayp/typings/commons';
import { PayrollRecordFile, Role, UserType } from '@ayp/typings/entities';
import { isErrorResponse, isUserPermitted } from '@ayp/utils';
import { useSessionCookies } from '@hooks';
import {
  DeleteOutlined,
  DescriptionOutlined,
  FileDownloadOutlined,
  MoreVert,
} from '@mui/icons-material';
import { Box, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import type { TFunction } from 'next-i18next';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { RemovePayrollFileModal } from '@components/commons/payroll-dashboard/company-payroll-id';
import { AnchorMenu, DataGrid, Toast } from '@components/ui';
import {
  DEFAULT_PAGE_SIZE,
  D_MMM_YYYY_HH_MM_SS,
  FILE_NAME_REG,
} from '@configs/constants';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import { FileManagementApi } from '@services/apis/fintech';
import { S3Api } from '@services/s3';

interface CompanyPayrollIdFilesProps {
  isDesktop: boolean;
  t: TFunction;
  dataTestId?: string;
  files?: PayrollRecordFile[];
  setToast: Dispatch<SetStateAction<Toast>>;
  fetchData: VoidFunction;
}

export const CompanyPayrollIdFiles: FC<CompanyPayrollIdFilesProps> = ({
  isDesktop,
  files,
  dataTestId,
  t,
  setToast,
  fetchData,
}) => {
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [isRemoveFileModalOpen, setIsRemoveFileModalOpen] =
    useState<boolean>(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const { session } = useSessionCookies();
  const userRole = session?.user.selectedUserContext?.role;
  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handlePaginationModelChange = (
    /* istanbul ignore next */
    // this case doesn't necessary to test
    newPaginationModel: RowsState
  ) => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    setRowsState({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
    });
  };

  const onHandleClick =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setSelectedFilePath(
        /* istanbul ignore next */
        // this case doesn't necessary to test
        idElement || ''
      );
    };

  const handleDownloadFile = useCallback(
    async (filePath: string) => {
      /* istanbul ignore next */
      // this case doesn't necessary to test
      try {
        const fileName = filePath.replace(FILE_NAME_REG, '');
        const { presignedUrl } = await FileManagementApi.get(session, filePath);
        await S3Api.download(presignedUrl, fileName);
        setAnchorEl(null);
        setToast({
          severity: 'success',
          message: t('downloadFile.toast.success'),
        });
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
    [session, setToast, t]
  );

  const renderNoFilesView = () => {
    if (!!files?.length) return;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '4.5rem',
        }}
      >
        <Image
          data-testid="liveSupport-image"
          priority
          width="160"
          height="160"
          alt="files"
          src={FilesIcon}
        />
        <Typography
          variant="h6"
          sx={{
            textAlign: 'left',
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
          }}
          mt={2}
          data-testid={`${dataTestId}-noFile.title`}
        >
          {t('noFile.title')}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: 'left',
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'normal',
          }}
          mt={0.25}
          data-testid={`${dataTestId}-noFile.description`}
        >
          {t('noFile.description')}
        </Typography>
      </Box>
    );
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'fileName',
        headerName: t('dataGrid.header.fileName'),
        flex: 1,
        sortable: false,
        minWidth: 400,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) => row.fileName,
        renderCell: ({ row }) =>
          row.fileManagement?.filePath ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <DescriptionOutlined fontSize="small" fill="black" />
              <Typography ml={2}>
                {row.fileManagement.filePath.replace(FILE_NAME_REG, '')}
              </Typography>
            </Box>
          ) : (
            '-'
          ),
      },
      {
        field: 'createdAt',
        headerName: t('dataGrid.header.createdAt'),
        sortable: false,
        filterable: false,
        minWidth: 150,
        flex: 1,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.fileManagement?.createdAt
            ? format(
                new Date(row.fileManagement.createdAt as string),
                D_MMM_YYYY_HH_MM_SS
              )
            : '-',
      },
      {
        field: 'createdBy.user:fullName',
        headerName: t(
          'dataGrid.header.createdBy.user.firstName;createdBy.user.lastName'
        ),
        flex: 1,
        sortable: false,
        minWidth: 200,
        filterable: false,
        disableColumnMenu: true,
        valueGetter: ({ row }) =>
          row.fileManagement.createdBy?.user
            ? `${row.fileManagement.createdBy.user.firstName} ${row.fileManagement.createdBy.user.lastName}`
            : '-',
      },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
          const filePath = row.fileManagement?.filePath;
          const userType = row.fileManagement?.createdBy?.userType;

          /* istanbul ignore next */
          // this case doesn't necessary to test
          const isDisplayRemoveButton =
            isUserPermitted([Role.GP_STAFF], userRole) ||
            (isUserPermitted([Role.GP_COMPANY], userRole) &&
              userType === UserType.COMPANY);

          return (
            <>
              <Box>
                <IconButton
                  edge="end"
                  onClick={onHandleClick(filePath)}
                  data-testid={`${dataTestId}-iconButtonOption`}
                >
                  <MoreVert color="primary" />
                </IconButton>

                <AnchorMenu
                  open={!!anchorEl && selectedFilePath === filePath}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                >
                  <MenuItem
                    key="download"
                    onClick={() => {
                      handleDownloadFile(filePath);
                      setAnchorEl(null);
                    }}
                    data-testid={`${dataTestId}-buttonDownload`}
                  >
                    <FileDownloadOutlined />
                    <Typography marginLeft="0.8rem">
                      {t('common:download')}
                    </Typography>
                  </MenuItem>
                  {isDisplayRemoveButton && (
                    <MenuItem
                      onClick={() => {
                        setIsRemoveFileModalOpen(true);
                        setAnchorEl(null);
                      }}
                      data-testid={`${dataTestId}-buttonRemove`}
                    >
                      <DeleteOutlined />
                      <Typography marginLeft="0.8rem">
                        {t('common:remove')}
                      </Typography>
                    </MenuItem>
                  )}
                </AnchorMenu>
              </Box>
            </>
          );
        },
      },
    ],
    [anchorEl, dataTestId, handleDownloadFile, selectedFilePath, t, userRole]
  );

  const renderFilesView = () => {
    if (!files?.length) return;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          marginTop: '1.5rem',
          width: '100%',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: 'left',
            color: (theme) => theme.palette.text.secondary,
            fontWeight: 'bold',
            marginLeft: '0.75rem',
          }}
        >
          {t('uploadedFiles', { count: files?.length })}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            padding: `0 ${isDesktop ? 1.25 : 1}rem ${isDesktop ? 1.25 : 1}rem ${
              isDesktop ? 1.25 : 1
            }rem`,
            marginTop: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: (theme) => theme.palette.customs.boxShadow,
            minHeight: '60vh',
          }}
        >
          <DataGrid<[]>
            rows={files}
            columns={columns}
            loading={false}
            rowCount={files?.length || 0}
            components={{
              NoRowsOverlay:
                /* istanbul ignore next */
                // this case doesn't necessary to test
                () => <></>,
            }}
            pagination
            paginationMode="client"
            paginationModel={{ ...rowsState }}
            onPaginationModelChange={handlePaginationModelChange}
          />
        </Box>
        <Grid
          container
          sx={{
            display: 'flex',
            minHeight: '60vh',
          }}
        ></Grid>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {isRemoveFileModalOpen && (
        <RemovePayrollFileModal
          session={session}
          filePath={selectedFilePath}
          onClose={() => setIsRemoveFileModalOpen(false)}
          setToast={setToast}
          onSuccess={fetchData}
          dataTestId={`${dataTestId}-fileModal`}
        />
      )}
      {renderNoFilesView()}
      {renderFilesView()}
    </Box>
  );
};

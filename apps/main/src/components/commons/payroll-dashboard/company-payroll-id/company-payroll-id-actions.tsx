import { Add, CommentOutlined, FolderZipOutlined } from '@mui/icons-material';
import { Box, Button, Grid, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { TFunction } from 'next-i18next';
import { FC } from 'react';

interface CompanyPayrollIdActionsProps {
  t: TFunction;
  dataTestId?: string;
  disableDownloadAllFiles?: boolean;
  isAllowUpdateStatus?: boolean;
  onClickedComment?: () => void;
  onClickedAddFile?: () => void;
  onClickedUpdateStatus?: () => void;
  onClickedDownloadAllFiles?: () => void;
}

export const CompanyPayrollIdActions: FC<CompanyPayrollIdActionsProps> = ({
  disableDownloadAllFiles,
  isAllowUpdateStatus,
  onClickedComment,
  onClickedAddFile,
  onClickedUpdateStatus,
  onClickedDownloadAllFiles,
  t,
  dataTestId,
}) => {
  const theme = useTheme();

  const buttonAddFile = (
    <Button
      variant="outlined"
      sx={{
        padding: '0.2rem 1rem 0.2rem 1rem',
        fontWeight: 'normal',
        [theme.breakpoints.down('sm')]: {
          padding: '0.2rem 0.5rem 0.2rem 0.5rem',
        },
      }}
      startIcon={<Add />}
      onClick={onClickedAddFile}
      data-testid={`${dataTestId}-buttonAddFile`}
    >
      {t('common:addFile')}
    </Button>
  );

  const buttonUpdateStatus = (
    <Button
      variant="contained"
      sx={{
        padding: '0.2rem 1rem 0.2rem 1rem',
        fontWeight: 'normal',
        [theme.breakpoints.down('sm')]: {
          padding: '0.2rem 0.5rem 0.2rem 0.5rem',
        },
      }}
      onClick={onClickedUpdateStatus}
      data-testid={`${dataTestId}-buttonUpdateStatus`}
    >
      {t('updateStatus.title')}
    </Button>
  );

  const buttonDownloadAllFiles = (
    <Button
      disabled={disableDownloadAllFiles}
      hidden
      variant="outlined"
      sx={{
        padding: '0.2rem 1rem 0.2rem 1rem',
        fontWeight: 'normal',
        marginRight: '0.75rem',
        [theme.breakpoints.down('sm')]: {
          marginRight: '0.5rem',
        },
      }}
      onClick={onClickedDownloadAllFiles}
      startIcon={<FolderZipOutlined />}
    >
      {t('common:downloadAllFiles')}
    </Button>
  );

  const buttonComment = (
    <IconButton
      sx={{
        marginRight: '0.75rem',
        [theme.breakpoints.down('sm')]: {
          marginRight: '0',
        },
      }}
      onClick={onClickedComment}
      data-testid={`${dataTestId}-buttonComment`}
    >
      <CommentOutlined fontSize="small" color="primary" />
    </IconButton>
  );

  return (
    <Grid
      container
      sx={(theme) => ({
        alignItems: 'center',
        width: '100%',
        padding: '1rem',
        marginTop: '1rem',
        background: theme.palette.background.paper,
        borderRadius: '0.5rem',
        boxShadow: theme.palette.customs.boxShadow,
      })}
      data-testid={`${dataTestId}-container`}
    >
      <Grid
        item
        sm={12}
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {buttonComment}
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.text.disabled,
            width: '1px',
            marginY: '0.3rem',
            marginRight: '1rem',
            [theme.breakpoints.down('sm')]: {
              marginRight: '0.5rem',
            },
          }}
        ></Box>
        {buttonDownloadAllFiles}

        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {buttonAddFile}
          {isAllowUpdateStatus && (
            <>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.text.disabled,
                  width: '1px',
                  marginY: '0.3rem',
                  marginRight: '0.2rem',
                  [theme.breakpoints.down('sm')]: {
                    marginRight: '0',
                  },
                }}
              ></Box>
              {buttonUpdateStatus}
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

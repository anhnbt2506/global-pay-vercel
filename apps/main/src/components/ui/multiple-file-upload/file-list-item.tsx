import { FileUploadStatus, UploadedFile } from '@ayp/typings/ui';
import { truncate } from '@ayp/utils';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { CheckCircle, Clear, ErrorOutline } from '@mui/icons-material';
import { TFunction } from 'next-i18next';
import React, { FC, PropsWithChildren } from 'react';

export const IconContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

interface FileListItemProps {
  file: UploadedFile;
  t: TFunction;
  onRemoveFile: (fileId: string) => void;
  disabled: boolean;
  dataTestId?: string;
}

export const FileListItem: FC<FileListItemProps> = ({
  file,
  t,
  onRemoveFile,
  disabled,
  dataTestId,
}) => {
  const isUploadFailed = file.uploadStatus === FileUploadStatus.UPLOAD_FAILED;

  const EndComponent = () => {
    switch (file.uploadStatus) {
      case FileUploadStatus.UPLOADED_SUCCESSFULLY:
        return (
          <IconContainer>
            <CheckCircle
              sx={{
                color: (theme) => theme.palette.success.main,
              }}
            />
          </IconContainer>
        );
      case FileUploadStatus.UPLOADING:
        return (
          <IconContainer>
            <CircularProgress size={24} />
          </IconContainer>
        );
      default:
        return (
          <IconButton
            onClick={() => onRemoveFile(file.id)}
            disabled={disabled}
            data-testid={`${dataTestId}-buttonRemove`}
          >
            <Clear />
          </IconButton>
        );
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: (theme) => theme.palette.background.paper,
        padding: '0.75rem',
        borderRadius: '0.25rem',
        ...(isUploadFailed && {
          border: (theme) => `1px solid ${theme.palette.error.main}`,
        }),
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'start' }}>
        {isUploadFailed && (
          <ErrorOutline color="error" data-testid={`${dataTestId}-errorIcon`} />
        )}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              ...(isUploadFailed && {
                color: (theme) => theme.palette.error.main,
              }),
            }}
          >
            {truncate(file.file.name)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: (theme) =>
                  isUploadFailed
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
              }}
            >
              {t(`file-upload-status:${file.uploadStatus}`)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <EndComponent />
    </Stack>
  );
};

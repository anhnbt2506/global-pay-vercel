import {
  BackendResource,
  CommonFileManagementApi,
  FileManagementBody,
  FileManagementContext,
} from '@ayp/typings/commons';
import { FileKey, FileUploadStatus, UploadedFile } from '@ayp/typings/ui';
import { getErrorFieldProps, KnownError } from '@ayp/utils';
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { alpha } from '@mui/system';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useSessionCookies } from '@hooks/use-session-cookies';
import { S3Api } from '@services/s3';

import { FileListItem } from './file-list-item';

const scrollBarStyle = {
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '0.25rem',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '0.5rem',
    backgroundColor: 'gray',
    borderTop: '0.25rem transparent solid',
    borderBottom: '0.25rem transparent solid',
    backgroundClip: 'content-box',
  },
};

const generateFileId = (file: File) => `${file.name}-${new Date().getTime()}`;

const initializeUploadStatus = (files: UploadedFile[]) => {
  return files.map((file) => {
    if (file.uploadStatus === FileUploadStatus.UPLOADED_SUCCESSFULLY)
      return file;

    return {
      ...file,
      uploadStatus: FileUploadStatus.UPLOADING,
    };
  });
};

const uploadPromiseHandler = async (
  promise: Promise<string>,
  fileId: string,
  updateFileById: (fileId: string, data: Partial<UploadedFile>) => void
) =>
  promise
    .then((fileKey) =>
      updateFileById(fileId, {
        uploadStatus: FileUploadStatus.UPLOADED_SUCCESSFULLY,
        fileKey,
      })
    )
    .catch((e) => {
      updateFileById(fileId, { uploadStatus: FileUploadStatus.UPLOAD_FAILED });
      throw e;
    });

const sortFileByStatus = (a: UploadedFile, b: UploadedFile) =>
  a.uploadStatus === FileUploadStatus.UPLOAD_FAILED &&
  b.uploadStatus === FileUploadStatus.UPLOAD_FAILED
    ? 0
    : a.uploadStatus === FileUploadStatus.UPLOAD_FAILED
    ? /* istanbul ignore next */
      // this case cannot be reproduced
      -1
    : 1;

interface MultipleFileUploadApi {
  upload: (context: FileManagementContext) => Promise<FileKey[]>;
}

export const useMultipleFileUploadApiRef = () =>
  useRef<MultipleFileUploadApi>(null);

interface MultipleFileUploadProps {
  backendResource: BackendResource;
  customErrorHelperText?: string;
  dataTestId?: string;
  helperText?: string;
  keyName?: string;
  label?: string;
  name: string;
  required?: boolean;
}

export const MultipleFileUpload = forwardRef<
  MultipleFileUploadApi,
  MultipleFileUploadProps
>(
  (
    {
      backendResource,
      customErrorHelperText,
      dataTestId,
      helperText,
      label,
      keyName,
      name,
      required,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { session } = useSessionCookies();

    const inputRef = useRef<HTMLInputElement>(null);

    const {
      submitCount,
      getFieldMeta,
      getFieldProps,
      getFieldHelpers,
      isSubmitting,
    } = useFormikContext();

    const [fileManagementApi, setFileManagementApi] = useState<
      CommonFileManagementApi | undefined
    >();

    const [meta, field, helpers] = [
      getFieldMeta(name),
      getFieldProps<UploadedFile[]>(name),
      getFieldHelpers<UploadedFile[]>(name),
    ];
    const { error, helperText: errorHelperText } = getErrorFieldProps(
      meta,
      submitCount
    );

    useEffect(() => {
      (async () => {
        let fileManagementApi: CommonFileManagementApi | undefined = undefined;
        try {
          switch (backendResource) {
            case BackendResource.GP_FINTECH:
              fileManagementApi = (await import('@services/apis/fintech'))
                .FileManagementApi;
              break;
            /* istanbul ignore next */
            // this case doesn't necessary to test
            case BackendResource.GP_PEOPLE:
              fileManagementApi = (await import('@services/apis/people'))
                .FileManagementApi;
              break;
          }
        } catch (e) {
          /* istanbul ignore next */
          // this case cannot be reproduced
          console.error(e);
        } finally {
          setFileManagementApi(fileManagementApi);
        }
      })();
    }, [backendResource]);

    const { uploadFailedFiles, uploadedFiles } = useMemo(() => {
      if (!field?.value?.length) {
        return {
          uploadFailedFiles: [],
          uploadedFiles: [],
        };
      }

      const uploadedFiles: UploadedFile[] = [];
      const uploadFailedFiles: UploadedFile[] = [];

      field.value.forEach((file) => {
        switch (file.uploadStatus) {
          case FileUploadStatus.UPLOADED_SUCCESSFULLY:
            uploadedFiles.push(file);
            break;
          case FileUploadStatus.UPLOAD_FAILED:
            uploadFailedFiles.push(file);
            break;
          case FileUploadStatus.READY_TO_UPLOAD:
            break;
        }
      });

      return { uploadFailedFiles, uploadedFiles };
    }, [field.value]);

    useImperativeHandle(ref, () => ({
      upload,
    }));

    const getUploadContext = async (
      originalFileName: string,
      context: FileManagementContext
    ) => {
      try {
        const body: FileManagementBody = {
          key:
            keyName ??
            /* istanbul ignore next */
            // this case doesn't necessary to test
            name,
          context: Object.assign({}, context, { originalFileName }),
        };

        /* istanbul ignore next */
        // this case cannot be reproduced
        if (!fileManagementApi)
          throw new KnownError('FileManagementApiUndefined');

        return fileManagementApi.upload(session, body);
      } catch (error) {
        /* istanbul ignore next */
        // this case cannot be reproduced
        throw error;
      }
    };

    const uploadFile = async (file: File, context: FileManagementContext) => {
      const { presignedUrl, headers, key } = await getUploadContext(
        file.name,
        context
      );
      await S3Api.upload(file, presignedUrl, headers);

      return key;
    };

    const upload = async (context: FileManagementContext) => {
      let trackedFiles = initializeUploadStatus(field.value);
      helpers.setValue(trackedFiles);

      function updateFileById(fileId: string, data: Partial<UploadedFile>) {
        trackedFiles = trackedFiles
          .map((file) => {
            if (file.id !== fileId) return file;

            return {
              ...file,
              ...data,
            };
          })
          .sort(sortFileByStatus);
        helpers.setValue(trackedFiles);
      }

      const promises = trackedFiles
        .filter(
          (file) => file.uploadStatus !== FileUploadStatus.UPLOADED_SUCCESSFULLY
        )
        .map((file) =>
          uploadPromiseHandler(
            uploadFile(file.file, context),
            file.id,
            updateFileById
          )
        );

      if (promises.length) {
        const responses = await Promise.allSettled(promises);

        if (responses.some((response) => response.status === 'rejected')) {
          throw new KnownError('FileUploadFailed');
        }
      }

      return trackedFiles.map((file) => file.fileKey);
    };

    const onChange = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        /* istanbul ignore next */
        // this case cannot happen
        if (!event.target.files?.length) return;

        const newFiles: UploadedFile[] = Array.from(event.target.files).map(
          (file) => ({
            id: generateFileId(file),
            file,
            uploadStatus: FileUploadStatus.READY_TO_UPLOAD,
          })
        );

        helpers.setValue([
          ...newFiles,
          ...(field.value ??
            /* istanbul ignore next */
            // this case cannot be reproduced
            []),
        ]);
      },
      [helpers, field.value]
    );

    const onRemoveFile = useCallback(
      (fileId: string) => {
        helpers.setValue(field.value.filter((file) => file.id !== fileId));
      },
      [helpers, field.value]
    );

    const fileInput = (
      <Box
        onClick={
          /* istanbul ignore next */
          // this case doesn't necessary to test
          () => inputRef.current?.click()
        }
        sx={{
          display: 'flex',
          padding: '1.5rem 1rem',
          gap: '0.5rem',
          alignItems: 'center',
          borderRadius: '0.25rem',
          flexDirection: 'column',
          justifyContent: 'center',
          border: (theme) =>
            error
              ? `1px solid ${theme.palette.error.main}`
              : `1px dashed ${theme.palette.divider}`,
          backgroundColor: (theme) =>
            error ? alpha(theme.palette.error.main, 0.04) : 'unset',
          '&:hover': {
            backgroundColor: (theme) =>
              error
                ? alpha(theme.palette.error.main, 0.04)
                : alpha(theme.palette.primary.main, 0.08),
            border: (theme) =>
              error
                ? `1px solid ${theme.palette.error.main}`
                : `1px dashed ${theme.palette.primary.main}`,
          },
          cursor: 'pointer',
          ...(isSubmitting && {
            pointerEvents: 'none',
          }),
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                backgroundColor: (theme) =>
                  error
                    ? alpha(theme.palette.error.main, 0.04)
                    : alpha(theme.palette.primary.main, 0.08),
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                padding: '1.2rem',
              }}
            >
              <UploadFile
                color="primary"
                sx={{
                  color: (theme) =>
                    error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography variant="body2">
              {t('common:multipleFileUpload.selectFileDescription')}
            </Typography>
          </Stack>
          <Button
            disabled={isSubmitting}
            variant="outlined"
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('common:multipleFileUpload.selectFile')}
          </Button>
        </Stack>
        <input
          hidden
          data-testid={dataTestId}
          multiple
          ref={inputRef}
          type="file"
          onChange={onChange}
        />
      </Box>
    );

    const uploadSummary = (
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 'bold',
        }}
      >
        {
          /* istanbul ignore next */
          // this case doesn't necessary to test
          !!uploadFailedFiles.length || !!uploadedFiles.length
            ? t('common:multipleFileUpload.numberOfFilesUpload', {
                totalCount: field.value?.length ?? 0,
                uploadedCount: uploadedFiles.length ?? 0,
              })
            : t('common:multipleFileUpload.numberOfFilesSelected', {
                fileCount: field.value?.length ?? 0,
              })
        }
      </Typography>
    );

    const fileList = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '12.5rem',
          borderRadius: '0.25rem',
          bgcolor: (theme) => theme.palette.grey[100],
          padding: '1rem 0.5rem 1rem 1rem',
        }}
      >
        {field.value?.length ? (
          <Stack
            spacing={1}
            sx={{
              height: '100%',
              width: '100%',
              paddingRight: '0.5rem',
              overflowY: 'scroll',
              overflowX: 'hidden',
              ...scrollBarStyle,
            }}
          >
            {field.value.map((file, index) => (
              <FileListItem
                key={file.id}
                file={file}
                t={t}
                onRemoveFile={onRemoveFile}
                disabled={isSubmitting}
                dataTestId={`${dataTestId}-fileListItem.${index}`}
              />
            ))}
          </Stack>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {t('common:multipleFileUpload.noFileSelected')}
          </Typography>
        )}
      </Box>
    );

    return (
      <Box>
        <InputLabel
          error={error}
          required={required}
          sx={{
            fontSize: '0.75rem',
            paddingBottom: '0.5rem',
          }}
        >
          {label}
        </InputLabel>
        <Stack spacing={1}>
          {fileInput}
          {uploadSummary}
          {fileList}
        </Stack>
        <FormHelperText error={error} data-testid={`${dataTestId}-error`}>
          {error && errorHelperText
            ? customErrorHelperText ??
              /* istanbul ignore next */
              // this case doesn't necessary to test
              t(errorHelperText)
            : helperText}
        </FormHelperText>
      </Box>
    );
  }
);

MultipleFileUpload.displayName = 'MultipleFileUpload';

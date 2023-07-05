import {
  FileManagementBody,
  FileManagementContext,
} from '@ayp/typings/commons';
import { getErrorFieldProps, truncate } from '@ayp/utils';
import { CheckCircle, Clear, UploadFile } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  FormHelperText,
  IconButton,
  InputLabel,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/system';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, FC, useRef, useState } from 'react';

import { MB } from '@configs/constants';
import { useSessionCookies } from '@hooks';
import { FileManagementApi } from '@services/apis/people';
import { S3Api } from '@services/s3';

const getFileExtension = (fileName: string): string =>
  `.${fileName.split('.').pop()}`;

interface FileUploadProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  maxFileSizeInMb?: number;
  allowedFileType?: string[];
  uploadFileOnChange?: boolean;
  context: FileManagementContext;
  keyName?: string;
  dataTestId?: string;
  withoutUpload?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({
  name,
  label,
  required,
  helperText,
  maxFileSizeInMb,
  allowedFileType = ['.csv', '.jpg', '.pdf', '.png', '.zip'],
  uploadFileOnChange,
  context,
  keyName,
  dataTestId,
  withoutUpload,
}) => {
  const { t } = useTranslation('common');
  const { session } = useSessionCookies();
  const inputRef = useRef<HTMLInputElement>(null);
  const { submitCount, getFieldMeta, getFieldProps, getFieldHelpers } =
    useFormikContext();
  const [meta, field, helpers] = [
    getFieldMeta(name),
    getFieldProps(name),
    getFieldHelpers(name),
  ];
  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );
  const [isLoading, setIsLoading] = useState(false);

  const getUploadContext = async (originalFileName: string) => {
    try {
      const body: FileManagementBody = {
        key: keyName ?? name,
        context: Object.assign({}, context, { originalFileName }),
      };

      return FileManagementApi.upload(session, body);
    } catch (error) {
      throw error;
    }
  };

  const onUploadFile = async (file: File) => {
    try {
      const { presignedUrl, headers, key } = await getUploadContext(file.name);
      await S3Api.upload(file, presignedUrl, headers);
      helpers.setValue(key);
    } catch (error) {
      helpers.setError(t('fileUpload.uploadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.validity.valid &&
      event.target.files &&
      event.target.files.length
    ) {
      const file = event.target.files[0];
      if (maxFileSizeInMb && file.size > maxFileSizeInMb * MB) {
        helpers.setError(t('fileUpload.fileSizeExceeded'));
      } else if (!allowedFileType.includes(getFileExtension(file.name))) {
        helpers.setError(t('fileUpload.fileTypeNotAllowed'));
      } else {
        helpers.setError(undefined);
        setIsLoading(true);
        if (uploadFileOnChange) {
          await onUploadFile(file);
        } else {
          if (!withoutUpload) {
            const helpersUploadContext = getFieldHelpers('uploadContext');
            const uploadContext = await getUploadContext(file.name);
            helpersUploadContext.setValue(uploadContext);
          }
          helpers.setValue(file);
        }
        setIsLoading(false);
      }
      helpers.setTouched(true, false);
    }

    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onRemove = () => {
    helpers.setValue(undefined);
  };

  const buildAllowedFileType = () => {
    if (!allowedFileType || !allowedFileType.length) return null;
    if (allowedFileType.length === 1)
      return allowedFileType[0].replace('.', '');
    return allowedFileType.map((file, index) =>
      index === allowedFileType.length - 1 ? (
        <Box
          key={file}
          sx={{
            display: 'flex',
          }}
        >
          <Typography
            variant="body2"
            key={file}
            style={{
              textTransform: 'lowercase',
              marginLeft: '0.2rem',
            }}
          >
            {t('fileUpload.or')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textTransform: 'uppercase',
              marginLeft: '0.2rem',
            }}
          >
            {file.replace('.', '')}
          </Typography>
        </Box>
      ) : (
        file.replace('.', '') + ', '
      )
    );
  };

  const contentClickToUpload = (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: error
            ? alpha(theme.palette.error.main, 0.04)
            : alpha(theme.palette.primary.main, 0.08),
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          padding: '1.5rem',
        })}
      >
        <UploadFile
          sx={(theme) => ({
            fontSize: '2rem',
            color: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          })}
        />
      </Box>
      <Typography
        variant="body1"
        color="primary"
        sx={{
          borderBottom: (theme) =>
            `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {t('fileUpload.clickToUpload')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textTransform: 'uppercase',
            marginRight: '0.2rem',
            display: 'flex',
          }}
        >
          {buildAllowedFileType()}
        </Typography>
        {maxFileSizeInMb && (
          <Typography variant="body2">
            {t('fileUpload.maxFileSizeInMb', { maxFileSizeInMb })}
          </Typography>
        )}
      </Box>
    </>
  );

  const contentUploaded = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: error
              ? alpha(theme.palette.error.main, 0.04)
              : alpha(theme.palette.primary.main, 0.08),
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            padding: '1.2rem',
          })}
        >
          <UploadFile
            sx={(theme) => ({
              fontSize: '1.5rem',
              color: error
                ? theme.palette.error.main
                : theme.palette.primary.main,
            })}
          />
        </Box>
        <Typography
          sx={{
            marginLeft: '0.5rem',
          }}
        >
          {field.value &&
            truncate(uploadFileOnChange ? field?.value : field?.value?.name)}
        </Typography>
        <IconButton
          onClick={onRemove}
          sx={{
            marginLeft: '0.5rem',
          }}
        >
          <Clear fontSize="small" />
        </IconButton>
        {isLoading ? (
          <CircularProgress
            size={24}
            sx={{
              marginLeft: '0.5rem',
            }}
          />
        ) : (
          <CheckCircle
            sx={{
              fontSize: '1.5rem',
              marginLeft: '0.5rem',
              color: (theme) => theme.palette.success.main,
            }}
          />
        )}
      </Box>
    </Box>
  );

  const Content = () =>
    isLoading || field.value ? contentUploaded : contentClickToUpload;

  const defaultFileUploadBox = (
    <Box
      onClick={field.value ? undefined : () => inputRef.current?.click()}
      sx={{
        display: 'flex',
        padding: '1.5rem 1rem',
        gap: '0.5rem',
        width: '100%',
        height: '9.5rem',
        alignItems: 'center',
        borderRadius: '0.5rem',
        flexDirection: 'column',
        justifyContent: 'center',
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        backgroundColor: 'unset',
        '&:hover': {
          cursor: field.value ? 'unset' : 'pointer',
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          border: (theme) => `1px dashed ${theme.palette.primary.main}`,
        },
      }}
    >
      <Content />
    </Box>
  );

  const errorFileUploadBox = (
    <Box
      onClick={field.value ? undefined : () => inputRef.current?.click()}
      sx={{
        display: 'flex',
        padding: '1.5rem 1rem',
        gap: '0.5rem',
        width: '100%',
        height: '9.5rem',
        alignItems: 'center',
        borderRadius: '0.5rem',
        flexDirection: 'column',
        justifyContent: 'center',
        border: (theme) => `1px solid ${theme.palette.error.main}`,
        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.04),
        '&:hover': {
          cursor: field.value ? 'unset' : 'pointer',
          backgroundColor: (theme) => alpha(theme.palette.error.main, 0.04),
          border: (theme) => `1px solid ${theme.palette.error.main}`,
        },
      }}
    >
      <Content />
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
      <input
        hidden
        type="file"
        ref={inputRef}
        onChange={onChange}
        data-testid={dataTestId}
      />
      {error ? errorFileUploadBox : defaultFileUploadBox}
      <FormHelperText error={error} data-testid={`${dataTestId}-error`}>
        {error && errorHelperText ? t(errorHelperText) : helperText}
      </FormHelperText>
    </Box>
  );
};

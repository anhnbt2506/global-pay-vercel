import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { intlFormatDistance } from 'date-fns';
import { TFunction, Trans, useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { FileDownloadOutlined } from '@mui/icons-material';
import { UserSession } from '@ayp/typings/commons';
import { FileManagement } from '@ayp/typings/entities';
import { isErrorResponse } from '@ayp/utils';

import { FILE_NAME_REG } from '@configs/constants';
import { FileManagementApi } from '@services/apis/people';
import { S3Api } from '@services/s3';
import { Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';

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

interface AddendumBoxProps {
  fileManagement: FileManagement;
  t: TFunction;
  session: UserSession;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}

const AddendumBox = ({
  fileManagement,
  t,
  session,
  setToast,
  dataTestId,
}: AddendumBoxProps & {
  t: TFunction;
}) => {
  const { createdAt, createdBy: { user } = {}, filePath } = fileManagement;
  const fileName = filePath?.replace(FILE_NAME_REG, '');

  const handleDownloadFile = useCallback(
    async (filePath: string) => {
      /* istanbul ignore next */
      // this case doesn't necessary to test
      try {
        const { presignedUrl } = await FileManagementApi.get(session, filePath);
        await S3Api.download(presignedUrl, fileName as string);
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
    [session, setToast, t, fileName]
  );

  return (
    <Box sx={{ paddingY: '1rem' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: '100%',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            width: '10rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: '600',
          })}
        >
          <Trans i18nKey={`${t('nameItem', { name: fileName })}`} />
        </Typography>
        <IconButton
          aria-label="download"
          sx={(theme) => ({
            width: '1.5rem',
            height: '1.5rem',
            marginLeft: '1rem',
            '&:hover': {
              background: theme.palette.primary.shades.p4,
            },
          })}
          data-testid={`${dataTestId}-${fileName}-button`}
          onClick={() => handleDownloadFile(filePath as string)}
        >
          <FileDownloadOutlined
            sx={(theme) => ({
              color: theme.palette.primary.main,
              fontSize: '1rem',
            })}
          />
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          {`${t('by')} ${user?.firstName} ${user?.lastName}`}
        </Typography>
        <Typography variant="body2" sx={{ mx: '0.5rem' }}>
          •
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {intlFormatDistance(new Date(createdAt as Date), new Date())}
        </Typography>
      </Stack>
    </Box>
  );
};

export const ReferenceDocuments: FC<{
  session: UserSession;
  workerAddendumFiles: Nullable<FileManagement[]>;
  setToast: Dispatch<SetStateAction<Toast>>;
  dataTestId?: string;
}> = ({ workerAddendumFiles, session, setToast, dataTestId }) => {
  const { t } = useTranslation('reference-documents');

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        padding: '1rem',
        ...scrollBarStyle,
      }}
    >
      <Stack direction="row">
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        >
          <Trans
            i18nKey={`${t('title', {
              number: workerAddendumFiles?.length,
            })}`}
          />
        </Typography>
      </Stack>
      <Divider sx={{ mt: '1rem' }} flexItem />
      {workerAddendumFiles && (
        <>
          <Box>
            <Stack divider={<Divider />}>
              {workerAddendumFiles.map((fileManagement) => (
                <AddendumBox
                  key={fileManagement.id}
                  fileManagement={fileManagement}
                  t={t}
                  session={session}
                  setToast={setToast}
                  dataTestId={`${dataTestId}-${fileManagement.id}`}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

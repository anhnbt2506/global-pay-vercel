import { Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { Role, WorkerAddendumFiles, WorkerUser } from '@ayp/typings/entities';

import { LegalDocument, ReferenceDocuments } from '@components/commons';
import { Checkbox, Toast } from '@components/ui';
import { UserSession } from '@ayp/typings/commons';
import { isUserPermitted } from '@ayp/utils';

interface WorkerContactFormProps {
  workerUser: WorkerUser;
  content: string;
  dataTestId: string;
  session: UserSession;
  workerAddendumFiles: Nullable<WorkerAddendumFiles[]>;
  setToast: Dispatch<SetStateAction<Toast>>;
}

const WorkerContactForm: FC<WorkerContactFormProps> = ({
  workerUser,
  content,
  dataTestId,
  session,
  workerAddendumFiles,
  setToast,
}) => {
  const { t } = useTranslation('employment-contract');

  const sortWorkerAddendumFiles = useMemo(() => {
    const sortedAddendumFiles = workerAddendumFiles
      ?.map((item) => item.fileManagement)
      .filter(({ createdBy }) =>
        isUserPermitted([Role.GP_STAFF], createdBy?.role)
      )
      .sort((a, b) =>
        a?.createdAt && b?.createdAt
          ? a.createdAt <= b.createdAt
            ? /* istanbul ignore next */
              // this case doesn't necessary to test
              1
            : -1
          : /* istanbul ignore next */
          // this case doesn't necessary to test
          a?.createdAt
          ? -1
          : b?.createdAt
          ? 1
          : 0
      );

    return sortedAddendumFiles;
  }, [workerAddendumFiles]);

  return (
    <Grid container spacing={2} maxWidth="md">
      <Grid item xs={12} lg={!!sortWorkerAddendumFiles?.length ? 8 : 12}>
        <Paper
          sx={{
            height: '50vh',
            overflow: 'auto',
            padding: '2rem',
          }}
        >
          <LegalDocument
            content={content}
            dataTestId={`${dataTestId}-legalDocument`}
          />
        </Paper>
      </Grid>
      {!!sortWorkerAddendumFiles?.length && (
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              height: '50vh',
            }}
          >
            <ReferenceDocuments
              session={session}
              workerAddendumFiles={sortWorkerAddendumFiles}
              setToast={setToast}
              dataTestId={`${dataTestId}-referenceDocuments`}
            />
          </Paper>
        </Grid>
      )}
      <Grid item container xs={12}>
        <Grid item xs={2} lg={1}>
          <Checkbox
            required
            name="isSigned"
            dataTestId={`${dataTestId}-checkBox`}
          />
        </Grid>
        <Grid item xs={10} lg={11}>
          <Typography variant="subtitle1">
            {t('form.isSigned.label', {
              firstName: workerUser.userContext.user.firstName,
              lastName: workerUser.userContext.user.lastName,
            })}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WorkerContactForm;

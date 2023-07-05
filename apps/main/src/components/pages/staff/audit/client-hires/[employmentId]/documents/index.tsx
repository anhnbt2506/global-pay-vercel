import { CountryCode, UserSession } from '@ayp/typings/commons';
import { WorkerEmployment } from '@ayp/typings/entities';
import { Box } from '@mui/material';
import { FC } from 'react';

import { FileManagement } from '@components/commons';
import { WorkerEmploymentApi } from '@services/apis/people';
import { FileManagementObjectType } from '@components/commons/file-management/configs';

interface DocumentsProps {
  employmentId: string;
  countryCode: CountryCode;
  session: UserSession;
}

const getWorkerEmploymentById = async (
  session: UserSession,
  employmentId: string
): Promise<WorkerEmployment> => {
  const { workerEmployment } = await WorkerEmploymentApi.getByEmploymentId(
    session,
    {
      attributes: [
        'id',
        'employmentId',
        'workerAddendumFiles.fileManagement:id,key,filePath,createdAt,createdById,type,createdBy,lastModified,lastModifiedBy;workerAddendumFiles.fileManagement.createdBy.user:cognitoId,email,firstName,lastName',
      ],
    },
    employmentId
  );

  return workerEmployment;
};

const Documents: FC<DocumentsProps> = ({
  employmentId,
  countryCode,
  session,
}) => {
  const fetchAddendumFiles = async () => {
    const data = await getWorkerEmploymentById(session, employmentId);

    return data.workerAddendumFiles
      ? data.workerAddendumFiles
          .map((item) => ({
            ...item.fileManagement,
            type: FileManagementObjectType.FILE,
            lastModified: item.fileManagement.createdAt,
            lastModifiedBy: item.fileManagement.createdBy?.user,
          }))
          .sort((a, b) => {
            if (!a.lastModified) return 1;
            if (!b.lastModified) return -1;
            return a.lastModified <= b.lastModified ? 1 : -1;
          })
      : null;
  };

  return (
    <Box sx={{ padding: '1rem' }}>
      <FileManagement
        tPrefix="staff-audit-client-hires-employment-id-file-management"
        filePrefix={`worker-employment/${employmentId}/`}
        translationPrefix={`documents.${countryCode}.`}
        fetchAddendumFiles={fetchAddendumFiles}
      />
    </Box>
  );
};

export default Documents;

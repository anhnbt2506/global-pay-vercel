import { FC } from 'react';
import { Box } from '@mui/material';

import { FileManagement } from '@components/commons';

interface DocumentsProps {
  companyId: string;
}

const Documents: FC<DocumentsProps> = ({ companyId }) => (
  <Box sx={{ padding: '1rem' }}>
    <FileManagement
      tPrefix="staff-audit-client-list-company-id-file-management"
      filePrefix={`company/${companyId}/`}
    />
  </Box>
);

export default Documents;

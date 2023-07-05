import { FC, Dispatch, SetStateAction } from 'react';
import { Link } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

interface FolderProps {
  currentKey: string;
  label: string;
  handleFetchData?: () => Promise<void>;
  setCurrentFolderKey?: Dispatch<SetStateAction<string>>;
  dataTestId?: string;
}

const Folder: FC<FolderProps> = ({
  currentKey,
  label,
  handleFetchData,
  setCurrentFolderKey,
  dataTestId,
}) => (
  <Link
    underline="none"
    color="inherit"
    onClick={() => {
      /* istanbul ignore next */
      // this case cannot be reproduced
      setCurrentFolderKey && setCurrentFolderKey(currentKey);
      /* istanbul ignore next */
      // this case cannot be reproduced
      handleFetchData && handleFetchData();
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      paddingRight: '0.25rem',
      cursor: 'pointer',
    }}
    data-testid={`${dataTestId}-link`}
  >
    <FolderIcon sx={{ marginRight: '0.5rem' }} /> {label}
  </Link>
);

export default Folder;

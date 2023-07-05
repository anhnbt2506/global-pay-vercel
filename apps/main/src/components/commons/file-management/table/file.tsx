import { FC } from 'react';
import { Box } from '@mui/material';
import { Article } from '@mui/icons-material';

const File: FC<{ label: string }> = ({ label }) => (
  <Box sx={{ display: 'flex' }}>
    <Article sx={{ marginRight: '0.5rem' }} />
    {label}
  </Box>
);

export default File;

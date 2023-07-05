/* istanbul ignore file */
// Not used anywhere at the moment
import { Avatar } from '@mui/material';
import { FC, ReactElement } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

interface CircleIcon {
  icon: ReactElement<SvgIconComponent>;
}

export const CircleIcon: FC<CircleIcon> = ({ icon }) => (
  <Avatar
    sx={{
      bgcolor: 'transparent',
      color: (theme) => theme.palette.primary.main,
      border: (theme) => `2px solid ${theme.palette.primary.main}`,
    }}
  >
    {icon}
  </Avatar>
);

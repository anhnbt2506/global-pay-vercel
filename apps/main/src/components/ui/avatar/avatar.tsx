import { getNameInitials } from '@ayp/utils';
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Typography,
} from '@mui/material';
import { FC } from 'react';

interface AvatarProps extends MuiAvatarProps {
  name?: string;
}

export const Avatar: FC<AvatarProps> = ({ name, ...props }) => {
  return (
    <MuiAvatar
      {...(name && {
        children: <Typography>{getNameInitials(`${name}`)}</Typography>,
      })}
      {...props}
    />
  );
};

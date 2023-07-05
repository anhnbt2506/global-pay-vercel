import { Menu, PopoverProps, SxProps, Theme } from '@mui/material';
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

interface AnchorMenuProps {
  anchorEl: PopoverProps['anchorEl'];
  setAnchorEl: Dispatch<SetStateAction<Nullable<Element>>>;
  open?: boolean;
  onClose?: () => void;
  paperPropsSx?: SxProps<Theme>;
}

export const AnchorMenu: FC<PropsWithChildren<AnchorMenuProps>> = ({
  anchorEl,
  children,
  open,
  setAnchorEl,
  onClose,
  paperPropsSx,
  ...props
}) => {
  const defaultOnClose = () => setAnchorEl(null);
  return (
    <Menu
      {...props}
      open={open ?? !!anchorEl}
      onClose={onClose ?? defaultOnClose}
      onClick={onClose ?? defaultOnClose}
      anchorEl={anchorEl}
      PaperProps={{
        elevation: 0,
        sx: (theme) =>
          Object.assign(
            {
              overflow: 'visible',
              filter: `drop-shadow(${theme.palette.customs.boxShadow})`,
              mt: '0.5rem',
              '&:before': {
                top: 0,
                zIndex: 0,
                right: '1rem',
                content: '""',
                display: 'block',
                width: '0.75rem',
                height: '0.75rem',
                position: 'absolute',
                bgcolor: theme.palette.background.paper,
                transform: 'translateY(-50%) rotate(45deg)',
              },
            },
            paperPropsSx
          ),
      }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {children}
    </Menu>
  );
};

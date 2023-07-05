import { useSessionCookies } from '@hooks/use-session-cookies';
import {
  Alert,
  AlertColor,
  AlertTitle,
  Snackbar,
  SnackbarOrigin,
} from '@mui/material';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export interface Toast {
  severity?: AlertColor;
  message?: ReactNode;
  title?: string;
}
interface ToastProps extends Pick<Toast, 'severity'> {
  open?: boolean;
  onClose?: VoidFunction;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  dataTestId?: string;
  title?: string;
}

export const Toast: FC<PropsWithChildren<ToastProps>> = ({
  open,
  onClose,
  children,
  severity,
  dataTestId,
  autoHideDuration = 5_000,
  anchorOrigin = { vertical: 'top', horizontal: 'center' },
  title,
}) => {
  const { session } = useSessionCookies();

  if (session?.error === 'RefreshAccessTokenError') {
    return <></>;
  }

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      data-testid={dataTestId}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        data-testid={`${dataTestId}-${severity}Alert`}
        sx={[
          {
            width: '100%',
          },
          !title && {
            alignItems: 'center',
          },
        ]}
      >
        {!!title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Snackbar>
  );
};

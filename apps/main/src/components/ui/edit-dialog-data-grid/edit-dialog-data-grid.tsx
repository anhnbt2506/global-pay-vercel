import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import React, { ReactNode } from 'react';

interface DialogWrapperDataGrid extends Omit<DialogProps, 'onClose'> {
  children: ReactNode;
  label?: string;
  onClose: () => void;
  onConfirm: () => void;
  dataTestId: string;
}

export const EditDialogDataGrid: React.FC<DialogWrapperDataGrid> = ({
  children,
  label,
  onClose,
  onConfirm,
  dataTestId,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      // disable DataGrid shortcut keys to prevent interruption to user input
      onKeyDown={(e) => e.stopPropagation()}
      {...props}
      data-testid={dataTestId}
    >
      {label && (
        <Box
          display="flex"
          justifyContent="center"
          marginY="1rem"
          paddingX="1rem"
          maxWidth="20rem"
        >
          <Typography fontWeight="bold" variant="h6" textAlign="center">
            {t('common:dataGrid.editDialog.title', {
              label: label.toLocaleLowerCase(),
            })}
          </Typography>
        </Box>
      )}
      {children}
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          data-testid={`${dataTestId}-cancel`}
          onClick={onClose}
        >
          {t('common:cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          data-testid={`${dataTestId}-update`}
        >
          {t('common:update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

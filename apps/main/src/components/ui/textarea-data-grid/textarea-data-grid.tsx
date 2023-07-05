import { Box, DialogContent, TextField, TextareaAutosize } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, useState } from 'react';
import { useFormikContext } from 'formik';

import { EditDialogDataGrid } from '@components/ui';

interface TextareaDataGridProps {
  label?: string;
  name: string;
  dataTestId: string;
}

export const TextareaDataGrid: FC<TextareaDataGridProps> = ({
  label,
  name,
  dataTestId,
}) => {
  const theme = useTheme();

  const { getFieldProps, getFieldHelpers } = useFormikContext();
  const [field, helpers] = [getFieldProps(name), getFieldHelpers(name)];

  const [value, setValue] = useState(field.value);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleConfirm = () => {
    helpers.setValue(value);
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    setValue(field.value);
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        value={value ?? ''}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          readOnly: true,
        }}
        /* istanbul ignore next */
        // Need to double check if it hasn't been used or not
        onClick={() => setIsDialogOpen(true)}
      />
      <EditDialogDataGrid
        label={label}
        open={isDialogOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        disableRestoreFocus
        dataTestId={`${dataTestId}-editDialogDataGrid`}
      >
        <DialogContent style={{ width: '20rem' }}>
          <TextareaAutosize
            autoFocus
            value={value}
            style={{
              fontSize: '1rem',
              fontFamily: theme.typography.fontFamily,
              width: '100%',
              height: '15rem',
              padding: '0.5rem',
              overflow: 'auto',
              resize: 'none',
              borderRadius: '0.25rem',
              border: `1px solid ${theme.palette.text.disabled}`,
              outlineColor: theme.palette.primary.main,
            }}
            onChange={(e) => setValue(e.target.value)}
            data-testid={`${dataTestId}-textAreaAutoSize`}
          />
        </DialogContent>
      </EditDialogDataGrid>
    </Box>
  );
};

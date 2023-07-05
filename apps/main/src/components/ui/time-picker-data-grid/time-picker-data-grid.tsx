import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  StaticTimePicker as MuiTimePicker,
  StaticTimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers/StaticTimePicker';
import { isValid, format } from 'date-fns';
import { FC, useState } from 'react';
import { useFormikContext } from 'formik';

import { DEFAULT_TIME_FORMAT } from '@configs/constants';
import { EditDialogDataGrid } from '@components/ui';

interface TimePickerDataGridProps extends MuiTimePickerProps<Nullable<Date>> {
  required?: boolean;
  dataTestId?: string;
  label?: string;
  name: string;
}

export const TimePickerDataGrid: FC<TimePickerDataGridProps> = ({
  required,
  dataTestId,
  label,
  name,
}) => {
  const { getFieldProps, getFieldHelpers } = useFormikContext();
  const [field, helpers] = [getFieldProps(name), getFieldHelpers(name)];

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [value, setValue] = useState(field.value);

  const handleConfirm = () => {
    helpers.setValue(value);
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    setValue(field.value);
    setIsDialogOpen(false);
  };

  return (
    <Box px={2}>
      <TextField
        /* istanbul ignore next */
        value={value ? format(value, DEFAULT_TIME_FORMAT) : ''}
        fullWidth
        required={required}
        data-testid={dataTestId}
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
        dataTestId={`${dataTestId}-editDialogDataGrid`}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MuiTimePicker<Nullable<Date>>
            value={value}
            onChange={(value) => setValue(isValid(value) ? value : null)}
            slots={{
              // overrride actionBar as MUI is depreceating onClose function
              actionBar: () => null,
            }}
            ampm={false}
          />
        </LocalizationProvider>
      </EditDialogDataGrid>
    </Box>
  );
};

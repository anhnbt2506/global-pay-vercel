import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  StaticDatePicker as MuiDatePicker,
  StaticDatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/StaticDatePicker';
import { isValid, format } from 'date-fns';
import { FC, useState } from 'react';
import { useFormikContext } from 'formik';

import { DEFAULT_DATE_FORMAT } from '@configs/constants';
import { EditDialogDataGrid } from '@components/ui';

interface DatePickerDataGridProps
  extends Omit<MuiDatePickerProps<Nullable<Date>>, 'value'> {
  required?: boolean;
  dataTestId?: string;
  label?: string;
  name: string;
}

export const DatePickerDataGrid: FC<DatePickerDataGridProps> = ({
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
        value={value ? format(value, DEFAULT_DATE_FORMAT) : ''}
        fullWidth
        required={required}
        data-testid={dataTestId}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          readOnly: true,
        }}
        onClick={
          /* istanbul ignore next */
          // this case is unnecessary to test
          () => setIsDialogOpen(true)
        }
      />
      <EditDialogDataGrid
        open={isDialogOpen}
        label={label}
        onClose={handleClose}
        onConfirm={handleConfirm}
        dataTestId={`${dataTestId}-editDialogDataGrid`}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MuiDatePicker<Nullable<Date>>
            value={value}
            onChange={(value) => setValue(isValid(value) ? value : null)}
            slots={{
              // overrride actionBar as MUI is depreceating onClose function
              actionBar: () => null,
            }}
          />
        </LocalizationProvider>
      </EditDialogDataGrid>
    </Box>
  );
};

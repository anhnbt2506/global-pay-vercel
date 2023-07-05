import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { DEFAULT_TIMEOUT } from '@configs/constants';

export interface SearchToolbarProps extends Omit<TextFieldProps, 'onChange'> {
  searchValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchToolbar: FC<SearchToolbarProps> = ({
  onChange,
  placeholder,
  searchValue,
  ...props
}) => {
  const [value, setValue] = useState(searchValue ?? '');
  const [debouncedValue] = useDebounce(value, DEFAULT_TIMEOUT);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <TextField
      value={value}
      variant="standard"
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <Search
            color="primary"
            fontSize="small"
            sx={{
              marginRight: '0.25rem',
            }}
          />
        ),
        endAdornment: (
          <IconButton
            size="small"
            onClick={() => setValue('')}
            style={{
              visibility: value ? 'visible' : 'hidden',
            }}
            data-testid="searchToolbar-clearButton"
          >
            <Clear fontSize="small" />
          </IconButton>
        ),
      }}
      sx={{
        width: {
          xs: 1,
          sm: 'auto',
        },
      }}
      data-testid="searchToolbar-textField"
      {...props}
    />
  );
};

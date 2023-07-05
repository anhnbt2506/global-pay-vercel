import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarProps,
} from '@mui/x-data-grid';
import type { FC } from 'react';

export const FilterToolbar: FC<GridToolbarProps> = ({ ...props }) => (
  <GridToolbarContainer {...props}>
    <GridToolbarFilterButton
      sx={{
        padding: 0,
        display: {
          xs: 'none',
          lg: 'block',
        },
      }}
      nonce={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    />
  </GridToolbarContainer>
);

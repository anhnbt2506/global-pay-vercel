import { FC, ReactNode } from 'react';
import { Typography, Grid } from '@mui/material';

export const LineSection: FC<{
  title: string;
  value?: ReactNode;
}> = ({ title, value }) => {
  return (
    <>
      <Grid
        item
        lg={3}
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {title}:
        </Typography>
      </Grid>
      <Grid item lg={9} xs={12}>
        {value}
      </Grid>
    </>
  );
};

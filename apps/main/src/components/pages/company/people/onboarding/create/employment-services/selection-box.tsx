import { Box, Button, Grid, Typography } from '@mui/material';
import { alpha } from '@mui/system';
import { FC } from 'react';

export const SelectionBox: FC<{
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  dataTestId?: string;
  icon?: JSX.Element;
}> = ({ title, description, onClick, disabled, dataTestId, icon }) => (
  <Button
    onClick={onClick}
    disabled={!!disabled}
    sx={(theme) => ({
      backgroundColor: (theme) =>
        /* istanbul ignore next */
        // this case cannot be reproduced
        !disabled ? 'white' : theme.palette.customs.silver,
      width: '80%',
      maxWidth: '33rem',
      [theme.breakpoints.down('sm')]: {
        width: '95%',
      },
      minHeight: '10rem',
      padding: '1.5rem',
      marginY: '2rem',
      border: (theme) => `1px solid ${theme.palette.customs.boxBorder}`,
      borderRadius: '0.5rem',
      '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
      },
    })}
    data-testid={dataTestId}
  >
    <Grid container>
      <Grid
        item
        xs={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            padding: '1rem',
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: '50%',
          })}
        >
          {icon}
        </Box>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '1.5rem',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'left',
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: (theme) => theme.palette.text.primary,
            textAlign: 'left',
            paddingTop: '0.5rem',
          }}
        >
          {description}
        </Typography>
      </Grid>
    </Grid>
  </Button>
);

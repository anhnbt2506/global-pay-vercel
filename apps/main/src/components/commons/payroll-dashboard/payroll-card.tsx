import { Box, Button, Typography, Grid } from '@mui/material';
import type { FC } from 'react';

interface PayrollCardProps {
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  dataTestId?: string;
  onClick?: () => void;
  icon?: JSX.Element;
  title: string;
  number: number;
  iconBackgroundColor?: string;
  labelLinkBtn?: string;
}

export const PayrollCard: FC<PayrollCardProps> = ({
  dataTestId,
  icon,
  onClick,
  title,
  labelLinkBtn,
  number,
  iconBackgroundColor,
}) => {
  const button = (
    <Button
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.palette.customs.boxShadow,
        width: '100%',
        padding: '1.5rem 1.5rem 1rem 1.5rem',
        maxHeight: '20rem',
        border: `1px solid ${theme.palette.customs.boxBorder}`,
        borderRadius: '0.25rem',
        '&:hover': {
          backgroundColor: theme.palette.customs.aliceBlue,
        },
      })}
      data-testid={`${dataTestId}-${title}`}
    >
      <Grid
        container
        spacing={2}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            display: 'flex',
          },
        })}
      >
        <Grid
          item
          sm={9}
          xs={12}
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '1.5rem',
            [theme.breakpoints.down('sm')]: {
              order: 2,
              alignItems: 'center',
            },
          })}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: 'left',
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: (theme) => theme.palette.text.primary,
              textAlign: 'left',
              paddingTop: '0.5rem',
            }}
          >
            {number}
          </Typography>
        </Grid>
        <Grid
          item
          sm={3}
          xs={12}
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.down('sm')]: {
              order: 1,
              justifyContent: 'center',
            },
          })}
        >
          <Box
            sx={() => ({
              background: iconBackgroundColor,
              borderRadius: '50%',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              position: 'relative',
            })}
          >
            {icon}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={(theme) => ({
            paddingLeft: '1.5rem',
            paddingTop: '1.5rem',
            display: 'flex',
            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          })}
        >
          <Box
            sx={(theme) => ({
              border: 'none',
              backgroundColor: 'transparent',
              padding: 0,
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 500,
              color: theme.palette.primary.main,
            })}
          >
            {labelLinkBtn}
          </Box>
        </Grid>
      </Grid>
    </Button>
  );

  return button;
};

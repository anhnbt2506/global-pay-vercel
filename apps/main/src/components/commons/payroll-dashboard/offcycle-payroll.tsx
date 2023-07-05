import { Box, Typography, Grid, Button } from '@mui/material';
import type { TFunction } from 'next-i18next';
import { FC } from 'react';
import { BoltOutlined } from '@mui/icons-material';

interface OffCyclePayrollProps {
  t: TFunction;
  dataTestId?: string;
  href?: string;
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const OffCyclePayroll: FC<OffCyclePayrollProps> = ({
  title,
  description,
  disabled,
  onClick,
  t,
  dataTestId,
}) => {
  const button = (
    <Button
      disabled={disabled}
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.palette.customs.boxShadow,
        padding: '0.5rem',
        borderRadius: '0.25rem',
        width: '90%',
        '&:hover': {
          backgroundColor: theme.palette.primary.shades.p50,
        },
      })}
      onClick={onClick}
    >
      <Typography
        variant="body2"
        sx={(theme) => ({
          textAlign: 'left',
          color: theme.palette.background.paper,
          fontWeight: 'bold',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        })}
      >
        {t('offCyclePayroll.title')}
      </Typography>
    </Button>
  );

  return (
    <Grid
      container
      sx={(theme) => ({
        alignItems: 'center',
        width: '100%',
        padding: ' 1.5rem 1.25rem 1.5rem 0',
        background: theme.palette.background.paper,
        border: (theme) => `1px solid ${theme.palette.customs.boxBorder}`,
        borderRadius: '0.25rem',
        boxShadow: theme.palette.customs.boxShadow,
      })}
      data-testid={`${dataTestId}-container`}
    >
      <Grid
        item
        sm={1}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          [theme.breakpoints.down('sm')]: {
            display: 'none',
          },
        })}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            padding: '0 1rem',
            borderRadius: '50%',
            backgroundColor: theme.palette.secondary.shades.p8,
            width: '3rem',
            height: '3rem',
            position: 'relative',
          })}
        >
          <Box
            sx={(theme) => ({
              borderRadius: '50%',
              backgroundColor: theme.palette.customs.patternsBlue,
              width: '2.5rem',
              height: '2.5rem',
              position: 'absolute',
              transform: 'translate(-50%,-50%)',
              left: '50%',
              top: '50%',
            })}
          >
            <BoltOutlined
              sx={(theme) => ({
                fontSize: '2rem',
                color: theme.palette.secondary.dark,
                strokeWidth: 1,
                position: 'absolute',
                transform: 'translate(-50%,-50%)',
                left: '50%',
                top: '50%',
              })}
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        sm={8}
        xs={8}
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: '1.5rem',
          },
        })}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: 'left',
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: (theme) => theme.palette.text.primary,
            textAlign: 'left',
            paddingTop: '0.5rem',

            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {description}
        </Typography>
      </Grid>
      <Grid item sm={3} xs={4} textAlign="right">
        {button}
      </Grid>
    </Grid>
  );
};

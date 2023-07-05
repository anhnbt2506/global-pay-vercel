import { Typography, Grid } from '@mui/material';
import { TFunction, Trans } from 'next-i18next';
import { FC } from 'react';
import { WarningAmber } from '@mui/icons-material';
import { Link } from '@components/ui';

interface PayrollDraftProps {
  t: TFunction;
  dataTestId?: string;
  number?: number;
  href?: string;
}

export const PayrollDraft: FC<PayrollDraftProps> = ({
  t,
  number,
  href = '',
  dataTestId,
}) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        width: '100%',
        height: '3rem',
        padding: ' 0 1rem',
        background: theme.palette.warning.shades.p190,
        borderRadius: '0.25rem',
      })}
      data-testid={`${dataTestId}-container`}
    >
      <Grid
        item
        xs={8}
        sm={10}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <WarningAmber
          sx={(theme) => ({
            fontSize: '1.2rem',
            color: theme.palette.warning.main,
            strokeWidth: 1,
          })}
        />
        <Typography
          variant="body2"
          sx={(theme) => ({
            textAlign: 'left',
            color: theme.palette.customs.alertDescription,
            marginLeft: '0.5rem',
          })}
        >
          <Trans
            i18nKey={`${t('payrollDraft.description', { number: number })}`}
          />
        </Typography>
      </Grid>
      <Grid item xs={4} sm={2} textAlign="right">
        <Link external underline="none" href={href}>
          <Typography variant="body2">
            <b> {t('payrollDraft.viewPayroll')}</b>
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

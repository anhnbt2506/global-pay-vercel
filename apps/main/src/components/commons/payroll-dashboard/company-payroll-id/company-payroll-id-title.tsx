import { CountryCode } from '@ayp/typings/commons';
import { CompanyPayrollStatus } from '@ayp/typings/entities';
import { CountryFlag } from '@components/ui';
import { D_MMM_YYYY } from '@configs/constants';
import { Box, Grid, SxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import type { TFunction } from 'next-i18next';
import { FC, useCallback } from 'react';

interface CompanyPayrollIdTitleProps {
  t: TFunction;
  sx?: SxProps;
  dataTestId?: string;
  countryCode: CountryCode;
  title: string;
  periodStartDate: Date;
  periodEndDate: Date;
  payrollStatus: CompanyPayrollStatus;
}

export const CompanyPayrollIdTitle: FC<CompanyPayrollIdTitleProps> = ({
  sx,
  countryCode,
  title,
  periodStartDate,
  periodEndDate,
  payrollStatus,
  dataTestId,
  t,
}) => {
  const theme = useTheme();

  const payrollStatusBackgroundColor = useCallback(
    (status: string) => {
      switch (status) {
        case CompanyPayrollStatus.DRAFT:
          return theme.palette.action.selected;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.PENDING:
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.PENDING_REVIEW:
          return theme.palette.warning.shades.p190;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.REJECTED:
          return theme.palette.error.shades.p190;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.COMPLETED:
          return theme.palette.success.shades.p190;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        default:
          return '';
      }
    },
    [theme]
  );

  const payrollStatusTextColor = useCallback(
    (status: string) => {
      switch (status) {
        case CompanyPayrollStatus.DRAFT:
          return theme.palette.action.active;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.PENDING:
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.PENDING_REVIEW:
          return theme.palette.warning.main;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.REJECTED:
          return theme.palette.error.main;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        case CompanyPayrollStatus.COMPLETED:
          return theme.palette.success.main;
        /* istanbul ignore next */
        // this case doesn't necessary to test
        default:
          return '';
      }
    },
    [theme]
  );

  const renderPayrollStatus = (
    <Box
      sx={(theme) => ({
        padding: '0.125rem 0.7rem',
        borderRadius: '0.25rem',
        background: payrollStatusBackgroundColor(payrollStatus),
        width: 'fit-content',
        marginLeft: '0.5rem',
        [theme.breakpoints.down('md')]: {
          textAlign: 'left',
          marginLeft: '1.5rem',
          marginTop: '0.3rem',
        },
      })}
    >
      <Typography
        sx={() => ({
          color: payrollStatusTextColor(payrollStatus),
          fontSize: '0.8rem',
          fontWeight: 500,
        })}
        data-testid={`${dataTestId}-payrollStatus`}
      >
        {t(`payroll-status:${payrollStatus}`)}
      </Typography>
    </Box>
  );

  const periodTime = () => {
    const startDate = periodStartDate
      ? format(new Date(periodStartDate), D_MMM_YYYY)
      : '';
    const endDate = periodEndDate
      ? format(new Date(periodEndDate), D_MMM_YYYY)
      : '';
    return `${startDate} - ${endDate}`;
  };

  const payPeriodTimeView = (
    <Typography
      variant="body2"
      sx={(theme) => ({
        textAlign: 'right',
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('md')]: {
          width: 'fit-content',
          textAlign: 'left',
        },
      })}
      data-testid={`${dataTestId}-payPeriodTimeView`}
    >
      {t('payPeriod', { payPeriodTime: periodTime() })}
    </Typography>
  );

  return (
    <Grid
      container
      sx={(theme) =>
        Object.assign(
          {},
          {
            alignItems: 'center',
            width: '100%',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          },
          sx
        )
      }
    >
      <Grid
        item
        sm={8}
        xs={12}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CountryFlag code={countryCode} />
          <Typography
            variant="body2"
            sx={{
              textAlign: 'left',
              color: (theme) => theme.palette.text.primary,
              fontWeight: 'bold',
            }}
            ml={1}
            data-testid={`${dataTestId}-payrollTitle`}
          >
            {title}
          </Typography>
        </Box>
        {renderPayrollStatus}
      </Grid>
      <Grid
        item
        sm={4}
        xs={12}
        sx={(theme) => ({
          paddingLeft: '0.5rem',
          textAlign: 'right',
          [theme.breakpoints.down('md')]: {
            paddingLeft: '1.5rem',
            marginTop: '0.5rem',
            textAlign: 'left',
          },
        })}
      >
        {payPeriodTimeView}
      </Grid>
    </Grid>
  );
};

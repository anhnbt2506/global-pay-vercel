import type { RefObject } from '@fullcalendar/core/preact';
import FullCalendar from '@fullcalendar/react';
import { ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isDate } from 'date-fns';
import type { TFunction } from 'next-i18next';
import { FC, useState } from 'react';

import { CALENDAR_TIME_FORMAT } from './config';

interface CalendarHeaderProps {
  calendarRef: RefObject<FullCalendar>;
  t: TFunction;
  dataTestId?: string;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  calendarRef,
  t,
  dataTestId,
}) => {
  const [date, setDate] = useState<Nullable<Date>>(new Date());

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingBottom="1rem"
    >
      <Box justifyContent="flex-start" display="flex" alignItems="center">
        <Box display="inline-flex" paddingRight="0.5rem">
          <Button
            variant="contained"
            sx={(theme) => ({
              borderRadius: '0.25rem',
              borderColor: (theme) => theme.palette.customs.boxShadow,
              [theme.breakpoints.down('sm')]: {
                width: '100%',
              },
            })}
            onClick={() => {
              calendarRef.current?.getApi().today();
              calendarRef.current?.getApi().getDate() &&
                setDate(calendarRef.current?.getApi().getDate());
            }}
            data-testid={`${dataTestId}-calendarHeader-todayButton`}
          >
            <Typography sx={{ fontWeight: 'bold' }}>{t('today')}</Typography>
          </Button>
          <Button
            onClick={() => {
              calendarRef.current?.getApi().prev();
              calendarRef.current?.getApi().getDate() &&
                setDate(calendarRef.current?.getApi().getDate());
            }}
            sx={{
              transform: 'rotate(180deg)',
              padding: '0.5rem',
              minWidth: '1rem',
              color: 'black',
              marginLeft: '0.25rem',
              borderRadius: '50%',
            }}
            data-testid={`${dataTestId}-calendarHeader-prevButton`}
          >
            <ArrowForwardIos sx={{ fontSize: '1.2rem' }} />
          </Button>
          <Button
            onClick={() => {
              calendarRef.current?.getApi().next();
              calendarRef.current?.getApi().getDate() &&
                setDate(calendarRef.current?.getApi().getDate());
            }}
            sx={{
              padding: '0.5rem',
              minWidth: '1rem',
              color: 'black',
              borderRadius: '50%',
            }}
            data-testid={`${dataTestId}-calendarHeader-nextButton`}
          >
            <ArrowForwardIos sx={{ fontSize: '1.2rem' }} />
          </Button>
        </Box>
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          })}
          data-testid={`${dataTestId}-calendarHeader-title`}
        >
          <Typography fontWeight={500} fontSize={'1.5rem'}>
            {!!date && format(date, CALENDAR_TIME_FORMAT.HEADER_TITLE)}
          </Typography>
        </Box>
      </Box>
      <Box data-testid={`${dataTestId}-calendarHeader-selectMonth`}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            data-testid={`${dataTestId}-calendarHeader-xxxx`}
            label={t('selectMonth')}
            format={CALENDAR_TIME_FORMAT.SELECT_MONTH_INPUT}
            views={['month', 'year']}
            value={date}
            onChange={(newDate) => {
              /* istanbul ignore next*/
              // Haven't found a way to test it
              setDate(newDate);
              /* istanbul ignore next*/
              // Haven't found a way to test it
              isDate(newDate) &&
                calendarRef.current
                  ?.getApi()
                  .gotoDate(
                    format(
                      newDate as Date,
                      CALENDAR_TIME_FORMAT.GO_TO_DATE_INPUT
                    )
                  );
            }}
            slots={{
              textField: (params) => (
                <TextField {...params} data-testid="timePickerPaper" />
              ),
            }}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

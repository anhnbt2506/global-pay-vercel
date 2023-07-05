import type { EventApi } from '@fullcalendar/core';
import { Close } from '@mui/icons-material';
import { Box, Button, Modal, Typography } from '@mui/material';
import { format, parse } from 'date-fns';
import { isString } from 'formik';
import type { FC } from 'react';

import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';

import { CALENDAR_TIME_FORMAT } from './config';

interface CalendarModalProps {
  open: boolean;
  selectedEvent: Nullable<EventApi>;
  onClose: () => void;
  dataTestId?: string;
}

export const CalendarModal: FC<CalendarModalProps> = ({
  open,
  selectedEvent,
  dataTestId,
  onClose,
}) => {
  return (
    <Modal open={open}>
      <Box
        data-testid={`${dataTestId}-calendarEvent-modal`}
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: theme.palette.background.paper,
          pt: '0.5rem',
          px: '1rem',
          pb: '0.5rem',
          width: '30rem',
          boxShadow: (theme) => theme.palette.customs.boxShadow,
          [theme.breakpoints.down('sm')]: {
            width: '22rem',
            display: 'grid',
          },
        })}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {selectedEvent?.title}
          </Typography>
          <Button
            onClick={onClose}
            variant="text"
            disableTouchRipple={true}
            sx={{
              padding: 0,
              margin: 0,
              minWidth: 'fit-content',
              color: (theme) => theme.palette.customs.doveGray,
            }}
            size="small"
          >
            <Close />
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            fontSize: '0.5rem',
            color: (theme) => theme.palette.customs.doveGray,
          }}
        >
          {!!selectedEvent?.startStr && isString(selectedEvent.startStr) && (
            <Typography>
              {format(
                parse(
                  selectedEvent.startStr,
                  GP_BACKEND_DATE_FORMAT,
                  new Date()
                ),
                CALENDAR_TIME_FORMAT.POPOVER_DESCRIPTION
              )}
            </Typography>
          )}
        </Box>
        {!!selectedEvent?.extendedProps?.description && (
          <Typography sx={{ color: (theme) => theme.palette.customs.doveGray }}>
            {selectedEvent.extendedProps.description}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

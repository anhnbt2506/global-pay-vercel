import { isErrorResponse } from '@ayp/utils';
import type { EventApi, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import { useTranslation } from 'next-i18next';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Toast } from '@components/ui';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';

import { CalendarHeader } from './calendar-header';
import { CalendarModal } from './calendar-modal';
import { CalendarNoEventsOverlay } from './calendar-no-events-overlay';
import {
  DAY_MAX_EVENT_ROWS,
  CalendarEventInput,
  FetchEventsApi,
} from './config';

interface CalendarProps {
  isDesktop: boolean;
  fetchEventsApi: FetchEventsApi;
  dataTestId?: string;
}

export const Calendar: FC<CalendarProps> = ({
  isDesktop,
  fetchEventsApi,
  dataTestId,
}) => {
  const { t } = useTranslation('calendar');
  const calendarRef = useRef<Nullable<FullCalendar>>(null);

  const [toast, setToast] = useState<Toast>({});
  const [selectedEvent, setSelectedEvent] = useState<Nullable<EventApi>>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(
    (arg: EventClickArg) => {
      if (document.getElementsByClassName('fc-popover')[0]) {
        document
          .getElementsByClassName('fc-popover')[0]
          .classList.add('fc-disable-popover');
      }
      setSelectedEvent(arg.event);
      setOpen(true);
    },
    [setSelectedEvent, setOpen]
  );

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    isDesktop
      ? calendarRef.current?.getApi().changeView('dayGridMonth')
      : calendarRef.current?.getApi().changeView('listMonth');
  }, [isDesktop, calendarRef]);

  const calendar = useMemo(
    () => (
      <>
        <CalendarHeader
          calendarRef={calendarRef}
          t={t}
          dataTestId={dataTestId}
        />
        <FullCalendar
          ref={calendarRef}
          initialView={'dayGridMonth'}
          height={'100vh'}
          headerToolbar={false}
          fixedWeekCount={false}
          dayMaxEventRows={DAY_MAX_EVENT_ROWS}
          plugins={[dayGridPlugin, listPlugin]}
          events={(arg, successCallback) =>
            new Promise<CalendarEventInput[]>(async () => {
              try {
                const events = await fetchEventsApi(arg);
                successCallback(events);
              } catch (e) {
                /* istanbul ignore else */
                // This case is unnecessary to test
                if (isErrorResponse(e)) {
                  setToast({
                    severity: 'error',
                    message: e.error.name,
                  });
                } else {
                  setToast({
                    severity: 'error',
                    message: t(UNKNOWN_ERROR_MESSAGE),
                  });
                }
              }
            })
          }
          eventClick={handleOpen}
          noEventsContent={
            <CalendarNoEventsOverlay t={t} dataTestId={dataTestId} />
          }
          noEventsClassNames={'fc-no-event-bg'}
        />
      </>
    ),
    [t, handleOpen, fetchEventsApi, dataTestId]
  );

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId={dataTestId}
      >
        {toast.message}
      </Toast>
      {calendar}
      <CalendarModal
        open={open}
        selectedEvent={selectedEvent}
        onClose={handleClose}
        dataTestId={dataTestId}
      />
    </>
  );
};

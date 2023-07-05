import { Box } from '@mui/material';
import type { TFunction } from 'next-i18next';
import type { FC } from 'react';

interface CalendarNoEventsOverlayProps {
  dataTestId?: string;
  t: TFunction;
}

export const CalendarNoEventsOverlay: FC<CalendarNoEventsOverlayProps> = ({
  t,
  dataTestId,
}) => <Box data-testid={`${dataTestId}-calendar-noEvent`}>{t('noEvents')}</Box>;

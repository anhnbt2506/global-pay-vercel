import {
  CalendarConfigFilter,
  CalendarEventFilter,
  CalendarTagFilter,
} from '@ayp/typings/entities';
import { Filter } from '@ayp/typings/commons';

export type FilterType = Filter<
  CalendarEventFilter & CalendarTagFilter & CalendarConfigFilter
>[];

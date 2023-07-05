import { CountryCode } from '@commons';
import { HireType } from '@entities';

import { Option } from '@ui';

export enum CalendarStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum AdjustmentEvent {
  BEFORE_AFFECTED_EVENT = 'BEFORE_AFFECTED_EVENT',
  AFTER_AFFECTED_EVENT = 'AFTER_AFFECTED_EVENT',
}

export enum AdjustmentMethod {
  WORKING_DAYS = 'WORKING_DAYS',
  CALENDAR_DAYS = 'CALENDAR_DAYS',
}

export enum DateType {
  CALENDAR_DATE = 'CALENDAR_DATE',
  SPECIFIC_DAY = 'SPECIFIC_DAY',
  CLIENT_INPUT_DATE = 'CLIENT_INPUT_DATE',
}

export enum CalendarType {
  EVENT = 'EVENT',
  TAG = 'TAG',
  CALENDAR = 'CALENDAR',
}

export enum CalendarSelectionType {
  EVENT = 'calendar-event',
  TAG = 'calendar-tag',
}

export enum CalendarPeriod {
  SEMI_MONTHLY = 'SEMI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

export enum CalendarClientInputDate {
  PAYROLL_CUT_OFF_DATE = 'PAYROLL_CUT_OFF_DATE',
  PAYROLL_DATE = 'PAYROLL_DATE',
  SECOND_PAYROLL_CUT_OFF_DATE = 'SECOND_PAYROLL_CUT_OFF_DATE',
  SECOND_PAYROLL_DATE = 'SECOND_PAYROLL_DATE',
}

export enum CalendarConfigTriggerPoint {
  COUNTRY_DATA_SUBMISSION = 'COUNTRY_DATA_SUBMISSION',
}

export interface CalendarEvent {
  id: number;
  calendarEventId: string;
  name: string;
  description: string;
  dateType: Nullable<DateType>;
  dateValue: string;
  calendarTagId: string;
  calendarTag: CalendarTag;
  status: CalendarStatus;
  isAutomatedReminder: boolean;
  reminderBasedOn: Nullable<AdjustmentMethod>;
  reminderDayBeforeEvent: Nullable<number>;
  createdAt: Date;
  updatedAt: Date;
}
export interface AdjustmentCalendarTag {
  id: number;
  calendarTagId: string;
  name: string;
  description: string;
  isAdjustmentRequired: boolean;
  status: CalendarStatus;
  adjustmentCalendarTagId: Nullable<string>;
  adjustmentEvent: Nullable<AdjustmentEvent>;
  adjustmentMethod: Nullable<AdjustmentMethod>;
  adjustmentDays: Nullable<number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarTag extends AdjustmentCalendarTag {
  adjustmentCalendarTag?: Nullable<AdjustmentCalendarTag>;
}

export interface CalendarConfigContext {
  hireType: HireType;
  calendarPeriod: CalendarPeriod;
  countryCode: CountryCode;
  triggerPoint: CalendarConfigTriggerPoint;
}

export interface CalendarConfig {
  id: number;
  calendarConfigId: string;
  name: string;
  description: string;
  context: CalendarConfigContext;
  status: CalendarStatus;
  calendarTags: Nullable<Option<string>[]>;
  createdAt: Date;
  updatedAt: Date;
}

export type CalendarEventFilter = keyof CalendarEvent;

export type CalendarEventSortBy = keyof CalendarEvent;

export type CalendarTagFilter = keyof CalendarTag;

export type CalendarTagSortBy = keyof CalendarTag;

export type CalendarConfigFilter = keyof CalendarConfig;

export type CalendarConfigSortBy = keyof CalendarConfig;

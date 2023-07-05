import {
  CalendarUnit,
  CountryCode,
  HiringCountryRule,
} from '@ayp/typings/commons';

export const HIRING_COUNTRY_RULES: Record<string, HiringCountryRule> = {
  [CountryCode.HONGKONG]: {
    probationPeriod: {
      min: 0,
      max: 180,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 7,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 2,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.MONTH,
    },
  },
  [CountryCode.INDONESIA]: {
    probationPeriod: {
      min: 0,
      max: 90,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 12,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
  },
  [CountryCode.MALAYSIA]: {
    probationPeriod: {
      min: 0,
      max: 180,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 8,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 14,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.MONTH,
    },
  },
  [CountryCode.PHILIPPINES]: {
    probationPeriod: {
      value: 180,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 5,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 5,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
    compassionateTimeOff: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
  },
  [CountryCode.SINGAPORE]: {
    probationPeriod: {
      min: 0,
      max: 180,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 7,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 14,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.MONTH,
    },
  },
  [CountryCode.THAILAND]: {
    probationPeriod: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
    paidTimeOff: {
      min: 6,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 30,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
  },
  [CountryCode.VIETNAM]: {
    paidTimeOff: {
      min: 12,
      unit: CalendarUnit.DAY,
    },
    sickTimeOff: {
      min: 30,
      unit: CalendarUnit.DAY,
    },
    terminationNotice: {
      min: 0,
      unit: CalendarUnit.DAY,
    },
  },
};

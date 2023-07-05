import { CsvTemplate } from '@ayp/typings/entities';
import { useTranslation } from 'next-i18next';

import { convertTimeToDateTime, csvToObject } from '.';

jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(),
}));

const tSpy = jest.fn((str) => str);
const useTranslationSpy = useTranslation as jest.Mock;

const currencies = [
  { id: 1, code: 'AF', label: 'Afghanistan', value: 'AF' },
  { id: 2, code: 'HKD', label: 'Hong Kong Dollar', value: 'HKD' },
];

const countries = [
  { id: 1, code: 'AF', label: 'Afghanistan', dialingCode: '+93', value: 'AF' },
  { id: 2, code: 'HK', label: 'Hong Kong', dialingCode: '+852', value: 'HK' },
];

const rowCsvHeaders = [
  'WHC -- Hiring country,',
  'WFN -- Worker first name,',
  'WGEN -- Worker gender,',
  'WNY -- Worker Nationality,',
  'DCC -- Dialing code for contact number,',
  'WMLE -- Worker has multiple employers,',
  'WCSR -- Worker payment currency,',
  'WFST -- Worker full time employment start time,',
  'ECSD -- Employer contract sign date,',
  'WCTD -- Compassionate time off (days),',
  'WOO -- Entitled to overtime,',
  'WPPD -- Probation period,',
  'WSPM,',
  'WJD -- Worker job description',
  '\n',
];

const rowCsvValues = [
  'HK -- Hong Kong,',
  'Tommy Xiaomi,',
  'FEMALE -- Female,',
  'HK -- Hong Kong,',
  'HK -- +852 Hong Kong,',
  'NO -- No,',
  'HKD -- Hong Kong Dollar,',
  '9:00:00,',
  ' 2023-03-13,',
  '1,',
  'YES -- Yes,',
  '60,',
  '440000,',
  'Worker job description',
  '\n',
  ',',
  'Emmy',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  ',',
  '\n',
];

const standardData = [...rowCsvHeaders, ...rowCsvValues];

const csvTemplate: CsvTemplate[] = [
  { columnName: 'WHC', dataType: 'country', options: null },
  {
    columnName: 'WFN',
    dataType: 'string',
    options: null,
  },
  {
    columnName: 'WGEN',
    dataType: 'enum',
    options: ['FEMALE', 'MALE'],
  },
  { columnName: 'WNY', dataType: 'country', options: null },
  { columnName: 'DCC', dataType: 'dialingCode', options: null },
  { columnName: 'WMLE', dataType: 'boolean', options: null },
  { columnName: 'WCSR', dataType: 'currency', options: null },
  { columnName: 'WFST', dataType: 'time', options: null },
  { columnName: 'ECSD', dataType: 'date', options: null },
  { columnName: 'WCTD', dataType: 'smallint', options: null },
  { columnName: 'WOO', dataType: 'boolean', options: null },
  { columnName: 'WPPD', dataType: 'integer', options: null },
  { columnName: 'WSPM', dataType: 'float', options: null },
  { columnName: 'WSPM', dataType: 'float', options: null },
  { columnName: 'WJD', dataType: 'text', options: null },
];

describe('csvToObject', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    useTranslationSpy.mockReturnValue({
      t: tSpy,
    });
  });

  it('should return correct value when given data is correct', async () => {
    const file = new File(standardData, 'company-onboarding-pom-hongkong.csv', {
      type: 'text/plain',
    });

    expect(
      await csvToObject(file, csvTemplate, tSpy, countries, currencies)
    ).toEqual({
      name: 'company-onboarding-pom-hongkong.csv',
      headers: [
        { id: 'WHC', label: 'Hiring country' },
        { id: 'WFN', label: 'Worker first name' },
        { id: 'WGEN', label: 'Worker gender' },
        { id: 'WNY', label: 'Worker Nationality' },
        { id: 'DCC', label: 'Dialing code for contact number' },
        { id: 'WMLE', label: 'Worker has multiple employers' },
        { id: 'WCSR', label: 'Worker payment currency' },
        { id: 'WFST', label: 'Worker full time employment start time' },
        { id: 'ECSD', label: 'Employer contract sign date' },
        { id: 'WCTD', label: 'Compassionate time off (days)' },
        { id: 'WOO', label: 'Entitled to overtime' },
        { id: 'WPPD', label: 'Probation period' },
        { id: 'WSPM', label: '' },
        { id: 'WJD', label: 'Worker job description' },
      ],
      values: [
        {
          DCC: {
            code: 'HK',
            dialingCode: '+852',
            id: 2,
            label: 'Hong Kong',
            value: 'HK',
          },
          ECSD: new Date('2023-03-13'),
          WCSR: { code: 'HKD', id: 2, label: 'Hong Kong Dollar', value: 'HKD' },
          WCTD: '1',
          WFN: 'Tommy Xiaomi',
          WFST: convertTimeToDateTime('9:00:00'),
          WGEN: 'FEMALE',
          WHC: {
            code: 'HK',
            dialingCode: '+852',
            id: 2,
            label: 'Hong Kong',
            value: 'HK',
          },
          WMLE: 0,
          WNY: {
            code: 'HK',
            dialingCode: '+852',
            id: 2,
            label: 'Hong Kong',
            value: 'HK',
          },
          WOO: 1,
          WPPD: '60',
          WSPM: '440000',
          WJD: 'Worker job description',
          id: 1,
        },
        {
          DCC: null,
          ECSD: null,
          WCSR: null,
          WCTD: null,
          WFN: 'Emmy',
          WFST: null,
          WGEN: null,
          WHC: null,
          WMLE: null,
          WNY: null,
          WOO: null,
          WPPD: null,
          WSPM: null,
          WJD: '',
          id: 2,
        },
      ],
    });
  });

  it('should return csv unsupported column message', async () => {
    const fileDataWithUnsupportedColumn = [...standardData];
    fileDataWithUnsupportedColumn.unshift('WUC -- Worker unsupported column');

    const file = new File(
      fileDataWithUnsupportedColumn,
      'company-onboarding-pom-hongkong.csv',
      {
        type: 'text/plain',
      }
    );

    await expect(
      csvToObject(file, csvTemplate, tSpy, countries, currencies)
    ).rejects.toEqual({ message: 'common:fileUpload.csvUnsupportedColumn' });
  });

  it('should return csv exceed row message', async () => {
    const maxCsvRow = 100;

    const fileDataWithExceedRow = [...standardData];
    for (let i = 0; i < maxCsvRow; i++) {
      fileDataWithExceedRow.push(...rowCsvValues);
    }

    const file = new File(
      fileDataWithExceedRow,
      'company-onboarding-pom-hongkong.csv',
      {
        type: 'text/plain',
      }
    );

    await expect(
      csvToObject(file, csvTemplate, tSpy, countries, currencies)
    ).rejects.toEqual({ message: 'common:fileUpload.csvRowExceeded' });
  });
});

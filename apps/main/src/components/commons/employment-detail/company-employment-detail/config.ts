import { Option } from '@ayp/typings/ui';

export enum CompanyEmploymentDetailTabs {
  INFORMATION = 'information',
}

export const COMPANY_EMPLOYMENT_DETAIL_LABEL_TABS_PREFIX =
  'company-people-workforce-employment-id:';

export const COMPANY_EMPLOYMENT_DETAIL_TAB_OPTIONS: Option<CompanyEmploymentDetailTabs>[] =
  [
    {
      id: CompanyEmploymentDetailTabs.INFORMATION,
      value: CompanyEmploymentDetailTabs.INFORMATION,
      label: `${COMPANY_EMPLOYMENT_DETAIL_LABEL_TABS_PREFIX}${CompanyEmploymentDetailTabs.INFORMATION}`,
    },
  ];

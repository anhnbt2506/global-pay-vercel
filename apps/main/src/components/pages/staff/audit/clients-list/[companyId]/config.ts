import { Option } from '@ayp/typings/ui';

export enum CompanyDetailOptionsTabs {
  INFORMATION = 'information',
  DOCUMENTS = 'documents',
  UPDATE_HISTORY = 'updateHistory',
  SERVICE_DETAILS = 'serviceDetails',
  ENTITY_MANAGEMENT = 'entityManagement',
  DEPARTMENT = 'department',
}

export const COMPANY_DETAIL_LABEL_TABS_PREFIX =
  'staff-audit-client-list-company-id:';

export const COMPANY_DETAIL_TAB_OPTIONS: Option<string>[] = [
  {
    id: CompanyDetailOptionsTabs.INFORMATION,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${CompanyDetailOptionsTabs.INFORMATION}`,
  },
  {
    id: CompanyDetailOptionsTabs.SERVICE_DETAILS,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${CompanyDetailOptionsTabs.SERVICE_DETAILS}`,
  },
  {
    id: CompanyDetailOptionsTabs.DOCUMENTS,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${CompanyDetailOptionsTabs.DOCUMENTS}`,
  },
  {
    id: CompanyDetailOptionsTabs.ENTITY_MANAGEMENT,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${CompanyDetailOptionsTabs.ENTITY_MANAGEMENT}`,
  },
  {
    id: CompanyDetailOptionsTabs.DEPARTMENT,
    label: `${COMPANY_DETAIL_LABEL_TABS_PREFIX}${CompanyDetailOptionsTabs.DEPARTMENT}`,
  },
];

import { CountryCode } from '@ayp/typings/commons';
import { PhilippinesFieldManagerialType } from '@ayp/typings/commons/countries';
import {
  AdjustmentEvent,
  AdjustmentMethod,
  CalendarClientInputDate,
  CalendarConfigTriggerPoint,
  CalendarPeriod,
  CalendarStatus,
  CalendarType,
  CitizenshipStatus,
  CompannyPomIdContributionForBpjsOnSalary,
  CompanyBillingAddressType,
  CompanyCategory,
  CompanyIndustry,
  CompanyInterest,
  CompanyPomHkMpfProvider,
  CompanyPomPhStatutoryDeductions,
  CompanyPomSgCpfPaymentMode,
  CompanyPomSgCpfSubmissionPlatform,
  CompanyPomVnShuiProvider,
  CompanyStatus,
  ContractType,
  DateType,
  EmergencyContactRelationship,
  EmploymentType,
  EntityLinkOptionsType,
  EntityLinkStatus,
  Gender,
  HireStatus,
  HireType,
  MaritalStatus,
  PayrollCycle,
  PermitType,
  ProrateSalaryFormula,
  Race,
  Religion,
  ServiceAgreementStatus,
  ServiceAgreementType,
  WorkplaceAddressType,
  WorkerScheduleType,
  CompanyPayrollStatus,
  CompanyPayrollType,
} from '@ayp/typings/entities';
import { CountryOption, Option } from '@ayp/typings/ui';
import { mapEnumToOptions } from '@ayp/utils';

export const devSessionFilePath = 'tmp/user.json';

export const CHAT_SIDEBAR_WIDTH = 16;
export const SIDEBAR_WIDTH = 16;
export const TOP_NAVIGIATION_HEIGHT = 4;
export const MB = 1024 * 1024;

export const DEFAULT_TIMEOUT = 1_000;

const REFRESH_ACCESS_TOKEN_TIMEOUT = 15 * 60 * DEFAULT_TIMEOUT;

export const TRIGGER_REFRESH_ACCESS_TOKEN_TIMEOUT =
  REFRESH_ACCESS_TOKEN_TIMEOUT - 30 * DEFAULT_TIMEOUT;

export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_TIME_FORMAT = 'HH:mm';

export const GP_BACKEND_DATE_FORMAT = 'yyyy-MM-dd';
export const GP_BACKEND_TIME_FORMAT = 'HH:mm:ss';
export const D_MMM_YYYY = 'd MMM yyyy';
export const D_MMM_YYYY_HH_MM_SS = 'd MMM yyyy HH:mm:ss';

export const GLOBAL_PAY_CORPORATE_URL = 'https://ayp-group.com/ayp-global-pay/';
export const DEFAULT_PAGE_SIZE = 25;

export const HOTJAR_VERSION = 6;

export const FILE_NAME_REG = /^.*[\\\/]/;

export const EMAIL_DOMAIN_ADDRESS_BLACKLIST = [
  '@hotmail.',
  '@gmail.',
  '@yahoo.',
  '@outlook.',
  '@live.',
];

export const CONVERSATION_CONTEXT_TYPE_COMPANY_PAYROLL = 'COMPANY_PAYROLL';
export const CONVERSATION_CONTEXT_TYPE_SERVICE_AGREEMENT = 'SERVICE_AGREEMENT';

export const HIRE_TYPE_LABEL_PREFIX = 'hire-type:';
export const HIRE_STATUS_LABEL_PREFIX = 'hire-status:';
export const COMPANY_STATUS_LABEL_PREFIX = 'company-status:';
export const CALENDAR_STATUS_LABEL_PREFIX = 'calendar-status:';
export const CALENDAR_TYPE_LABEL_PREFIX = 'calendar-type:';
export const CALENDAR_PERIOD_LABEL_PREFIX = 'calendar-period:';
export const CALENDAR_CLIENT_INPUT_DATE_PREFIX = 'calendar-client-input-date:';
export const COMPANY_CATEGORY_LABEL_PREFIX = 'company-category:';
export const COMPANY_INDUSTRY_LABEL_PREFIX = 'company-industry:';
export const COMPANY_INTEREST_LABEL_PREFIX = 'company-interest:';
export const CITIZENSHIP_STATUS_LABEL_PREFIX = 'citizenship-status:';
export const CONTRACT_TYPE_LABEL_PREFIX = 'contract-type:';
export const EMPLOYMENT_TYPE_LABEL_PREFIX = 'employment-type:';
export const ENTITY_LINK_STATUS_LABEL_PREFIX = 'entity-link-status:';
export const ENTITY_LINK_OPTIONS_LABEL_PREFIX = 'entity-link-options:';
export const MARITAL_LABEL_STATUS_PREFIX = 'marital-status:';
export const CALENDAR_UNIT_LABEL_PREFIX = 'calendar-unit:';
export const WORKPLACE_ADDRESS_TYPE_LABEL_PREFIX = 'workplace-address-type:';
export const RELIGION_LABEL_PREFIX = 'religion:';
export const RACE_LABEL_PREFIX = 'race:';
export const GENDER_LABEL_PREFIX = 'gender:';
export const EMERGENCY_CONTACT_RELATIONSHIP_PREFIX =
  'emergency-contact-relationship:';
export const PERMIT_TYPE_LABEL_PREFIX = 'permit-type:';
export const SERVICE_AGREEMENT_LABEL_PREFIX = 'service-agreement:';
export const SERVICE_AGREEMENTS_STATUS_LABEL_PREFIX =
  'service-agreements-status:';
export const PAYROLL_CYCLE_LABEL_PREFIX = 'payroll-cycle:';
export const PRORATE_SALARY_FORMULA_LABEL_PREFIX = 'prorate-salary-formula:';
export const COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_LABEL_PREFIX =
  'company-pom-sg-cpf-submission-platform:';
export const COMPANY_POM_SG_E_SUBMISSION_SERVICE_LABEL_PREFIX =
  'company-pom-sg-e-submission-service:';
export const COMPANY_POM_SG_CPF_PAYMENT_MODE_LABEL_PREFIX =
  'company-pom-sg-cpf-payment-mode:';
export const COMPANY_POM_HK_MPF_PROVIDER_PREFIX =
  'company-pom-hk-mpf-provider:';
export const COMPANY_POM_VN_SHUI_PROVIDER_LABEL_PREFIX =
  'company-pom-vn-shui-provider:';
export const COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_PREFIX =
  'company-pom-id-contribution-for-bpjs-on-salary:';
export const COMPANY_POM_PH_STATUTORY_DEDUCTIONS_LABEL_PREFIX =
  'company-pom-ph-statutory-deductions:';
export const CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_LABEL_PREFIX =
  'calendar-tag-adjustment-method-types:';
export const CALENDAR_TAG_ADJUSTMENT_EVENT_TYPES_LABEL_PREFIX =
  'calendar-tag-adjustment-event-types:';
export const CALENDAR_CONFIG_TRIGGER_POINT_LABEL_PREFIX =
  'calendar-config-trigger-point:';
export const COMPANY_BILLING_ADDRESS_TYPE_LABEL_PREFIX =
  'company-billing-information:';
export const DATE_TYPE_LABEL_PREFIX = 'calendar-event-date-type:';
export const WORKER_SCHEDULE_LABEL_PREFIX = 'worker-schedule:';
export const PAYROLL_STATUS_LABEL_PREFIX = 'payroll-status:';
export const PAYROLL_TYPE_LABEL_PREFIX = 'payroll-type:';

export const DOCUMENTS_FOLDER_DEFAULT = 'documents';

export const DATE_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  DateType,
  DATE_TYPE_LABEL_PREFIX
);

export const ACTIVE_PAYROLL_OPTIONS: Option<CompanyPayrollStatus>[] =
  mapEnumToOptions(CompanyPayrollStatus, PAYROLL_STATUS_LABEL_PREFIX);

export const PAYROLL_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  CompanyPayrollType,
  PAYROLL_TYPE_LABEL_PREFIX
);

export const HIRE_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  HireType,
  HIRE_TYPE_LABEL_PREFIX
);

export const CALENDAR_CONFIG_TRIGGER_POINT_OPTIONS: Option[] = mapEnumToOptions(
  CalendarConfigTriggerPoint,
  CALENDAR_CONFIG_TRIGGER_POINT_LABEL_PREFIX
);

export const COMPANY_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  CompanyStatus,
  COMPANY_STATUS_LABEL_PREFIX
);

export const CALENDAR_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  CalendarStatus,
  CALENDAR_STATUS_LABEL_PREFIX
);

export const CALENDAR_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  CalendarType,
  CALENDAR_TYPE_LABEL_PREFIX
);

export const CALENDAR_PERIOD_OPTIONS: Option[] = mapEnumToOptions(
  CalendarPeriod,
  CALENDAR_PERIOD_LABEL_PREFIX
);

export const CALENDAR_CLIENT_INPUT_DATE_OPTIONS: Option[] = mapEnumToOptions(
  CalendarClientInputDate,
  CALENDAR_CLIENT_INPUT_DATE_PREFIX
);

export const COMPANY_INTEREST_OPTIONS: Option[] = mapEnumToOptions(
  CompanyInterest,
  COMPANY_INTEREST_LABEL_PREFIX
);

export const COMPANY_CATEGORY_OPTIONS: Option[] = mapEnumToOptions(
  CompanyCategory,
  COMPANY_CATEGORY_LABEL_PREFIX
);

export const COMPANY_INDUSTRY_OPTIONS: Option[] = mapEnumToOptions(
  CompanyIndustry,
  COMPANY_INDUSTRY_LABEL_PREFIX
);

export const ENTITY_LINK_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  EntityLinkStatus,
  ENTITY_LINK_STATUS_LABEL_PREFIX
);

export const ENTITY_LINK_OPTIONS: Option[] = mapEnumToOptions(
  EntityLinkOptionsType,
  ENTITY_LINK_OPTIONS_LABEL_PREFIX
);

export const CITIZENSHIP_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  CitizenshipStatus,
  CITIZENSHIP_STATUS_LABEL_PREFIX
);

export const CONTRACT_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  ContractType,
  CONTRACT_TYPE_LABEL_PREFIX
);

export const EMPLOYMENT_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  EmploymentType,
  EMPLOYMENT_TYPE_LABEL_PREFIX
);

export const HIRE_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  HireStatus,
  HIRE_STATUS_LABEL_PREFIX
);

export const SERVICE_AGREEMENTS_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  ServiceAgreementStatus,
  SERVICE_AGREEMENTS_STATUS_LABEL_PREFIX
);

export const WORKPLACE_ADDRESS_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  WorkplaceAddressType,
  WORKPLACE_ADDRESS_TYPE_LABEL_PREFIX
);

export const PAYROLL_CYCLE_OPTIONS: Option[] = mapEnumToOptions(
  PayrollCycle,
  PAYROLL_CYCLE_LABEL_PREFIX
);

export const PRORATE_SALARY_FORMULA_OPTIONS: Option[] = mapEnumToOptions(
  ProrateSalaryFormula,
  PRORATE_SALARY_FORMULA_LABEL_PREFIX
);

export const COMPANY_POM_HK_MPF_PROVIDER_OPTIONS: Option[] = mapEnumToOptions(
  CompanyPomHkMpfProvider,
  COMPANY_POM_HK_MPF_PROVIDER_PREFIX
);

export const COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_OPTIONS: Option[] =
  mapEnumToOptions(
    CompanyPomSgCpfSubmissionPlatform,
    COMPANY_POM_SG_CPF_SUBMISSION_PLATFORM_LABEL_PREFIX
  );

export const COMPANY_POM_SG_CPF_PAYMENT_MODE_OPTIONS: Option[] =
  mapEnumToOptions(
    CompanyPomSgCpfPaymentMode,
    COMPANY_POM_SG_CPF_PAYMENT_MODE_LABEL_PREFIX
  );

export const COMPANY_POM_VN_SHUI_PROVIDER_OPTIONS: Option[] = mapEnumToOptions(
  CompanyPomVnShuiProvider,
  COMPANY_POM_VN_SHUI_PROVIDER_LABEL_PREFIX
);

export const COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_OPTIONS: Option[] =
  mapEnumToOptions(
    CompannyPomIdContributionForBpjsOnSalary,
    COMPANY_POM_ID_CONTRIBUTION_FOR_BPJS_ON_SALARY_PREFIX
  );

export const COMPANY_POM_PH_STATUTORY_DEDUCTIONS_OPTIONS: Option[] =
  mapEnumToOptions(
    CompanyPomPhStatutoryDeductions,
    COMPANY_POM_PH_STATUTORY_DEDUCTIONS_LABEL_PREFIX
  );

export const CALENDAR_TAG_ADJUSTMENT_EVENT_TYPES_OPTIONS: Option[] =
  mapEnumToOptions(
    AdjustmentEvent,
    CALENDAR_TAG_ADJUSTMENT_EVENT_TYPES_LABEL_PREFIX
  );

export const CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_OPTIONS: Option[] =
  mapEnumToOptions(
    AdjustmentMethod,
    CALENDAR_TAG_ADJUSTMENT_METHOD_TYPES_LABEL_PREFIX
  );

export const DATE_OPTIONS = Array(31)
  .fill('')
  .map((_, index) => ({
    id: index + 1,
    label: `${index + 1}`,
  }));

export const MONTHLY_PAYROLL_CYCLE_DATE_OPTIONS = DATE_OPTIONS.filter(
  (option) => option.id === 25 || option.id === 28
);

export const BOOLEAN_YES_LABEL = 'common:yes';
export const BOOLEAN_NO_LABEL = 'common:no';

export const BOOLEAN_OPTIONS: Option[] = [
  {
    id: 1,
    label: BOOLEAN_YES_LABEL,
  },
  {
    id: 0,
    label: BOOLEAN_NO_LABEL,
  },
];

export const COUNTRY_CONSTANT_LABEL_PREFIX = 'country-constant:';
export const PHILIPPINES_CONSTANT_LABEL_PREFIX = `${COUNTRY_CONSTANT_LABEL_PREFIX}ph.`;
export const PHILIPPINES_FIELD_MANAGERIAL_TYPE_LABEL_PREFIX = `${PHILIPPINES_CONSTANT_LABEL_PREFIX}fieldManagerialType.`;

export const PHILIPPINES_FIELD_MANAGERIAL_TYPE_OPTIONS: Option[] =
  mapEnumToOptions(
    PhilippinesFieldManagerialType,
    PHILIPPINES_FIELD_MANAGERIAL_TYPE_LABEL_PREFIX
  );

export const HIRING_COUNTRIES = [
  CountryCode.HONGKONG,
  CountryCode.INDONESIA,
  CountryCode.MALAYSIA,
  CountryCode.PHILIPPINES,
  CountryCode.SINGAPORE,
  CountryCode.THAILAND,
  CountryCode.VIETNAM,
];

export const SINGAPORE: CountryOption = {
  id: 192,
  code: CountryCode.SINGAPORE,
  label: 'Singapore',
};

export const COMPANY_MASTER_AGREEMENT_TEMPLATE = 'company-master';
export const PEO_CONTRACT_AGREEMENT_TEMPLATE_PREFIX = 'peo-contract-';
export const EOR_CONTRACT_AGREEMENT_TEMPLATE_PREFIX = 'eor-contract-';

export const GENDER_OPTION: Option[] = mapEnumToOptions(
  Gender,
  GENDER_LABEL_PREFIX
);

export const RELIGION_OPTIONS: Option[] = mapEnumToOptions(
  Religion,
  RELIGION_LABEL_PREFIX
);

export const RACE_OPTIONS: Option[] = mapEnumToOptions(Race, RACE_LABEL_PREFIX);
export const MARITAL_STATUS_OPTIONS: Option[] = mapEnumToOptions(
  MaritalStatus,
  MARITAL_LABEL_STATUS_PREFIX
);

export const PERMIT_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  PermitType,
  PERMIT_TYPE_LABEL_PREFIX
);

export const EMERGENCY_CONTACT_RELATION_OPTIONS: Option[] = mapEnumToOptions(
  EmergencyContactRelationship,
  EMERGENCY_CONTACT_RELATIONSHIP_PREFIX
);

export const COMPLIANCE_EXTERNAL_URLS = {
  tou: 'https://ayp-group.com/terms-of-services/',
  privacy: 'https://ayp-group.com/privacy-policy/',
  pdpa: 'https://ayp-group.com/pdpa/',
};

export const SERVICE_AGREEMENT_OPTIONS: Option[] = mapEnumToOptions(
  ServiceAgreementType,
  SERVICE_AGREEMENT_LABEL_PREFIX
);

export const COMPANY_BILLING_ADDRESS_TYPE_OPTIONS: Option[] = mapEnumToOptions(
  CompanyBillingAddressType,
  COMPANY_BILLING_ADDRESS_TYPE_LABEL_PREFIX
);

export const WORKER_SCHEDULE_OPTIONS: Option[] = mapEnumToOptions(
  WorkerScheduleType,
  WORKER_SCHEDULE_LABEL_PREFIX
);

export * from './default-redirect-routes';
export * from './hiring-country-rules';

import { Address } from './address';
import { UserContext } from './user-context';
import { WorkerBankAccount } from './worker-bank-account';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  WIDOWED = 'WIDOWED',
  DIVORCED = 'DIVORCED',
}

export enum Religion {
  ATHEIST = 'ATHEIST',
  BUDDHISM = 'BUDDHISM',
  CHRISTIANITY = 'CHRISTIANITY',
  HINDUISM = 'HINDUISM',
  ISLAM = 'ISLAM',
  JUDAISM = 'JUDAISM',
  SIKHISM = 'SIKHISM',
  TAOISM = 'TAOISM',
}

export enum Race {
  ABORIGINE = 'ABORIGINE',
  AFRICAN = 'AFRICAN',
  AMERICAN_INDIAN = 'AMERICAN_INDIAN',
  ARYANS = 'ARYANS',
  BURMESE = 'BURMESE',
  CAUCASIAN = 'CAUCASIAN',
  CHINESE = 'CHINESE',
  DRAVIDIANS = 'DRAVIDIANS',
  ESKIMO = 'ESKIMO',
  EUROPEAN = 'EUROPEAN',
  FILIPINO = 'FILIPINO',
  HAMITES = 'HAMITES',
  HISPANIC = 'HISPANIC',
  HOTTENTOTS = 'HOTTENTOTS',
  INDIAN = 'INDIAN',
  'INDO-CHINESE' = 'INDO-CHINESE',
  ISLANDER = 'ISLANDER',
  JAPANESE = 'JAPANESE',
  JEWISH = 'JEWISH',
  KAREN = 'KAREN',
  KOREAN = 'KOREAN',
  LATINO = 'LATINO',
  MALAY = 'MALAY',
  MAORI = 'MAORI',
  MELANESIANS = 'MELANESIANS',
  MEXICAN = 'MEXICAN',
  MICRONESIAN = 'MICRONESIAN',
  MONGOLIAN = 'MONGOLIAN',
  NEGRITO = 'NEGRITO',
  POLYNESIAN = 'POLYNESIAN',
  SEMITES = 'SEMITES',
  SINHALESE = 'SINHALESE',
  THAI = 'THAI',
  TIBETAN = 'TIBETAN',
  VIETNAMESE = 'VIETNAMESE',
}

export interface WorkerUser {
  id: string;
  hasSetPassword: boolean;
  addressId: Nullable<number>;
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  religion: Religion;
  race: Race;

  // Relations
  userContext: UserContext;
  address: Nullable<Address>;
  bankAccount: Nullable<WorkerBankAccount>;
}

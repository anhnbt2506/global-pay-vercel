export enum EmergencyContactRelationship {
  CHILD = 'CHILD',
  FRIEND = 'FRIEND',
  FATHER = 'FATHER',
  GUARDIAN = 'GUARDIAN',
  MOTHER = 'MOTHER',
  SIBLING = 'SIBLING',
  SPOUSE = 'SPOUSE',
}

export interface WorkerContact {
  id: number;
  workerEmploymentId: number;
  contactNumberCountryCode: Nullable<string>;
  contactNumber: Nullable<string>;
  emergencyContactName: Nullable<string>;
  emergencyContactRelationship: Nullable<EmergencyContactRelationship>;
  emergencyContactNumberCountryCode: Nullable<string>;
  emergencyContactNumber: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}

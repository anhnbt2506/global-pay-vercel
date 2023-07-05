export interface WorkerPhilippines {
  id: number;
  fatherName: Nullable<string>;
  fatherDateOfBirth: Nullable<Date | string>;
  motherName: Nullable<string>;
  motherDateOfBirth: Nullable<Date | string>;
  tinIdFile: Nullable<string>;
  sssIdFile: Nullable<string>;
  birthCertificateFile: Nullable<string>;
  healthIdFile: Nullable<string>;
  hdmfIdFile: Nullable<string>;
  permitIdFile: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkerScheduleType {
  HALF_DAY = 'HALF_DAY',
  FULL_DAY = 'FULL_DAY',
  OFF_DAY = 'OFF_DAY',
}

export interface WorkerSchedule {
  id: number;
  workerEmploymentId: number;
  monday: Nullable<WorkerScheduleType>;
  tuesday: Nullable<WorkerScheduleType>;
  wednesday: Nullable<WorkerScheduleType>;
  thursday: Nullable<WorkerScheduleType>;
  friday: Nullable<WorkerScheduleType>;
  saturday: Nullable<WorkerScheduleType>;
  sunday: Nullable<WorkerScheduleType>;
  createdAt: Date;
  updatedAt: Date;
}

export enum FileUploadStatus {
  READY_TO_UPLOAD = 'READY_TO_UPLOAD',
  UPLOADED_SUCCESSFULLY = 'UPLOADED_SUCCESSFULLY',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  UPLOADING = 'UPLOADING',
}

export type FileKey = string | undefined;

export interface UploadedFile {
  id: string;
  file: File;
  fileKey?: FileKey;
  uploadStatus: FileUploadStatus;
}

import {
  FileManagementBody,
  FileManagementUploadResponse,
  UserSession,
} from '@ayp/typings/commons';

import { BaseApi } from '@utils';

const resourceModel = 'fintech/v1/file-management';

export const FileManagementApi = {
  upload: async (session: UserSession, body: FileManagementBody) =>
    BaseApi.post<FileManagementUploadResponse>({
      path: `/${resourceModel}/upload`,
      session,
      body,
    }),
  get: async (session: UserSession, key: string) =>
    BaseApi.get<{ key: string; presignedUrl: string }>({
      path: `/${resourceModel}/get?key=${key}`,
      session,
    }),
  delete: async (session: UserSession, key: string) =>
    BaseApi.delete({
      path: `/${resourceModel}/delete`,
      session,
      body: { key },
    }),
};

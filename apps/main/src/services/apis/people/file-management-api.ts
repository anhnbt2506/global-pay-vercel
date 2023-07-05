import {
  FileManagementBody,
  FileManagementUploadResponse,
  UserSession,
} from '@ayp/typings/commons';
import { FileManagement } from '@ayp/typings/entities';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/file-management';

export const FileManagementApi = {
  upload: async (session: UserSession, body: FileManagementBody) =>
    BaseApi.post<FileManagementUploadResponse>({
      path: `/${resourceModel}/upload`,
      session,
      body,
    }),
  getList: async (session: UserSession, prefix: string) =>
    BaseApi.get<FileManagement[]>({
      path: `/${resourceModel}/get-list?prefix=${prefix}`,
      session,
    }),
  get: async (session: UserSession, key: string) =>
    BaseApi.get<{ key: string; presignedUrl: string }>({
      path: `/${resourceModel}/get?key=${key}`,
      session,
    }),
};

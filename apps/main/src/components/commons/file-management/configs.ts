import { format } from 'date-fns';
import { FileManagement } from '@ayp/typings/entities';

import {
  DEFAULT_DATE_FORMAT,
  GP_BACKEND_TIME_FORMAT,
} from '@configs/constants';

export const QUERY_PARAM_FOLDER = 'folder';
export const ADDENDUM_FOLDER = 'addendum';

export enum FileManagementObjectType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export type FileManagementTableData = {
  key: string;
  type: string;
  lastModified?: string;
  lastModifiedBy?: string;
  labelKey: string;
}[];

export const mapDataForTable = (
  data: Nullable<FileManagement[]>,
  filePrefix: string,
  translationPrefix: Nullable<string>
): FileManagementTableData =>
  data
    ? data.map((item) => {
        let key = (item.key ? item.key : item.filePath ?? '').replace(
          filePrefix,
          ''
        ) as string;
        if (key.endsWith('/')) {
          key = key.slice(0, -1);
        }
        const labelKey = translationPrefix
          ? `${translationPrefix}${key.split('/').pop()}`
          : key
              .split('/')
              .filter((item) => item)
              .join('.');
        const lastModified = item.lastModified
          ? format(
              new Date(item.lastModified),
              `${DEFAULT_DATE_FORMAT} ${GP_BACKEND_TIME_FORMAT}`
            )
          : '-';
        const lastModifiedBy = item.lastModifiedBy
          ? `${item.lastModifiedBy.firstName} ${item.lastModifiedBy.lastName}`
          : '-';

        return {
          ...item,
          name: key.split('/').pop(),
          key,
          labelKey,
          lastModified,
          lastModifiedBy,
        };
      })
    : [];

/** e.g mapBreadcumbData
  input: documents/POM/SG/
  output: [
    {
      "key": "documents",
      "labelKey": "documents"
    },
    {
      "key": "documents/POM",
      "labelKey": "documents.POM"
    },
    {
      "key": "documents/POM/SG",
      "labelKey": "documents.POM.SG"
    }
  ] 
*/
export const mapBreadcumbData = (
  folder: string
): {
  key: string;
  labelKey: string;
}[] =>
  folder
    .split('/')
    .filter((item) => item)
    .map((item) => {
      const folderKey = folder.slice(0, folder.indexOf(item) + item.length);
      return {
        key: folderKey,
        labelKey: folderKey.replaceAll('/', '.'),
      };
    });

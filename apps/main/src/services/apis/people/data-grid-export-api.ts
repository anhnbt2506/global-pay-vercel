import { Query, UserSession } from '@ayp/typings/commons';
import { constructDataGridExportParameters } from '@ayp/utils';

import { BaseApi } from '@utils';

const resourceModel = 'people/v1/export';

export const DataGridExportApi = {
  exportDataGrid: async <
    T,
    A extends string,
    F extends string,
    S extends string
  >(
    session: UserSession,
    context: T,
    parameters: Omit<Query<A, F, S>, 'page' | 'pageSize'>
  ) =>
    BaseApi.post({
      path: `/${resourceModel}/data-grid`,
      body: {
        context,
        parameters: constructDataGridExportParameters(parameters),
      },
      session,
    }),
};

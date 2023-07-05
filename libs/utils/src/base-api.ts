import { ErrorResponse, UserSession } from '@ayp/typings/commons';
import axios, { AxiosError } from 'axios';
import memoizee from 'memoizee';

export type BaseErrorResponse = ErrorResponse | any;

interface BaseApiAttributes {
  path: string;
  raw?: boolean;
  body?: unknown;
  params?: unknown;
  session?: UserSession;
  headers?: Record<string, string>;
}

const getHeaders = (
  session: UserSession,
  customHeaders?: Record<string, string>
) =>
  Object.assign(
    {
      'app-id': 'gp',
      'content-type': 'application/json',
    },
    /* istanbul ignore next */
    session &&
      Object.assign(
        {
          'access-token': session.accessToken,
          authorization: session.authorization,
        },
        session?.user?.selectedUserContext?.userContextId && {
          'user-context-id':
            session.user.selectedUserContext.userContextId ?? '',
        }
      ),
    customHeaders
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AxiosClient = (
  errorHandler: (
    e: BaseErrorResponse
  ) => Promise<AxiosError<unknown, BaseErrorResponse>>
) => {
  const instance = axios.create();

  /* istanbul ignore next */
  instance.interceptors.response.use(
    (response) => response,
    (e: AxiosError): Promise<AxiosError> => {
      return errorHandler(e);
    }
  );

  return instance;
};

const BaseApiMemo = memoizee(
  (
    getUrl: (path: string) => string,
    errorHandler: (
      e: BaseErrorResponse
    ) => Promise<AxiosError<unknown, BaseErrorResponse>>
  ): {
    get: <T>(baseApiAttributes: BaseApiAttributes) => Promise<T>;
    post: <T>(baseApiAttributes: BaseApiAttributes) => Promise<T>;
    patch: <T>(baseApiAttributes: BaseApiAttributes) => Promise<T>;
    delete: <T>(baseApiAttributes: BaseApiAttributes) => Promise<T>;
  } => {
    const client = AxiosClient(errorHandler);

    return {
      get: <T>({
        path,
        params,
        raw,
        session = null,
        headers,
      }: BaseApiAttributes): Promise<T> =>
        new Promise((resolve, reject) =>
          client
            .get(getUrl(path), {
              params,
              headers: getHeaders(session, headers),
            })
            .then(({ data }) => resolve(raw ? data : data?.data))
            .catch((e) => {
              reject(e);
            })
        ),
      post: <T>({
        path,
        body,
        raw,
        session = null,
        headers,
      }: BaseApiAttributes): Promise<T> =>
        new Promise((resolve, reject) =>
          client
            .post(getUrl(path), body, { headers: getHeaders(session, headers) })
            .then(({ data }) => resolve(raw ? data : data?.data))
            .catch((e) => reject(e))
        ),
      patch: <T>({
        path,
        body,
        raw,
        session = null,
        headers,
      }: BaseApiAttributes): Promise<T> =>
        new Promise((resolve, reject) =>
          client
            .patch(getUrl(path), body, {
              headers: getHeaders(session, headers),
            })
            .then(({ data }) => resolve(raw ? data : data?.data))
            .catch((e) => reject(e))
        ),
      delete: <T>({
        path,
        body,
        raw,
        session = null,
        headers,
      }: BaseApiAttributes): Promise<T> =>
        new Promise((resolve, reject) =>
          client
            .delete(getUrl(path), {
              headers: getHeaders(session, headers),
              data: body,
            })
            .then(({ data }) => resolve(raw ? data : data?.data))
            .catch((e) => reject(e))
        ),
    };
  }
);

export const BaseApi = BaseApiMemo;

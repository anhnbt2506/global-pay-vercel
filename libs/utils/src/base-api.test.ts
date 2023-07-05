import axios, { AxiosError } from 'axios';

import { BaseApi } from './base-api';

jest.mock('axios');

const axiosCreate = jest.spyOn(axios, 'create');
const axiosGet = jest.spyOn(axios, 'get');
const axiosPost = jest.spyOn(axios, 'post');
const axiosPatch = jest.spyOn(axios, 'patch');

axiosCreate.mockReturnThis();

const dataResponse = {};

const rawDataResponse = {
  data: dataResponse,
};

const apiResponse = {
  data: rawDataResponse,
};

const errorResponse = {
  message: 'Network Error',
  name: 'AxiosError',
  code: 'ERR_NETWORK',
  status: null,
};

const unknownError = new Error('UnknownError');

const getUrl = (path: string) => {
  return path;
};

const errorHandler = async (e: any): Promise<AxiosError<unknown, any>> => {
  return Promise.reject(e);
};

const initAndCallApi = (
  method: string,
  expectResult: any,
  raw: boolean = false,
  isSuccess: boolean = true
) => {
  const baseApi = BaseApi(getUrl, errorHandler);

  const callApi = async () => {
    if (isSuccess) {
      const res = await baseApi[`${method}`]({ path: 'path', raw });
      expect(res).toEqual(expectResult);
    } else {
      try {
        await baseApi[`${method}`]({ path: 'path' });
      } catch (e) {
        expect(e).toEqual(expectResult);
      }
    }
  };

  callApi();
};

describe('baseApi', () => {
  describe('Method GET', () => {
    it('Should return raw response success', () => {
      axiosGet.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('get', rawDataResponse, true);
    });

    it('Should return response success', () => {
      axiosGet.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('get', dataResponse);
    });

    it('Should return response error', () => {
      axiosGet.mockReturnValueOnce(
        new Promise((reject) => {
          reject(errorResponse);
        })
      );

      initAndCallApi('get', errorResponse, false, false);
    });

    it('Should return response Unknown error', () => {
      axiosGet.mockReturnValueOnce(
        new Promise((reject) => {
          throw unknownError;
        })
      );

      initAndCallApi('get', unknownError, false, false);
    });
  });

  describe('Method POST', () => {
    it('Should return raw response success', () => {
      axiosPost.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('post', rawDataResponse, true);
    });

    it('Should return response success', () => {
      axiosPost.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('post', dataResponse);
    });

    it('Should return response error', () => {
      axiosPost.mockReturnValueOnce(
        new Promise((reject) => {
          reject(errorResponse);
        })
      );

      initAndCallApi('post', errorResponse, false, false);
    });

    it('Should return response Unknown error', () => {
      axiosPost.mockReturnValueOnce(
        new Promise(() => {
          throw unknownError;
        })
      );

      initAndCallApi('post', unknownError, false, false);
    });
  });

  describe('Method PATCH', () => {
    it('Should return raw response success', () => {
      axiosPatch.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('patch', rawDataResponse, true);
    });

    it('Should return response success', () => {
      axiosPatch.mockReturnValueOnce(
        new Promise((resolve) => {
          resolve(apiResponse);
        })
      );

      initAndCallApi('patch', dataResponse);
    });

    it('Should return response error', () => {
      axiosPatch.mockReturnValueOnce(
        new Promise((reject) => {
          reject(errorResponse);
        })
      );

      initAndCallApi('patch', errorResponse, false, false);
    });

    it('Should return response Unknown error', () => {
      axiosPatch.mockReturnValueOnce(
        new Promise(() => {
          throw unknownError;
        })
      );

      initAndCallApi('patch', unknownError, false, false);
    });
  });
});

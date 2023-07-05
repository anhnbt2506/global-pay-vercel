/* istanbul ignore file */
// This api is for local backend integration, does not apply for production.

import { Environment } from '@ayp/utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';

import { devSessionFilePath } from '@configs/constants';

export default async function dev(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.send({ error: { code: 403, name: 'Forbidden' } });
  }

  if (!existsSync(devSessionFilePath)) {
    writeFileSync(devSessionFilePath, JSON.stringify({}));
  }

  const path = req.url?.substring(8);
  const session = JSON.parse(readFileSync(devSessionFilePath, 'utf-8'));

  const devHeaders = {
    user: session.user ?? '',
  } as unknown as AxiosRequestHeaders;

  const headers = Object.assign(
    {},
    req.headers,
    req.headers.authorization && devHeaders
  ) as AxiosRequestHeaders;

  const getHost = (path = '') => {
    switch (true) {
      case path.includes('/people'):
        return Environment.getPeopleApiHost();
      case path.includes('/fintech'):
        return Environment.getFintechApiHost();
      default:
        return Environment.getNextAuthUrl();
    }
  };

  try {
    const data = (await axios.call(null, `${getHost(path)}${path}`, {
      headers,
      data: req.body,
      method: req.method as Method,
    })) as AxiosResponse;

    return res.status(data.status).json(data.data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return res.status(e.response?.status ?? 500).json(e.response?.data);
    }

    return e;
  }
}

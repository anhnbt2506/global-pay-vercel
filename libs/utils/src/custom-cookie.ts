import { Stage } from '@ayp/typings/commons';
import { destroyCookie, setCookie } from 'nookies';
import type { NextApiResponse, NextPageContext } from 'next';
import type { CookieSerializeOptions } from 'next/dist/server/web/spec-extension/cookies/types';

import { Environment } from './get-env';

let secure = true;
try {
  secure = ![Stage.DEV.toString(), Stage.DEV_LOCAL.toString()].includes(
    Environment.getStage()
  );
} catch (e) {}

const defaultOptions: CookieSerializeOptions = {
  path: '/',
  secure,
};

export const customSetCookie = (
  ctx:
    | Pick<NextPageContext, 'res'>
    | {
        res: NextApiResponse;
      }
    | {
        res: Response;
      }
    | null
    | undefined,
  name: string,
  value: string,
  options?: CookieSerializeOptions
) => setCookie(ctx, name, value, Object.assign({}, defaultOptions, options));

export const customDestroyCookie = (
  ctx:
    | Pick<NextPageContext, 'res'>
    | {
        res: NextApiResponse;
      }
    | {
        res: Response;
      }
    | null
    | undefined,
  name: string,
  options?: CookieSerializeOptions
) => destroyCookie(ctx, name, Object.assign({}, defaultOptions, options));

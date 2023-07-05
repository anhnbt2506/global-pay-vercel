import { UserSession } from '@ayp/typings/commons';
import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { parseCookies } from 'nookies';

export const getServerSideSession = async (
  context: GetServerSidePropsContext
): Promise<UserSession> => {
  const cookies = parseCookies(context);
  const session = await getSession(context);

  return Object.assign({}, session, cookies);
};

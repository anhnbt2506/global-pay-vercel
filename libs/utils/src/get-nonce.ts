import type { GetServerSidePropsContext, NextPageContext } from 'next';

export const getNonce = (
  ctx: GetServerSidePropsContext | NextPageContext
): string => (ctx.res?.getHeader('x-request-id') as string) ?? '';

import { UserSession } from '.';

type DefaultRouteEventHandler = (
  url: string,
  { shallow }: { shallow: boolean }
) => void;

export type RouteChangeComplete = DefaultRouteEventHandler;

export type RouteChangeStart = DefaultRouteEventHandler;

export type RouteChangeError = (
  err: Error,
  url: string,
  { shallow }: { shallow: boolean }
) => void;

type CustomNextPageProps = {
  nonce?: string;
  isDesktop: boolean;
  session: UserSession;
};

export type NextPage<P = unknown> = import('next').NextPage<
  P & CustomNextPageProps
>;

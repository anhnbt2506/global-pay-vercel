import { useSession } from 'next-auth/react';
import { parseCookies } from 'nookies';
import { useEffect, useMemo, useState } from 'react';

export const useSessionCookies = () => {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<Record<string, string>>({});

  useEffect(() => {
    setCookies(parseCookies());
  }, []);

  const sessionCookies = useMemo(
    () => ({ session: Object.assign({}, session, cookies), status }),
    [session, status, cookies]
  );

  return sessionCookies;
};

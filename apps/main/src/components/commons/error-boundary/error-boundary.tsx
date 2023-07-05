import { useEffect, FC, PropsWithChildren, useCallback } from 'react';
import { useRouter } from 'next/router';

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const handleStorageEvent = useCallback(
    (e: StorageEvent) => {
      try {
        if (e.newValue) {
          const jsonObj = JSON.parse(e.newValue);
          if (jsonObj && jsonObj.data.trigger === 'signout') {
            router.reload();
          }
        }
      } catch (e) {}
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [handleStorageEvent]);

  return <>{children}</>;
};

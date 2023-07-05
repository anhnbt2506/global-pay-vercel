import { ContextProviderLoading } from '@ayp/typings/commons';
import { FC, PropsWithChildren, useCallback, useState } from 'react';

import { Loading } from '@components/commons';

import { FeatureFlagProvider } from './feature-flag';
import { HireStatusProvider } from './hire-status';

const GlobalPayProviders: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [loading, setLoading] = useState<ContextProviderLoading>({
    featureFlagProvider: true,
    hireStatusProvider: true,
  });
  const handleLoading = useCallback((loading: ContextProviderLoading) => {
    setLoading((prevLoading) => Object.assign({}, prevLoading, loading));
  }, []);

  return (
    <FeatureFlagProvider handleLoading={handleLoading}>
      <HireStatusProvider handleLoading={handleLoading}>
        {Object.values(loading).some((value) => value) ? (
          <Loading />
        ) : (
          <>{children}</>
        )}
      </HireStatusProvider>
    </FeatureFlagProvider>
  );
};

export default GlobalPayProviders;

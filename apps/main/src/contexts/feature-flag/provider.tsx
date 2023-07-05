import { ContextProviderLoading } from '@ayp/typings/commons';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { FeatureFlag, FeatureFlagKey } from '@ayp/typings/entities';

import { FeatureFlagApi } from '@services/apis/people';

import Context from './context';

const Provider: FC<
  PropsWithChildren<{
    handleLoading: (loading: ContextProviderLoading) => void;
  }>
> = ({ children, handleLoading }): ReactElement => {
  const [state, setState] = useState<Partial<Record<FeatureFlagKey, boolean>>>(
    {}
  );

  useEffect(() => {
    (async () => {
      try {
        const featureFlags: Record<string, boolean> = {};
        const data = await FeatureFlagApi.get();
        data.featureFlags.map(
          (featureFlag: FeatureFlag) =>
            (featureFlags[featureFlag.key] = featureFlag.value)
        );
        setState(featureFlags);
      } catch (error) {
      } finally {
        handleLoading({ featureFlagProvider: false });
      }
    })();
  }, [handleLoading]);

  const value = state;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;

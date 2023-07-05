import { createContext } from 'react';
import { FeatureFlagKey } from '@ayp/typings/entities';

type Context = Partial<Record<FeatureFlagKey, boolean>>;

const Context = createContext<Context>({});

export default Context;

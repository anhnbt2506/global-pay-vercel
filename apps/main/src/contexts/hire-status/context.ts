import { createContext } from 'react';
import { HireStatus } from '@ayp/typings/entities';

interface Context {
  hireStatus: Nullable<HireStatus>;
  setHireStatus: (hireStatus: HireStatus) => void;
}

const Context = createContext<Context>({
  hireStatus: null,
  setHireStatus: () => {
    return;
  },
});

export default Context;

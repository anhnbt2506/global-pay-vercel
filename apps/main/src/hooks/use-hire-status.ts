import { useContext } from 'react';

import { HireStatusContext } from '@contexts/hire-status';

export const useHireStatus = () => {
  return useContext(HireStatusContext);
};

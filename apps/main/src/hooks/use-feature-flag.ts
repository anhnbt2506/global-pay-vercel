import { useContext } from 'react';

import { FeatureFlagContext } from '@contexts/feature-flag';

export const useFeatureFlag = () => useContext(FeatureFlagContext);

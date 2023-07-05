import * as createCache from '@emotion/cache';

import { createEmotionCache } from '.';

jest.mock('@emotion/cache');

describe('createEmotionCache', () => {
  const createCacheSpy = jest.spyOn(createCache, 'default');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create emotion cache instance', () => {
    createEmotionCache();
    expect(createCacheSpy).toBeCalledWith({ key: 'css', prepend: true });
  });
});

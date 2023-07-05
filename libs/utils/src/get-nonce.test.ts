import { NextPageContext } from 'next';

import { getNonce } from './get-nonce';

describe('getNonce', () => {
  it('should return x-request-id if res is defined', () => {
    const mockXRequestId = '9ecbbd57-9b25-4194-9e9a69f76aee1d3b';

    const ctx = {
      pathname: 'staff/sign-in',
      query: {},
      res: {
        getHeader: () => mockXRequestId,
      },
    } as unknown as NextPageContext;

    expect(getNonce(ctx)).toEqual(mockXRequestId);
  });

  it('should return empty string if res is undefined', () => {
    const ctx: NextPageContext = {
      pathname: 'staff/sign-in',
      query: {},
    } as NextPageContext;

    expect(getNonce(ctx)).toEqual('');
  });
});

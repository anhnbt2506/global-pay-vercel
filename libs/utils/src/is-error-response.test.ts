import { isErrorResponse } from './is-error-response';

describe('isErrorResponse', () => {
  it('should return true when valid error response', () => {
    expect(
      isErrorResponse({
        error: {
          code: 500,
          name: 'UnknownError',
        },
      })
    ).toBe(true);
  });

  it('should return false when response is not an object', () => {
    expect(isErrorResponse('NotValid')).toBe(false);
  });

  it('should return false when object does not contain name property', () => {
    expect(isErrorResponse({ message: 'NotValid' })).toBe(false);
  });
});

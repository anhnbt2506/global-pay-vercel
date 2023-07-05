import * as KnownErrorModule from './known-error';

const KnownError = KnownErrorModule.KnownError;

jest.mock('./known-error');

describe('KnownError', () => {
  const mock = jest.spyOn(KnownErrorModule, 'KnownError');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call constructor when pass in name', () => {
    new KnownError('UnrecognizedError');
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should call constructor when pass in name and message', () => {
    new KnownError('UnrecognizedError', 'test');
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

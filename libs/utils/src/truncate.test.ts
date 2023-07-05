import { truncate } from './truncate';

describe('truncate', () => {
  it('should return full string', () => {
    expect(truncate('Hello')).toEqual('Hello');
  });

  it('should return truncated string', () => {
    expect(truncate('Hello world, my name is NextJs')).toEqual(
      'Hello...s NextJs'
    );
  });
});

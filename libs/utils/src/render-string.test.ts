import { renderString } from '.';

describe('renderString', () => {
  it('should return original string when no token found', () => {
    expect(renderString('hello', {})).toBe('hello');
  });

  it('should return string with the token key when token is not exist on the variables', () => {
    expect(renderString('My name is {{name}}', {})).toBe('My name is name');
  });

  it('should return replaced string with correct variables', () => {
    expect(
      renderString('I am {{name}} from {{city}}', {
        name: 'Alpha',
        city: 'Yogyakarta',
      })
    ).toBe('I am Alpha from Yogyakarta');
  });
});

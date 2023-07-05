import * as nookies from 'nookies';
import { customSetCookie, customDestroyCookie } from '.';

jest.mock('nookies');
describe('customSetCookie', () => {
  const setCookieMock = jest.spyOn(nookies, 'setCookie');

  it('should set the cookie correctly in client size', () => {
    customSetCookie(null, 'contextCompanyId', '6apkge7eoaztagse');

    expect(setCookieMock).toBeCalledWith(
      null,
      'contextCompanyId',
      '6apkge7eoaztagse',
      { path: '/', secure: true }
    );
  });
});

describe('customDestroyCookie', () => {
  const destroyCookieMock = jest.spyOn(nookies, 'destroyCookie');

  it('should destroy the cookie correctly in client size', () => {
    customDestroyCookie(null, 'contextCompanyId');

    expect(destroyCookieMock).toBeCalledWith(null, 'contextCompanyId', {
      path: '/',
      secure: true,
    });
  });
});

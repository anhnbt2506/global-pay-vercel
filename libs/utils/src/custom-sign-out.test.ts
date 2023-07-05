import * as react from 'next-auth/react';
import { customSignOut } from '.';

jest.mock('next-auth/react');

describe('customSignOut', () => {
  const signOutMock = jest.spyOn(react, 'signOut');

  it('should logout then clear cookies in company role', () => {
    customSignOut({ callbackUrl: 'company/sign-in' });

    expect(signOutMock).toBeCalledWith({ callbackUrl: 'company/sign-in' });
  });

  it('should logout then clear cookies in worker role', () => {
    customSignOut({ callbackUrl: 'worker/sign-in' });

    expect(signOutMock).toBeCalledWith({ callbackUrl: 'worker/sign-in' });
  });

  it('should logout then clear cookies in staff role', () => {
    customSignOut({ callbackUrl: 'staff/sign-in' });

    expect(signOutMock).toBeCalledWith({ callbackUrl: 'staff/sign-in' });
  });
});

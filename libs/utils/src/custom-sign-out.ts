import { signOut, SignOutParams } from 'next-auth/react';

export const customSignOut = (options?: SignOutParams<true>) => {
  signOut(options);
};

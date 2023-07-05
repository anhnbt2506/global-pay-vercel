import type { FC, PropsWithChildren } from 'react';
import { Link as MuiLink, SxProps } from '@mui/material';
import { default as NextLink } from 'next/link';

interface LinkProps {
  href: string;
  underline?: 'none' | 'hover' | 'always';
  newTab?: boolean;
  external?: boolean;
  sx?: SxProps;
}

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  href,
  underline,
  newTab,
  external,
  children,
  sx,
  ...props
}) =>
  external ? (
    <MuiLink
      href={href}
      underline={underline || 'hover'}
      {...(newTab && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      sx={sx}
      {...props}
    >
      {children}
    </MuiLink>
  ) : (
    <NextLink href={href} passHref legacyBehavior>
      <MuiLink underline={underline || 'hover'}>{children}</MuiLink>
    </NextLink>
  );

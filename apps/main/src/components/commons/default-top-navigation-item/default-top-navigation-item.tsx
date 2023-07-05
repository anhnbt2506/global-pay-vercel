import {
  customSignOut,
  fireGtmEvent,
  getDefaultRedirectRoute,
} from '@ayp/utils';
import { ExitToApp, Person } from '@mui/icons-material';
import { Avatar, Box, IconButton, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';

import { AnchorMenu } from '@components/ui';
import { DEFAULT_REDIRECT_ROUTES } from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import { useSessionCookies } from '@hooks';

export const DefaultTopNavigationItem: FC<{
  dataTestId?: string;
}> = ({ dataTestId }) => {
  const { t } = useTranslation('common');
  const { session } = useSessionCookies();
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton
        edge="end"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        data-testid={`${dataTestId}-iconButton-avatar`}
      >
        <Avatar>
          <Person />
        </Avatar>
      </IconButton>
      <AnchorMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <MenuItem
          onClick={() => {
            const role = session?.user?.selectedUserContext?.role;

            customSignOut({
              callbackUrl: getDefaultRedirectRoute(
                DEFAULT_REDIRECT_ROUTES,
                role
              ),
            });
            /* istanbul ignore next */
            // this case is unnecessary to test
            fireGtmEvent<GTM_EVENTS>({
              event: role.includes('worker')
                ? GTM_EVENTS.WORKER_PORTAL_LOGOUT
                : role.includes('company')
                ? GTM_EVENTS.CLIENT_PORTAL_LOGOUT
                : GTM_EVENTS.STAFF_PORTAL_LOGOUT,
            });
          }}
          data-testid={`${dataTestId}-logout`}
        >
          <ExitToApp fontSize="small" color="primary" />
          <Typography marginLeft="0.5rem">
            {t('topNavigation.logout')}
          </Typography>
        </MenuItem>
      </AnchorMenu>
    </Box>
  );
};

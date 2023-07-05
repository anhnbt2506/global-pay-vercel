import { fireGtmEvent } from '@ayp/utils';
import { useRouter } from 'next/router';
import { Notifications, RateReview } from '@mui/icons-material';
import { Badge, IconButton, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction } from 'react';

import { AnchorMenu } from '@components/ui';
import { WORKER_EMPLOYMENT_CONTRACT } from '@configs/routes';
import { GTM_EVENTS } from '@configs/constants/gtm-events';

import { TopNavigationAnchorId } from './top-navigation';

interface WorkerCustomProps {
  anchorEl: Nullable<Element>;
  idElement: Nullable<TopNavigationAnchorId>;
  setAnchorEl: Dispatch<SetStateAction<Nullable<Element>>>;
  onHandleClick: (
    idElement: TopNavigationAnchorId
  ) => (event: React.MouseEvent<HTMLElement>) => void;
  dataTestId: string;
}

export const WorkerCustom: FC<WorkerCustomProps> = ({
  anchorEl,
  idElement,
  setAnchorEl,
  onHandleClick,
  dataTestId,
}: WorkerCustomProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      <IconButton
        id="11"
        edge="end"
        sx={{
          marginRight: '1rem',
        }}
        onClick={onHandleClick(TopNavigationAnchorId.NOTIFICATIONS)}
        data-testid={`${dataTestId}-iconButton`}
      >
        <Badge
          badgeContent={1}
          color="error"
          overlap="circular"
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
        >
          <Notifications fontSize="large" color="primary" />
        </Badge>
      </IconButton>
      <AnchorMenu
        open={!!anchorEl && idElement === TopNavigationAnchorId.NOTIFICATIONS}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      >
        <MenuItem
          onClick={() => {
            router.push(WORKER_EMPLOYMENT_CONTRACT.path);
            fireGtmEvent<GTM_EVENTS>({
              event: GTM_EVENTS.WORKER_PORTAL_SIGN_CONTRACT,
            });
          }}
          data-testid={`${dataTestId}-${WORKER_EMPLOYMENT_CONTRACT.path}`}
        >
          <RateReview fontSize="small" color="primary" />
          <Typography marginLeft="0.5rem">
            {t('topNavigation.signContract')}
          </Typography>
        </MenuItem>
      </AnchorMenu>
    </>
  );
};

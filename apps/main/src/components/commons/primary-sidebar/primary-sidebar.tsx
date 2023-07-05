import { MuiIcon, Route } from '@ayp/typings/commons';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FC, Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { NextRouter, useRouter } from 'next/router';

import { useFeatureFlag, useSessionCookies } from '@hooks';
import { GlobalPayLogo } from '@assets/shared';
import { SIDEBAR_WIDTH } from '@configs/constants';
import { DynamicIcon } from '@components/ui';
import { COMPANY_DASHBOARD } from '@configs/routes';

import { getSidebarItems } from './config';

const Item: FC<{ icon?: MuiIcon; label: string; isParent?: boolean }> = ({
  icon,
  label,
  isParent,
}) => {
  const { t } = useTranslation('common');

  return (
    <>
      <ListItemIcon
        sx={{
          minWidth: 'unset',
          marginRight: '0.5rem',
        }}
      >
        {icon && <DynamicIcon name={icon} color="primary" />}
      </ListItemIcon>
      <ListItemText
        primary={t(label)}
        primaryTypographyProps={{
          marginLeft: !icon ? '1.75rem' : 0,
          fontWeight: isParent ? 'bold' : 'unset',
        }}
      />
    </>
  );
};

const MenuItem: FC<{ item: Route; isChild?: boolean; dataTestId?: string }> = ({
  item,
  isChild,
  dataTestId,
}) => {
  const router = useRouter();

  return item.children ? (
    <MultiLevel
      item={item}
      router={router}
      dataTestId={`${dataTestId}-multiLevel`}
    />
  ) : (
    <SingleLevel
      item={item}
      router={router}
      isParent={!isChild}
      dataTestId={`${dataTestId}-singleLevel`}
    />
  );
};

const isWhitelistedRoutes = (router: NextRouter, path: string) => {
  const whitelistedRoutes = [COMPANY_DASHBOARD.path];

  return router.pathname === path || whitelistedRoutes.includes(path);
};

const SingleLevel: FC<{
  item: Route;
  router: NextRouter;
  isParent?: boolean;
  dataTestId?: string;
}> = ({
  router,
  isParent,
  item: { path, icon, label = '', newTab },
  dataTestId,
}) => (
  <ListItemButton
    selected={router.pathname === path}
    data-testid={`${dataTestId}${path.replace(/\//g, '-')}`}
    onClick={() => {
      if (isWhitelistedRoutes(router, path)) {
        window.location.href = path;
      } else {
        if (newTab) {
          window.open(path, '_blank');
        } else {
          router.push(path);
        }
      }
    }}
    sx={(theme) => ({
      color: isParent ? 'unset' : theme.palette.text.primary,
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    })}
  >
    <Item icon={icon} label={label} isParent={isParent} />
  </ListItemButton>
);

const MultiLevel: FC<{
  item: Route;
  router: NextRouter;
  dataTestId?: string;
}> = ({ router, item: { icon, label = '', children = [] }, dataTestId }) => {
  const [open, setOpen] = useState(false);
  const onClick = () => setOpen(() => !open);

  useEffect(() => {
    children.some((child) => {
      if (child.path === router.pathname) {
        setOpen(true);
      }
    });
  }, [children, router.pathname]);

  return (
    <>
      <ListItem
        button
        onClick={onClick}
        data-testid={`${dataTestId}-${label.split('.').join('-')}`}
      >
        <Item icon={icon} label={label} isParent />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child) => (
            <MenuItem
              key={child.path}
              item={child}
              isChild
              dataTestId={dataTestId}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

interface PrimarySidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: VoidFunction;
  dataTestId?: string;
}

export const PrimarySidebar: FC<PrimarySidebarProps> = ({
  isOpen,
  onClose,
  isDesktop,
  dataTestId,
}) => {
  const { session } = useSessionCookies();
  const featureFlag = useFeatureFlag();

  const sidebarItems = getSidebarItems(
    session?.user?.selectedUserContext?.role,
    featureFlag
  );

  return (
    <Box component="nav">
      <Drawer
        open={isOpen}
        onClose={onClose}
        variant={isDesktop ? 'permanent' : 'temporary'}
        ModalProps={{
          keepMounted: !isDesktop,
        }}
        sx={{
          display: {
            xs: isDesktop ? 'none' : 'block',
            lg: isDesktop ? 'block' : 'none',
          },
          '& .MuiDrawer-paper': {
            width: `${SIDEBAR_WIDTH}rem`,
            boxShadow: (theme) => theme.palette.customs.boxShadow,
            marginTop: `${isDesktop ? 4 : 0}rem`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            width={125}
            height={125}
            src={GlobalPayLogo}
            alt="ayp-logo-with-slogan"
          />
        </Box>
        <List>
          {sidebarItems.map((item, index) => (
            <Fragment key={index}>
              {!index && <Divider />}
              <MenuItem item={item} dataTestId={`${dataTestId}-menuItem`} />
              <Divider />
            </Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

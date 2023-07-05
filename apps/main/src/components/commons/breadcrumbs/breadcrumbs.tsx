import { FC, useMemo } from 'react';
import {
  Breadcrumbs as MBreadcrumbs,
  Typography,
  Link,
  Box,
} from '@mui/material';
import { TFunction } from 'next-i18next';
import { NavigateBefore } from '@mui/icons-material';

interface BreadCrumbItemProps {
  to?: string | null;
  name: string;
  onClick?: VoidFunction;
  dataTestId?: string;
}

interface BreadCrumbsProps {
  t: TFunction;
  breadCrumbItems: BreadCrumbItemProps[]; //eg: list ={[{name: 'Payroll Dashboard', to:'/staff/payroll/dashboard'}]}
}

export const BreadCrumbs: FC<BreadCrumbsProps> = ({ breadCrumbItems }) => {
  const renderLinkBR = useMemo(() => {
    const breadcrumbs = breadCrumbItems.map((item) => {
      const linkProps =
        item.to && !item.onClick
          ? { href: item.to }
          : { component: 'div', onClick: item.onClick };

      return (
        <Link
          {...linkProps}
          key={item.name}
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:active, &:hover': {
              cursor: 'pointer',
            },
          }}
          data-testid={`${item.dataTestId}`}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            {item.name}
          </Typography>
        </Link>
      );
    });

    /* istanbul ignore next*/
    // Can not reproduce
    if (!breadcrumbs.length) return breadcrumbs;

    //add the navigate before icon in front of the first breadcrumb
    breadcrumbs[0] = (
      <Box
        sx={{
          display: 'flex',
        }}
        key="initial"
      >
        <NavigateBefore
          sx={(theme) => ({
            color: theme.palette.primary.main,
            fontSize: '1.2rem',
            marginLeft: '-0.4rem',
          })}
        />
        {breadcrumbs[0]}
      </Box>
    );

    return breadcrumbs;
  }, [breadCrumbItems]);

  return (
    <MBreadcrumbs
      separator={
        <NavigateBefore
          sx={(theme) => ({
            color: theme.palette.primary.main,
            fontSize: '1.2rem',
          })}
        />
      }
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-li': {
          display: 'flex',
          justifyItems: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      {renderLinkBR}
    </MBreadcrumbs>
  );
};

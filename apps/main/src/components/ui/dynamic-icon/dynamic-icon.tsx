import { MuiIcon } from '@ayp/typings/commons';
import { SvgIconProps } from '@mui/material';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

// TODO: Convert to dynamic import

interface DynamicIconProps extends SvgIconProps {
  name: MuiIcon;
}

export const DynamicIcon: FC<DynamicIconProps> = ({ name, ...rest }) => {
  switch (name) {
    case 'Article':
      return <Article {...rest} />;
    case 'Build':
      return <Build {...rest} />;
    case 'Dashboard':
      return <Dashboard {...rest} />;
    case 'Email':
      return <Email {...rest} />;
    case 'People':
      return <People {...rest} />;
    case 'PersonPin':
      return <PersonPin {...rest} />;
    case 'SchoolIcon':
      return <SchoolIcon {...rest} />;
    case 'SupportAgent':
      return <SupportAgent {...rest} />;
    case 'Sync':
      return <Sync {...rest} />;
    case 'Monetization':
      return <Monetization {...rest} />;
    default:
      return <></>;
  }
};

const Article = dynamic(() => import('@mui/icons-material/Article'));

const Build = dynamic(() => import('@mui/icons-material/Build'));

const Dashboard = dynamic(() => import('@mui/icons-material/Dashboard'));

const Email = dynamic(() => import('@mui/icons-material/Email'));

const People = dynamic(() => import('@mui/icons-material/People'));

const PersonPin = dynamic(() => import('@mui/icons-material/PersonPin'));

const SchoolIcon = dynamic(() => import('@mui/icons-material/School'));

const SupportAgent = dynamic(() => import('@mui/icons-material/SupportAgent'));

const Sync = dynamic(() => import('@mui/icons-material/Sync'));

const Monetization = dynamic(
  () => import('@mui/icons-material/MonetizationOnOutlined')
);

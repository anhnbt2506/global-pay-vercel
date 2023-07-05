import { Link } from '@components/ui';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import type { FC } from 'react';

interface InformationCardProps {
  description: string;
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  dataTestId?: string;
  onClick?: () => void;
}

export const InformationCard: FC<InformationCardProps> = ({
  description,
  disabled,
  hidden,
  href = '',
  dataTestId,
  onClick,
}) => {
  const button = (
    <Button
      disabled={disabled}
      sx={{
        backgroundColor: (theme) => theme.palette.customs.alertBackground,
        width: '100%',
        padding: '0.5rem 0.5rem 0.5rem 0.5rem',
        borderRadius: '0.25rem',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.customs.alertBackground,
          '& .MuiGrid-root h5': {
            color: (theme) => theme.palette.primary.main,
          },
        },
      }}
      data-testid={dataTestId}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <InfoOutlined
          sx={(theme) => ({
            fontSize: '1.2rem',
            color: theme.palette.primary.main,
            marginTop: '0.2rem',
            strokeWidth: 1,
          })}
        />
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            textAlign: 'left',
            color: theme.palette.customs.alertDescription,
            marginLeft: '0.5rem',
          })}
        >
          {description}
        </Typography>
      </Box>
    </Button>
  );

  return hidden ? (
    <></>
  ) : disabled ? (
    <>{button}</>
  ) : (
    <Link newTab external underline="none" href={href}>
      {button}
    </Link>
  );
};

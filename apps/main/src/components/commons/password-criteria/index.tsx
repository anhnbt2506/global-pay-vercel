import { validatePasswordRequirement } from '@ayp/utils';
import { Circle, CircleOutlined } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { FC } from 'react';
import { TFunction } from 'next-i18next';

const passwordCriterias = ['lowercase', 'uppercase', 'digits', 'min'];

const sx = {
  fontSize: '0.75rem',
  marginRight: '0.5rem',
};

export const PasswordCriteria: FC<{ t: TFunction; password: string }> = ({
  t,
  password,
}) => {
  const validationResult = validatePasswordRequirement(password);

  const renderCircle = (isOutlined: boolean) => {
    if (isOutlined)
      return (
        <CircleOutlined
          sx={{
            ...sx,
            color: (theme) => theme.palette.text.secondary,
          }}
        />
      );

    return (
      <Circle
        sx={{
          ...sx,
          color: (theme) => theme.palette.primary.main,
        }}
      />
    );
  };

  return (
    <Grid item container xs={12}>
      {passwordCriterias.map((item, index) => (
        <Grid key={index} item xs={6} display="flex" alignItems="center">
          {renderCircle(validationResult.includes(item))}
          <Typography variant="subtitle1">
            {t(`password-criteria:${item}`)}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

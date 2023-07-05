import { Box } from '@mui/material';
import { TFunction } from 'i18next';
import type { FC } from 'react';

import { ButtonSubmit } from '@components/ui';

export interface CtaButtonProps {
  t: TFunction;
  isDesktop: boolean;
}

const CtaButton: FC<CtaButtonProps> = ({ t, isDesktop }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      marginY="1rem"
      flexDirection={isDesktop ? 'row' : 'column'}
    >
      <ButtonSubmit
        variant="contained"
        fullWidth={!isDesktop}
        sx={{
          paddingX: '2rem',
        }}
        data-testid="companySignUp-submitButton"
      >
        {t('createAccount')}
      </ButtonSubmit>
    </Box>
  );
};
export default CtaButton;

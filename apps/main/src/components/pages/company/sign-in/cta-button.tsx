import type { FC } from 'react';
import { Box } from '@mui/material';

import { ButtonSubmit } from '@components/ui';

export interface CtaButtonProps {
  isDesktop: boolean;
  actionName: string;
}

const CtaButton: FC<CtaButtonProps> = ({ isDesktop, actionName }) => {
  return (
    <Box
      display="flex"
      marginY="1rem"
      justifyContent="center"
      flexDirection={isDesktop ? 'row' : 'column'}
    >
      <ButtonSubmit
        variant="contained"
        fullWidth={!isDesktop}
        sx={{
          paddingX: '3rem',
        }}
        data-testid="companySignIn-submitButton"
      >
        {actionName}
      </ButtonSubmit>
    </Box>
  );
};
export default CtaButton;

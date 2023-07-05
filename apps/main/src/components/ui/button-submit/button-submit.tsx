import { useFormikContext } from 'formik';
import { FC, useMemo } from 'react';
import { Box, Button, ButtonProps, CircularProgress } from '@mui/material';

interface ButtonSubmitProps extends ButtonProps {
  loading?: boolean;
}
export const ButtonSubmit: FC<ButtonSubmitProps> = ({
  children,
  loading,
  ...props
}) => {
  const { isSubmitting } = useFormikContext();
  const isSubmittingOrLoading = isSubmitting || loading;

  const buttonSubmit = useMemo(
    () => (
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Button type="submit" disabled={isSubmittingOrLoading} {...props}>
          {children}
        </Button>
        {isSubmittingOrLoading && (
          <CircularProgress
            size={24}
            sx={{
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
              position: 'absolute',
            }}
          />
        )}
      </Box>
    ),
    [children, isSubmittingOrLoading, props]
  );

  return buttonSubmit;
};

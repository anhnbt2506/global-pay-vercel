import { useState } from 'react';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const DecryptedText = ({
  text,
  isDecrypted,
}: {
  text: string;
  isDecrypted: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  if (isDecrypted) {
    const decryptedValue = text.replace(/./g, '*');

    return (
      <>
        {visible ? text : decryptedValue}
        <IconButton
          onClick={() => setVisible(!visible)}
          sx={{ padding: 0, marginLeft: '1rem' }}
        >
          {visible ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      </>
    );
  }

  return <>{text}</>;
};

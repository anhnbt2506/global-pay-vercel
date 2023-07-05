import type { FC } from 'react';
import { useEffect } from 'react';
import { Container } from '@mui/material';
import { renderString } from '@ayp/utils';

interface LegalDocument {
  content: string;
  print?: boolean;
  variables?: Record<string, unknown>;
  dataTestId?: string;
}

let hasPrinted = false;

export const LegalDocument: FC<LegalDocument> = ({
  content,
  print,
  variables,
  dataTestId,
}) => {
  useEffect(() => {
    if (print && !hasPrinted) {
      window.print();
      hasPrinted = true;
    }
  }, [print]);

  return (
    <Container
      maxWidth={false}
      sx={{
        paddingTop: '1rem',
      }}
      data-testid={dataTestId}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: variables ? renderString(content, variables) : content,
        }}
      />
    </Container>
  );
};

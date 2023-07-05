import { WorkerEmploymentValidateCsvError } from '@ayp/typings/commons';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction } from 'next-i18next';
import { FC, PropsWithChildren, ReactElement } from 'react';

export const CellDataGrid: FC<
  PropsWithChildren<{
    params: GridRenderCellParams;
    validationCsvErrors: WorkerEmploymentValidateCsvError[];
    t: TFunction;
    tooltipTitle?: string;
  }>
> = ({ children, params, validationCsvErrors, t, tooltipTitle }) => {
  const initialChildren = (
    <Box data-testid={`${params.id}-${params.field}`}>
      {tooltipTitle ? (
        <Tooltip placement="bottom-start" title={tooltipTitle}>
          {children as ReactElement}
        </Tooltip>
      ) : (
        /* istanbul ignore next */
        // this case doesn't necessary to test
        children
      )}
    </Box>
  );

  if (!validationCsvErrors.length) return <>{initialChildren}</>;

  const error =
    validationCsvErrors.find(
      (error) =>
        error.row === params.id &&
        error.messages &&
        error.messages[params.field]
    ) ?? null;

  return (
    <>
      {!!error && (
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: (theme) => theme.palette.error.main,
              },
            },
          }}
          title={t('common:dataGrid.pleaseUpdateValue')}
        >
          <ErrorOutline
            sx={{
              marginRight: '0.5rem',
              color: (theme) => theme.palette.error.main,
            }}
            data-testid={`${params.id}-${params.field}-errorTooltip`}
          />
        </Tooltip>
      )}
      {initialChildren}
    </>
  );
};

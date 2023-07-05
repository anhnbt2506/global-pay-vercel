import { NavigateNext, Source } from '@mui/icons-material';
import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { I18n, TFunction } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';

import { mapBreadcumbData } from '../configs';

interface BreadCrumbsProps {
  t: TFunction;
  i18n: I18n;
  tPrefix: string;
  currentFolderKey: string; //e.g documents/POM/SG/
  setCurrentFolderKey: Dispatch<SetStateAction<string>>;
  handleFetchData: (path: string) => Promise<void>;
  dataTestId?: string;
}

const BreadCrumbs: FC<BreadCrumbsProps> = ({
  t,
  i18n,
  tPrefix,
  currentFolderKey,
  handleFetchData,
  setCurrentFolderKey,
  dataTestId,
}) => {
  const breadCrumbsArray = useMemo(
    () => mapBreadcumbData(currentFolderKey),
    [currentFolderKey]
  );

  const getBreadCrumbLabel = useCallback(
    (labelKey: string) => {
      const formula = `${tPrefix}:${labelKey}.label`;

      if (i18n.exists(formula)) {
        return t(formula);
      }

      return labelKey.split('.').pop();
    },
    [t, tPrefix, i18n]
  );

  const breadCrumbs = useMemo(
    () =>
      breadCrumbsArray.map((item, index) => (
        <Link
          underline="none"
          key={`key${index}`}
          color="inherit"
          component="div"
          onClick={() => {
            setCurrentFolderKey(item.key);
            handleFetchData(item.key);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '0.25rem',
            pointerEvents:
              index === breadCrumbsArray.length - 1 ? 'none' : 'auto',
            '&:active, &:hover': {
              cursor:
                index === breadCrumbsArray.length - 1 ? 'auto' : 'pointer',
            },
          }}
          data-testid={`${dataTestId}-${index}`}
        >
          <Source
            sx={(theme) => ({
              mr: '0.5rem',
              color:
                index === breadCrumbsArray.length - 1
                  ? theme.palette.text.primary
                  : 'inherit',
            })}
          />
          <Typography
            sx={(theme) => ({
              fontWeight: 'bold',
              color:
                index === breadCrumbsArray.length - 1
                  ? theme.palette.text.primary
                  : 'inherit',
            })}
          >
            {getBreadCrumbLabel(breadCrumbsArray[index].labelKey)}
          </Typography>
        </Link>
      )),
    [
      breadCrumbsArray,
      dataTestId,
      getBreadCrumbLabel,
      handleFetchData,
      setCurrentFolderKey,
    ]
  );

  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadCrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadCrumbs;

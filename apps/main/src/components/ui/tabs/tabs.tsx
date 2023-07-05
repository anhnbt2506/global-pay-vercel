import { Option } from '@ayp/typings/ui';
import { Box, Tab, Tabs as MuiTabs, Typography } from '@mui/material';
import { TabsProps } from '@mui/material/Tabs';
import { useRouter } from 'next/router';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';

interface ThemeTabsProps<S> extends Omit<TabsProps, 'onChange'> {
  tabs: Option<S>[];
  value: string | number;
  fallback: S;
  setTab: Dispatch<SetStateAction<S>>;
}

export const Tabs = <S extends string>({
  tabs = [],
  value,
  setTab,
  fallback,
  ...rest
}: PropsWithChildren<ThemeTabsProps<S>>) => {
  const { pathname, query } = useRouter();

  const onChange = useCallback(
    (val: S, isUseReplaceState?: boolean, keepOtherQuery?: boolean) => {
      let path = '';
      let queryString = `tab=${val}`;

      for (const [key, value] of Object.entries(query)) {
        if (typeof value != 'string') break;

        if (pathname.includes(`[${key}]`)) {
          path = pathname.replace(`[${key}]`, value);

          continue;
        }

        if (key !== 'tab' && keepOtherQuery) {
          queryString = `${queryString}&${key}=${value}`;
        }
      }

      path = `${path.length ? path : pathname}?${queryString}`;

      setTab(val);

      const data = {
        ...window.history.state,
        url: path,
        as: path,
      };

      isUseReplaceState
        ? window.history.replaceState(data, '', path)
        : window.history.pushState(data, '', path);
    },
    [pathname, query, setTab]
  );

  useEffect(() => {
    if (!tabs.length) return;

    if (query?.tab && typeof query.tab === 'string') {
      if (tabs.some((tab) => tab.value === query.tab)) {
        return onChange(query?.tab as unknown as S, true, true);
      }
    }

    return onChange(fallback as S, true, true);
  }, [tabs, query.tab, fallback, onChange]);

  const renderTab = () =>
    tabs.map((tab) => (
      <Tab
        key={tab.id}
        value={tab.value}
        label={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              {tab.label || ''}
            </Typography>
            {tab.hasOwnProperty('count') ? (
              <Typography
                sx={{
                  paddingLeft: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >{` (${tab.count})`}</Typography>
            ) : (
              <></>
            )}
          </Box>
        }
        sx={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
        }}
      />
    ));

  return (
    <MuiTabs
      value={value}
      onChange={(_, val) => onChange(val)}
      scrollButtons="auto"
      {...rest}
      sx={{
        textTransform: 'capitalize',
        '& .MuiTabs-indicator': {
          backgroundColor: (theme) => theme.palette.primary.main,
          height: '0.15rem',
        },
      }}
    >
      {renderTab()}
    </MuiTabs>
  );
};

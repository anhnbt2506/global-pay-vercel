import { Filter, SortBy, SortByOperator } from '@ayp/typings/commons';
import { constructFilter } from '@ayp/utils';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import type { DataGridProps as MuiDataGridProps } from '@mui/x-data-grid';
import {
  DataGrid as MuiDataGrid,
  GridFeatureMode,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { DEFAULT_PAGE_SIZE } from '@configs/constants';

import { AnchorMenu } from '..';

const DynamicFilterToolbar = dynamic(
  () => import('@components/ui/filter-toolbar')
);

const DynamicSearchToolbar = dynamic(
  () => import('@components/ui/search-toolbar')
);

interface DataGridProps<F, S> extends MuiDataGridProps {
  setSortBy?: Dispatch<SetStateAction<S>>;
  filters?: F;
  setFilters?: Dispatch<SetStateAction<F>>;
  menuItems?: JSX.Element[];
  useSearchFilter?: boolean;
  searchFilterPlaceholder?: string;
  searchFilterColumnField?: string;
  searchFilterOperatorValue?: string;
  sortingOrder?: SortByOperator[];
  dataTestId?: string;
}

const NoResultsOverlay = () => {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {t('dataGrid.noResults')}
    </Box>
  );
};

export const DataGrid = <
  F extends Filter<string>[],
  S extends SortBy<string> = SortBy<string>
>({
  rows,
  columns,
  menuItems,
  components,
  filterMode,
  filters,
  setFilters,
  setSortBy,
  initialState,
  useSearchFilter,
  searchFilterPlaceholder,
  searchFilterColumnField,
  searchFilterOperatorValue,
  sortingOrder = [SortByOperator.DESC, SortByOperator.ASC],
  dataTestId = '',
  ...rest
}: PropsWithChildren<DataGridProps<F, S>>) => {
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const onFilterModelChange = useCallback((filterModel: GridFilterModel) => {
    setFilterModel(filterModel);
  }, []);

  const onSearchFilterModelChange = useCallback(
    (searchValue: string) => {
      if (searchFilterColumnField && searchFilterOperatorValue) {
        setFilterModel({
          items: [
            {
              value: searchValue,
              field: searchFilterColumnField,
              operator: searchFilterOperatorValue,
            },
          ],
        });
      }
    },
    [searchFilterColumnField, searchFilterOperatorValue]
  );

  useEffect(() => {
    if (setFilters && filterModel.items.length) {
      setFilters([constructFilter(filterModel)] as F);
    }
  }, [setFilters, filterModel]);

  useEffect(() => {
    if (useSearchFilter) {
      onSearchFilterModelChange(searchValue);
    }
  }, [searchValue, useSearchFilter, onSearchFilterModelChange]);

  useEffect(() => {
    if (setSortBy && sortModel.length) {
      const { field, sort } = sortModel[0];
      setSortBy(`${field},${sort as SortByOperator}` as S);
    }
  }, [setSortBy, sortModel]);

  const Toolbar = useCallback(
    ({
      menuItems,
      filterMode,
    }: {
      menuItems: ReactNode;
      filterMode: GridFeatureMode;
    }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {filterMode && (
            <DynamicFilterToolbar onClick={() => setSearchValue('')} />
          )}
          {useSearchFilter && (
            <DynamicSearchToolbar
              searchValue={searchValue}
              placeholder={searchFilterPlaceholder}
              onChange={(value) => setSearchValue(value)}
              onFocus={() => {
                setFilterModel({ items: [] });
                onSearchFilterModelChange(searchValue);
              }}
            />
          )}
        </Box>
        {menuItems && (
          <IconButton
            edge="end"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            data-testid={`${dataTestId}-MoreVertButton`}
          >
            <MoreVert color="primary" />
          </IconButton>
        )}
      </Box>
    ),
    [
      searchValue,
      useSearchFilter,
      searchFilterPlaceholder,
      onSearchFilterModelChange,
      dataTestId,
    ]
  );

  useEffect(() => {
    if (!filters?.length) {
      setSearchValue('');
      setFilterModel({ items: [] });
    }
  }, [filters]);

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      {menuItems && (
        <AnchorMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
          {menuItems}
        </AnchorMenu>
      )}
      <MuiDataGrid
        rows={rows}
        columns={columns}
        sortingOrder={sortingOrder}
        filterMode={filterMode}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        components={{
          Toolbar: Toolbar,
          NoResultsOverlay: NoResultsOverlay,
          ...components,
        }}
        componentsProps={{
          toolbar: {
            menuItems,
            filterMode,
          },
        }}
        localeText={{
          toolbarFilters: '',
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: DEFAULT_PAGE_SIZE },
          },
          ...initialState,
        }}
        sx={{
          border: 'none',
          '&.MuiDataGrid-root': {
            '.MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
            '.MuiDataGrid-columnHeader': {
              '&:hover, &:focus': {
                outline: 'none',
              },
            },
            '.MuiDataGrid-columnHeaders': {
              borderBottom: 'none',
            },
            '.MuiDataGrid-columnHeaderTitleContainer': {
              padding: 0,
            },
            '.MuiDataGrid-row': {
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: '#FFFAEB',
              },
              '&.Mui-selected': {
                backgroundColor: '#FFFAEB',
              },
            },
            '.MuiDataGrid-cell': {
              borderBottom: 'none',
              '&:hover, &:focus': {
                outline: 'none',
              },
            },
            '.MuiDataGrid-columnSeparator': {
              visibility: 'hidden',
            },
            '.MuiButton-startIcon': {
              m: 0,
            },
            '.MuiDataGrid-main': {
              '.MuiDataGrid-overlay': {
                backgroundColor: 'transparent',
              },
            },
          },
        }}
        {...rest}
      />
    </Box>
  );
};

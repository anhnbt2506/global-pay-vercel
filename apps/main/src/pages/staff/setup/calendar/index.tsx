import {
  NextPage,
  RowsState,
  SingleSelectOperator,
  SortByOperator,
  StringOperator,
} from '@ayp/typings/commons';
import {
  CalendarConfig,
  CalendarEvent,
  CalendarTag,
  CalendarType,
  DateType,
} from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import { isErrorResponse } from '@ayp/utils';
import { Edit, KeyboardArrowDown, PersonAdd } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import {
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@components/commons';
import {
  CalendarModal,
  EventModal,
  TagModal,
} from '@components/pages/staff/setup/calendar/commons';
import UpdateStatusModal from '@components/pages/staff/setup/calendar/commons/update-status-modal';
import { initialValues as initialValuesUpdateModal } from '@components/pages/staff/setup/calendar/commons/update-status-modal/config';
import { FilterType } from '@components/pages/staff/setup/calendar/config';
import SelectionModal from '@components/pages/staff/setup/calendar/selection-modal';
import { DataGrid, NoRowsOverlay, Toast } from '@components/ui';
import { AnchorMenu } from '@components/ui/anchor-menu';
import {
  BOOLEAN_OPTIONS,
  CALENDAR_CLIENT_INPUT_DATE_PREFIX,
  CALENDAR_PERIOD_LABEL_PREFIX,
  CALENDAR_PERIOD_OPTIONS,
  CALENDAR_STATUS_LABEL_PREFIX,
  CALENDAR_STATUS_OPTIONS,
  CALENDAR_TYPE_LABEL_PREFIX,
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
} from '@configs/constants';
import { RedirectionError } from '@configs/errors';
import { UNKNOWN_ERROR_MESSAGE } from '@configs/forms';
import {
  CalendarConfigApi,
  CalendarEventApi,
  CalendarTagApi,
} from '@services/apis/people';

const StaffSetupCalendar: NextPage = ({ isDesktop, session }) => {
  const { t } = useTranslation('staff-setup-calendar');
  const [showSelectSection, setShowSelectSection] = useState(false);
  const [sectionName, setSectionName] = useState<Option<string>>({
    id: CalendarType.EVENT,
    label: t(`${CALENDAR_TYPE_LABEL_PREFIX}${CalendarType.EVENT}`),
  });
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);
  const [idElement, setIdElement] = useState<Nullable<string>>(null);
  const [editingData, setEditingData] = useState(null);

  const [toast, setToast] = useState<Toast>({});
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [rows, setRows] = useState<
    CalendarTag[] | CalendarEvent[] | CalendarConfig[]
  >([]);
  const [filters, setFilters] = useState<FilterType>([]);

  const [rowsState, setRowsState] = useState<RowsState>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [showAddNewSection, setShowAddNewSection] = useState(false);

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [initValuesUpdateStatus, setInitValuesUpdateStatus] = useState(
    initialValuesUpdateModal
  );

  const fetchData = useCallback(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        switch (sectionName.id) {
          case CalendarType.EVENT:
            const { calendarEvents, meta: calendarEventsMeta } =
              await CalendarEventApi.list(session, {
                ...rowsState,
                attributes: [
                  'id',
                  'calendarEventId',
                  'calendarTagId',
                  'calendarTag:calendarTagId,name',
                  'name',
                  'description',
                  'dateType',
                  'dateValue',
                  'createdAt',
                  'status',
                  'isAutomatedReminder',
                  'reminderBasedOn',
                  'reminderDayBeforeEvent',
                ],
                filters,
                sortBy: `createdAt,${SortByOperator.DESC}`,
              });

            /* istanbul ignore next */
            // this case doesn't necessary to test
            if (!active) return;

            setRows(calendarEvents);
            setRowCount(calendarEventsMeta.rowCount);
            setLoading(false);
            break;
          case CalendarType.TAG:
            const { calendarTags, meta: calendarTagsMeta } =
              await CalendarTagApi.list(session, {
                ...rowsState,
                attributes: [
                  'id',
                  'name',
                  'description',
                  'calendarTagId',
                  'isAdjustmentRequired',
                  'adjustmentCalendarTagId',
                  'adjustmentCalendarTag:name',
                  'adjustmentEvent',
                  'adjustmentMethod',
                  'adjustmentDays',
                  'createdAt',
                  'status',
                ],
                filters,
                sortBy: `createdAt,${SortByOperator.DESC}`,
              });

            /* istanbul ignore next */
            // this case doesn't necessary to test
            if (!active) return;

            setRows(calendarTags);
            setRowCount(calendarTagsMeta.rowCount);
            setLoading(false);
            break;
          case CalendarType.CALENDAR:
            const { calendarConfigs, meta: calendarConfigsMeta } =
              await CalendarConfigApi.list(session, {
                ...rowsState,
                attributes: [
                  'id',
                  'calendarConfigId',
                  'name',
                  'description',
                  'context',
                  'context:calendarPeriod',
                  'calendarTags',
                  'createdAt',
                  'status',
                ],
                filters,
                sortBy: `createdAt,${SortByOperator.DESC}`,
              });

            /* istanbul ignore next */
            // this case doesn't necessary to test
            if (!active) return;
            setRows(calendarConfigs);
            setRowCount(calendarConfigsMeta.rowCount);
            setLoading(false);
            break;
        }
      } catch (e) {
        if (isErrorResponse(e)) {
          setToast({
            severity: 'error',
            message: e.error.name,
          });
        } else {
          /* istanbul ignore next */
          // this case doesn't necessary to test
          setToast({
            severity: 'error',
            message: t(UNKNOWN_ERROR_MESSAGE),
          });
        }
      }
    })();
    /* istanbul ignore next */
    // this case doesn't necessary to test
    return () => {
      active = false;
    };
  }, [filters, rowsState, sectionName.id, session, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCloseModal = useCallback(() => {
    fetchData();
    setShowAddNewSection(false);
    setIdElement(null);
    setEditingData(null);
  }, [fetchData]);

  const onCloseUpdateStatusModal = useCallback(() => {
    fetchData();
    setIdElement(null);
    setShowUpdateStatusModal(false);
  }, [fetchData]);

  const onHandleClickOptions =
    (idElement: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIdElement(idElement);
    };

  const calendarStatusOptions = useMemo(
    () =>
      CALENDAR_STATUS_OPTIONS.map((calendarStatus) => ({
        ...calendarStatus,
        value: calendarStatus.id,
        label: t(calendarStatus.label),
      })),
    [t]
  );

  const calendarPeriodOptions = useMemo(
    () =>
      CALENDAR_PERIOD_OPTIONS.map((calendarPeriod) => ({
        ...calendarPeriod,
        value: calendarPeriod.id,
        label: t(calendarPeriod.label),
      })),
    [t]
  );

  const yesNoOptions = useMemo(
    () =>
      BOOLEAN_OPTIONS.map((option) => ({
        ...option,
        value: option.id.toString(),
        label: t(option.label),
      })),
    [t]
  );

  const operators = getGridStringOperators().filter(
    (operator) => operator.value === StringOperator.CONTAINS
  );

  const constantOperators = getGridSingleSelectOperators().filter(
    (operator) => operator.value === SingleSelectOperator.IS
  );

  const columnsEvent: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('dataGrid.event.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        valueGetter: ({ row }) => row.name,
      },
      {
        field: 'description',
        headerName: t('dataGrid.event.header.description'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        valueGetter: ({ row }) => row.description,
      },
      {
        field: 'calendarDate',
        headerName: t('dataGrid.event.header.calendarDate'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        valueGetter: ({ row }) =>
          `${
            row.dateType === DateType.CALENDAR_DATE
              ? format(new Date(row.dateValue), DEFAULT_DATE_FORMAT)
              : '-'
          }`,
      },
      {
        field: 'specificDay',
        headerName: t('dataGrid.event.header.specificDay'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        valueGetter: ({ row }) =>
          `${row.dateType === DateType.SPECIFIC_DAY ? row.dateValue : '-'}`,
      },
      {
        field: 'clientInputDate',
        headerName: t('dataGrid.event.header.clientInputDate'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterable: false,
        valueGetter: ({ row }) =>
          `${
            row.dateType === DateType.CLIENT_INPUT_DATE
              ? t(`${CALENDAR_CLIENT_INPUT_DATE_PREFIX}${row.dateValue}`)
              : '-'
          }`,
      },
      {
        field: 'calendarTag',
        headerName: t('dataGrid.event.header.calendarTag'),
        flex: 1,
        minWidth: 150,
        filterable: false,
        sortable: false,
        valueGetter: ({ row }) =>
          row.calendarTag ? row.calendarTag.name : '-',
      },
      {
        field: 'status',
        headerName: t('dataGrid.event.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: calendarStatusOptions,
        type: 'singleSelect',
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.calendarEventId}
          >
            <Typography>
              {t(`${CALENDAR_STATUS_LABEL_PREFIX}${row.status}`)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClickOptions(row.calendarEventId)}
              data-testid="staffSetupCalendar-eventRow-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.calendarEventId}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="updateStatus"
                onClick={() => {
                  setShowUpdateStatusModal(true);
                  setInitValuesUpdateStatus(row);
                }}
                data-testid="staffSetupCalendar-eventRow-itemUpdate"
              >
                <Typography>{t('updateStatus.title')}</Typography>
              </MenuItem>
              <MenuItem
                key="edit"
                onClick={() => {
                  setEditingData(row);
                  setShowAddNewSection(true);
                }}
                data-testid="staffSetupCalendar-eventRow-itemEdit"
              >
                <Typography>{t('edit.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [
      t,
      operators,
      constantOperators,
      calendarStatusOptions,
      anchorEl,
      idElement,
    ]
  );

  const columnsTag: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('dataGrid.tag.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        valueGetter: ({ row }) => row.name,
      },
      {
        field: 'description',
        headerName: t('dataGrid.tag.header.description'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        valueGetter: ({ row }) => row.description,
      },
      {
        field: 'isAdjustmentRequired',
        headerName: t('dataGrid.tag.header.isAdjustmentRequired'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: yesNoOptions,
        type: 'singleSelect',
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.companyId}
          >
            <Typography>
              {row.isAdjustmentRequired ? t('common:yes') : t('common:no')}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'adjustmentCalendarTag',
        headerName: t('dataGrid.tag.header.adjustmentCalendarTag'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterable: false,
        valueGetter: ({ row }) =>
          `${
            row.adjustmentCalendarTag
              ? row.adjustmentCalendarTag.name
                ? row.adjustmentCalendarTag.name
                : '-'
              : '-'
          }`,
      },
      {
        field: 'status',
        headerName: t('dataGrid.tag.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: calendarStatusOptions,
        type: 'singleSelect',
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.id}
          >
            <Typography>
              {t(`${CALENDAR_STATUS_LABEL_PREFIX}${row.status}`)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClickOptions(row.id)}
              data-testid="staffSetupCalendar-tagRow-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.id}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="updateStatus"
                onClick={() => {
                  setShowUpdateStatusModal(true);
                  setInitValuesUpdateStatus(row);
                }}
                data-testid="staffSetupCalendar-tagRow-itemUpdate"
              >
                <Typography>{t('updateStatus.title')}</Typography>
              </MenuItem>
              <MenuItem
                key="edit"
                onClick={() => {
                  setEditingData(row);
                  setShowAddNewSection(true);
                }}
                data-testid="staffSetupCalendar-tagRow-itemEdit"
              >
                <Typography>{t('edit.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [
      t,
      operators,
      constantOperators,
      calendarStatusOptions,
      yesNoOptions,
      anchorEl,
      idElement,
    ]
  );

  const columnsCalendar: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('dataGrid.calendar.header.name'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: operators,
        valueGetter: ({ row }) => row.name,
      },
      {
        field: 'description',
        headerName: t('dataGrid.calendar.header.description'),
        flex: 1,
        sortable: false,
        minWidth: 250,
        filterOperators: operators,
        valueGetter: ({ row }) => row.description,
      },
      {
        field: 'calendarTags',
        headerName: t('dataGrid.calendar.header.calendarTags'),
        flex: 1,
        sortable: false,
        minWidth: 100,
        filterable: false,
        valueGetter: ({ row }) =>
          `${row?.calendarTags?.length ? row.calendarTags.length : '-'}`,
      },
      {
        field: 'calendarPeriod',
        headerName: t('dataGrid.calendar.header.context.calendarPeriod'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: calendarPeriodOptions,
        type: 'singleSelect',
        renderCell: ({ row }) =>
          t(`${CALENDAR_PERIOD_LABEL_PREFIX}${row?.context?.calendarPeriod}`),
      },
      {
        field: 'status',
        headerName: t('dataGrid.calendar.header.status'),
        flex: 1,
        sortable: false,
        minWidth: 150,
        filterOperators: constantOperators,
        valueOptions: calendarStatusOptions,
        type: 'singleSelect',
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
            key={row.id}
          >
            <Typography>
              {t(`${CALENDAR_STATUS_LABEL_PREFIX}${row.status}`)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
              onClick={onHandleClickOptions(row.id)}
              data-testid="staffSetupCalendar-calendarRow-itemOptions"
            >
              <KeyboardArrowDown fontSize="small" fill="black" />
            </Box>
            <AnchorMenu
              open={!!anchorEl && idElement === row.id}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            >
              <MenuItem
                key="edit"
                onClick={() => {
                  setEditingData(row);
                  setShowAddNewSection(true);
                }}
                data-testid="staffSetupCalendar-calendarRow-itemEdit"
              >
                <Typography>{t('edit.title')}</Typography>
              </MenuItem>
            </AnchorMenu>
          </Box>
        ),
      },
    ],
    [
      t,
      operators,
      constantOperators,
      calendarStatusOptions,
      calendarPeriodOptions,
      anchorEl,
      idElement,
    ]
  );

  const columns = useMemo(() => {
    switch (sectionName.id) {
      case CalendarType.EVENT:
        return columnsEvent;
      case CalendarType.TAG:
        return columnsTag;
      case CalendarType.CALENDAR:
        return columnsCalendar;
      /* istanbul ignore next */
      //Scenario never exists
      default:
        return [];
    }
  }, [sectionName, columnsCalendar, columnsTag, columnsEvent]);

  const selectSection = useMemo(
    () =>
      showSelectSection && (
        <SelectionModal
          t={t}
          sectionName={sectionName}
          setSectionName={setSectionName}
          setShowSelectSection={setShowSelectSection}
          setFilters={setFilters}
        />
      ),
    [t, sectionName, showSelectSection, setFilters]
  );

  const updateStatusModal = useMemo(
    () =>
      showUpdateStatusModal && (
        <UpdateStatusModal
          t={t}
          session={session}
          sectionName={sectionName}
          params={initValuesUpdateStatus}
          onCloseUpdateStatusModal={() => onCloseUpdateStatusModal()}
          setToast={setToast}
        />
      ),
    [
      t,
      session,
      initValuesUpdateStatus,
      showUpdateStatusModal,
      onCloseUpdateStatusModal,
      setToast,
      sectionName,
    ]
  );

  const currentSectionModal = useMemo(() => {
    switch (sectionName.id) {
      case CalendarType.CALENDAR:
        const propsCalendar = editingData
          ? { isEditing: !!editingData, initialValues: editingData }
          : {};
        return (
          <CalendarModal
            onCloseModal={() => onCloseModal()}
            setToast={setToast}
            {...propsCalendar}
          />
        );
      case CalendarType.EVENT:
        const propsEvent = editingData
          ? { isEditing: !!editingData, initialValues: editingData }
          : {};
        return (
          <EventModal
            onCloseModal={() => onCloseModal()}
            setToast={setToast}
            {...propsEvent}
          />
        );
      case CalendarType.TAG:
        const props = editingData
          ? { isEditing: !!editingData, initialValues: editingData }
          : {};
        return (
          <TagModal
            onCloseModal={() => onCloseModal()}
            setToast={setToast}
            {...props}
          />
        );
      /* istanbul ignore next */
      // Scenario never exists
      default:
        return;
    }
  }, [onCloseModal, sectionName.id, editingData]);

  const handlePaginationModelChange = (newPaginationModel: RowsState) => {
    setRowsState({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
    });
  };

  const dataGrid = useMemo(() => {
    const menu = () => {
      let menuLabel;
      switch (sectionName.id) {
        case CalendarType.EVENT:
          menuLabel = t('addNewEvent.title');
          break;
        case CalendarType.TAG:
          menuLabel = t('addNewTag.title');
          break;
        case CalendarType.CALENDAR:
          menuLabel = t('addNewCalendar.title');
        /* istanbul ignore next */
        // Scenario never exists
        default:
          break;
      }

      return [
        <MenuItem
          key="addNewEvent"
          onClick={() => setShowAddNewSection(true)}
          data-testid="staffSetupCalendar-newSectionIcon"
        >
          <PersonAdd fontSize="small" color="primary" />
          <Typography marginLeft="0.5rem">{menuLabel}</Typography>
        </MenuItem>,
      ];
    };

    return (
      <DataGrid<FilterType>
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        filters={filters}
        filterMode="server"
        setFilters={setFilters}
        useSearchFilter
        searchFilterColumnField="name"
        searchFilterOperatorValue={StringOperator.CONTAINS}
        searchFilterPlaceholder={t('dataGrid.searchPlaceholder')}
        dataTestId="staffSetupCalendar-dataGrid"
        components={{
          NoRowsOverlay: () => (
            <NoRowsOverlay
              dataTestId="staffSetupCalendar-noRowsOverLay"
              icon="PersonPin"
              title={t('dataGrid.noRowsOverlay.title')}
              description={t('dataGrid.noRowsOverlay.description')}
            />
          ),
        }}
        menuItems={menu()}
        pagination
        paginationMode="server"
        paginationModel={{ ...rowsState }}
        onPaginationModelChange={handlePaginationModelChange}
      />
    );
  }, [t, columns, loading, rowCount, rows, rowsState, sectionName, filters]);

  return (
    <>
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffSetupCalendar-toast"
      >
        {toast.message}
      </Toast>
      <AppLayout
        isDesktop={isDesktop}
        pageName={t('pageName')}
        sx={{
          flexDirection: 'column',
          height: '100%',
          '&>div:nth-of-type(2)': {
            height: '1000%',
          },
        }}
      >
        {selectSection}
        {updateStatusModal}
        {showAddNewSection && currentSectionModal}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box>
            {`${t('selectionSelected')}: `}
            <b>{sectionName?.label}</b>
          </Box>
          <IconButton
            onClick={() => {
              setShowSelectSection(true);
            }}
          >
            <Edit
              fontSize="small"
              color="primary"
              data-testid="staffSetupCalendar-editSectionIcon"
            />
          </IconButton>
        </Box>
        {dataGrid}
      </AppLayout>
    </>
  );
};

export default StaffSetupCalendar;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(context.locale ?? 'en', [
          'common',
          'calendar-tag-adjustment-event-types',
          'calendar-tag-adjustment-method-types',
          'calendar-config-trigger-point',
          'calendar-period',
          'calendar-status',
          'calendar-type',
          'calendar-event-date-type',
          'calendar-client-input-date',
          'staff-setup-calendar',
        ])),
      },
    };
  } catch (e) {
    if (e instanceof RedirectionError) {
      return e.redirect();
    }

    return {
      props: {},
    };
  }
};

import { WorkerEmployment } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { Tabs, Toast } from '@components/ui';

import { Information } from '../information';
import {
  COMPANY_EMPLOYMENT_DETAIL_TAB_OPTIONS,
  CompanyEmploymentDetailTabs,
} from './config';

interface CompanyEmploymentDetailsProps {
  countries: CountryOption[];
  workerEmployment: WorkerEmployment;
  dataTestId?: string;
  fetchWorkerEmployment: () => Promise<void>;
  setToast: Dispatch<SetStateAction<Toast>>;
}

export const CompanyEmploymentDetails: FC<CompanyEmploymentDetailsProps> = ({
  countries,
  workerEmployment,
  dataTestId,
  fetchWorkerEmployment,
}) => {
  const { t } = useTranslation('company-people-employment-id');
  const [tab, setTab] = useState(CompanyEmploymentDetailTabs.INFORMATION);

  const workerDetailsTabOptions = useMemo(
    () =>
      COMPANY_EMPLOYMENT_DETAIL_TAB_OPTIONS.map((tab) => ({
        ...tab,
        value: tab.id,
        label: t(tab.label),
      })),
    [t]
  );

  const contentComponent = useMemo(() => {
    switch (tab) {
      case CompanyEmploymentDetailTabs.INFORMATION:
        return (
          <Information
            workerEmployment={workerEmployment}
            fetchWorkerEmployment={fetchWorkerEmployment}
            countries={countries}
            dataTestId={dataTestId}
          />
        );
      /* istanbul ignore next */
      // this case doesn't necessary to test
      default:
        return <></>;
    }
  }, [countries, dataTestId, fetchWorkerEmployment, tab, workerEmployment]);

  return (
    <Box
      sx={{
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        height: '85vh',
        paddingBottom: '2rem',
        '&::-webkit-scrollbar': {
          width: '0.25rem',
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '0.5rem',
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '0.5rem',
          backgroundColor: 'gray',
          borderTop: '0.25rem transparent solid',
          borderBottom: '0.25rem transparent solid',
          backgroundClip: 'content-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Tabs
          tabs={workerDetailsTabOptions}
          value={tab}
          setTab={setTab}
          fallback={CompanyEmploymentDetailTabs.INFORMATION}
          variant="scrollable"
        />
      </Box>
      {contentComponent}
    </Box>
  );
};

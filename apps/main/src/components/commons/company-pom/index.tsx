import {
  CountryCode,
  SortByOperator,
  StringOperator,
  UserSession,
} from '@ayp/typings/commons';
import { CountryOption, Option } from '@ayp/typings/ui';
import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { BankApi } from '@services/apis/people/bank-api';
import memoizee from 'memoizee';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useSessionCookies } from '@hooks/use-session-cookies';
import { CompanyCreateServiceDetailsRequest } from '@services/apis/people';

import { CompanyPomCountry } from './config';

const getBankOptionsMemo = memoizee(
  async (
    session: UserSession,
    country: CountryCode
  ): Promise<Option<string>[]> => {
    try {
      const { banks } = await BankApi.getBanks(session, {
        attributes: ['bankId', 'bankName'],
        filters: [
          `countryCode,${StringOperator.EQUALS},${country}`,
          `isBankFileSupported,${StringOperator.EQUALS},1`,
        ],
        sortBy: `bankName,${SortByOperator.ASC}`,
      });

      return banks.map(({ bankId, bankName }) => ({
        id: bankId,
        label: bankName,
        value: bankId,
      }));
    } catch (e) {
      return [];
    }
  },
  { promise: true }
);

interface CompanyPomProps {
  country: CountryOption;
  initialValues?: Record<string, unknown>;
  isEditing?: boolean;
  companyId: string;
  handleSubmit: (values: CompanyCreateServiceDetailsRequest) => Promise<void>;
  onClose: VoidFunction;
  dataTestId: string;
}

const CompanyPom: FC<CompanyPomProps> = ({
  country,
  onClose,
  handleSubmit,
  initialValues,
  isEditing = false,
  companyId,
  dataTestId,
}) => {
  const { t } = useTranslation('company-pom');
  const { session } = useSessionCookies();
  const [bankOptions, setBankOptions] = useState<Option<string>[]>([]);

  const onSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      const { mapToRequestBody } = await import(
        `@components/commons/company-pom/${country.code.toLocaleLowerCase()}/config`
      );

      handleSubmit(mapToRequestBody(values));
    },
    [handleSubmit, country]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getBankOptionsMemo(session, country.code);
        setBankOptions(data);
      } catch (e) {}
    })();
  }, [country, session]);

  const DynamicForm = useMemo(
    () =>
      dynamic<CompanyPomCountry>(
        () =>
          import(
            `@components/commons/company-pom/${country.code.toLocaleLowerCase()}`
          )
      ),
    [country.code]
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          padding: '2rem',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          marginY="1rem"
          sx={{ flexDirection: 'column' }}
        >
          <Typography variant="h6" textAlign="center">
            {t('title')}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            {t('description')}
          </Typography>
        </Box>
        <DynamicForm
          onClose={onClose}
          onSubmit={onSubmit}
          initialValues={initialValues}
          isEditing={isEditing}
          companyId={companyId}
          bankOptions={bankOptions}
          dataTestId={`${dataTestId}-${country.code}`}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompanyPom;

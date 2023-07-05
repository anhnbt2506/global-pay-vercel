import { NextPage } from '@ayp/typings/commons';
import { Environment } from '@ayp/utils';
import { Assignment } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { isEmpty } from 'lodash-es';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { FC, useEffect, useState } from 'react';

import { AppLayout } from '@components/commons';
import { Toast } from '@components/ui';
import { RedirectionError } from '@configs/errors';
import { useFeatureFlag } from '@hooks';
import { TableauApi } from '@services/apis/people';
import { getServerSideSession, withNonce } from '@utils';

const NoData: FC<{ t: TFunction }> = ({ t }) => (
  <>
    <Assignment
      sx={{
        fontSize: '8rem',
      }}
      color="primary"
    />
    <Typography
      variant="h4"
      marginY="1rem"
      data-testid="companyDashboard-noData-title"
    >
      {t('globalDashboard')}
    </Typography>
    <Typography
      variant="subtitle1"
      data-testid="companyDashboard-noData-caption"
    >
      {t('noData')}
    </Typography>
  </>
);

const TableauDashboard: FC<{
  nonce?: string;
  token: string;
  companyId?: string;
}> = ({ nonce, token, companyId = '' }) => (
  <>
    <Script
      async
      defer
      nonce={nonce}
      type="text/javascript"
      src={`${Environment.getTableauHostUrl()}/javascripts/api/viz_v1.js`}
    />
    <div
      className="tableauPlaceholder"
      data-testid="companyDashboard-tableauDashboard"
    >
      <object
        width="100%"
        height="100%"
        className="tableauViz"
        style={{
          display: 'none',
          borderRadius: '0.5rem 0.5rem 0 0',
        }}
      >
        <param name="tabs" value="no" />
        <param name="toolbar" value="no" />
        <param name="showAppBanner" value="false" />
        <param name="embed_code_version" value="3" />

        <param name="ticket" value={token} />
        <param name="filter" value={`Company ID=${companyId}`} />
        <param name="host_url" value={Environment.getTableauHostUrl()} />
        <param name="name" value={Environment.getTableauDashboardName()} />
      </object>
    </div>
  </>
);

interface CompanyDashboardProps {
  token: string;
}

const CompanyDashboard: NextPage<CompanyDashboardProps> = ({
  nonce,
  token,
  isDesktop,
  session,
}) => {
  const { t } = useTranslation('company-dashboard');
  const [toast, setToast] = useState<Toast>({});
  const { TABLEAU_DASHBOARD } = useFeatureFlag();

  const router = useRouter();

  useEffect(() => {
    if (!isEmpty(router.query)) {
      const { message, code } = router.query;
      if (!code) return;
      setToast({
        severity: code === '200' ? 'success' : 'error',
        message,
      });
    }
  }, [router]);

  return (
    <AppLayout
      sx={{
        padding: 0,
      }}
      isDesktop={isDesktop}
      pageName={t('pageName')}
      dataTestId="companyDashboard-appLayout"
    >
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="companyDashboard-toast"
      >
        {toast.message}
      </Toast>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {TABLEAU_DASHBOARD && token ? (
          <TableauDashboard
            nonce={nonce}
            token={token}
            companyId={session?.user?.selectedUserContext.contextCompanyId}
          />
        ) : (
          <NoData t={t} />
        )}
      </Box>
    </AppLayout>
  );
};

export default CompanyDashboard;

export const getServerSideProps = withNonce<CompanyDashboardProps>(
  async (context) => {
    try {
      const session = await getServerSideSession(context);
      const { token } = await TableauApi.requestToken(session);

      return {
        props: {
          token,
          ...(await serverSideTranslations(context.locale ?? 'en', [
            'common',
            'company-dashboard',
          ])),
        },
      };
    } catch (e) {
      if (e instanceof RedirectionError) {
        return e.redirect();
      }

      return {
        props: {} as CompanyDashboardProps,
      };
    }
  }
);

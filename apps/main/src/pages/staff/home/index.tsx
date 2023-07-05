import { NextPage } from '@ayp/typings/commons';
import { Assignment } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { isEmpty } from 'lodash-es';

import { AppLayout } from '@components/commons';
import { Toast } from '@components/ui';

const StaffHome: NextPage = ({ isDesktop }) => {
  const { t } = useTranslation('staff-home');
  const [toast, setToast] = useState<Toast>({});
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
      isDesktop={isDesktop}
      pageName={t('pageName')}
      dataTestId="staffHome-appLayout"
    >
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId="staffHome-toast"
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
        <Assignment
          sx={{
            fontSize: '8rem',
          }}
          color="primary"
        />
        <Typography variant="h4" marginY="1rem" data-testid="staffHome-title">
          {t('title')}
        </Typography>
        <Typography variant="subtitle1" data-testid="staffHome-description">
          {t('description')}
        </Typography>
      </Box>
    </AppLayout>
  );
};

export default StaffHome;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'staff-home'])),
  },
});

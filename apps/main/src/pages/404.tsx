import { Box } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NotFoundPage = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Global Pay
  </Box>
);

export default NotFoundPage;

export const getStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

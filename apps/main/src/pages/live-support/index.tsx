/* istanbul ignore file */
// Page is being rendered statically, test cases have been created.

import Script from 'next/script';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Box, Container, Typography, Grid } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPage } from '@ayp/typings/commons';

import { AypLogo, LiveSupportImage } from '@assets/shared';
import { withNonce } from '@utils';

const LiveSupport: NextPage = ({ nonce }) => {
  const { t } = useTranslation('live-support');

  return (
    <>
      {/* <!-- Start of HubSpot Embed Code --> */}
      <Script
        async
        defer
        nonce={nonce}
        type="text/javascript"
        id="hs-script-loader"
        src="//js-na1.hs-scripts.com/8848284.js"
      />
      {/* <!-- End of HubSpot Embed Code --> */}
      <Container
        maxWidth={false}
        sx={(theme) => ({
          padding: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          [theme.breakpoints.down('lg')]: {
            padding: '0 1rem',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image width={125} height={125} src={AypLogo} alt="ayp-logo" />
        </Box>
        <Box
          sx={(theme) => ({
            height: '70%',
            display: 'flex',
            padding: '0 4rem',
            [theme.breakpoints.down('lg')]: {
              padding: 0,
            },
          })}
        >
          <Grid container>
            <Grid
              data-testid="liveSupport-layoutText"
              item
              lg={6}
              xs={12}
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                [theme.breakpoints.down('lg')]: {
                  order: 2,
                  alignItems: 'center',
                },
              })}
            >
              <Typography
                data-testid="liveSupport-title"
                variant="h1"
                sx={(theme) => ({
                  color: (theme) => theme.palette.customs.blueRibbon,
                  [theme.breakpoints.down('lg')]: {
                    textAlign: 'center',
                  },
                })}
              >
                {t('title')}
              </Typography>
              <Typography
                data-testid="liveSupport-description"
                variant="h6"
                sx={(theme) => ({
                  paddingTop: '2rem',
                  [theme.breakpoints.down('lg')]: {
                    paddingTop: '1rem',
                    textAlign: 'center',
                  },
                })}
              >
                {t('description')}
              </Typography>
            </Grid>
            <Grid
              data-testid="liveSupport-layoutImage"
              item
              lg={6}
              xs={12}
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                [theme.breakpoints.down('lg')]: {
                  order: 1,
                },
              })}
            >
              <Image
                data-testid="liveSupport-image"
                priority
                width="500"
                height="500"
                alt="live-support"
                src={LiveSupportImage}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={(theme) => ({
            display: 'flex',
            padding: '2rem 0',
            [theme.breakpoints.down('lg')]: {
              paddingLeft: 0,
              justifyContent: 'center',
            },
          })}
        >
          <Typography
            data-testid="liveSupport-freepik"
            variant="subtitle1"
            sx={(theme) => ({
              [theme.breakpoints.down('lg')]: {
                textAlign: 'center',
              },
            })}
          >
            {t('freepik')}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default LiveSupport;

export const getServerSideProps = withNonce(async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['live-support'])),
  },
}));

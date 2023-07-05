import { Userpilot } from '@ayp/userpilot';
import { Environment, getAssetUrl, getNonce } from '@ayp/utils';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Hotjar from '@hotjar/browser';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

import { AuthGuard, ErrorBoundary } from '@components/commons';
import { HOTJAR_VERSION } from '@configs/constants';
import GlobalPayProviders from '@contexts';
import { light } from '@themes';
import { createEmotionCache } from '@utils';

import '../global.styles.css';

interface AppComponentProps extends AppProps {
  nonce: string;
  emotionCache?: EmotionCache;
}

const AppComponent = (props: AppComponentProps) => {
  const {
    nonce,
    Component,
    emotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  useEffect(() => {
    Hotjar.init(Environment.getHjid(), HOTJAR_VERSION, {
      nonce,
    });
    Userpilot.initialize(Environment.getUserPilotToken(), { nonce });
  }, [nonce]);

  return (
    // Client-side cache, shared for the whole session of the user in the browser.
    <CacheProvider value={emotionCache ?? createEmotionCache(nonce)}>
      <Head>
        <link
          nonce={nonce}
          rel="shortcut icon"
          href={getAssetUrl('shared/img/global-pay.ico')}
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>AYP Global Pay</title>
        <meta
          name="description"
          content="AYP Global Pay is a total workforce management solution, allowing you to manage your employees from onboarding to payment, in multiple jurisdictions. We provide these solutions through our SaaS platform that offers automation, enhanced payroll compliance, and live reporting of total payroll spending."
        />
      </Head>
      <Script id="gtm-script" strategy="afterInteractive" nonce={nonce}>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
          `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
          `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
          `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
          `})(window,document,'script','dataLayer','${Environment.getGtmId()}');`}
      </Script>
      <Script
        nonce={nonce}
        src="https://api.useberry.com/integrations/liveUrl/scripts/useberryScript.js"
      />
      <ThemeProvider theme={light}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <GlobalPayProviders>
            <ErrorBoundary>
              <AuthGuard Component={Component} pageProps={pageProps} />
            </ErrorBoundary>
          </GlobalPayProviders>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

AppComponent.getInitialProps = async ({ ctx }: AppContext) => ({
  nonce: getNonce(ctx),
});

export default appWithTranslation(AppComponent);

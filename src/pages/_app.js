import { useEffect, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme, dynamicTheme } from '../theme';
import { QueryClient, QueryClientProvider } from 'react-query'
import { useDispatch } from 'react-redux';
import { userProfileUrl } from '../config'
import { setProfile } from '../features/profile/profileSlice';
import store from '../store';
import Layout from '../components/layout';
import { Provider as ReduxProvider } from 'react-redux';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above



const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient()

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Newson
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Layout>
              <CssBaseline />
                {getLayout(<Component {...pageProps} />)}
          </Layout>
          </LocalizationProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;

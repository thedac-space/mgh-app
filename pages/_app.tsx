import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import { Router } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '/styles/nprogress.css'; //styles of nprogress

import store from '../state/store'
import { Provider } from 'react-redux'

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
export default MyApp

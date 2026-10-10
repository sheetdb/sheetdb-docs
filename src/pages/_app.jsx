import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import { Analytics } from '@vercel/analytics/react';

import '@/styles/tailwind.css'
import 'focus-visible'

const SITE_URL = 'https://docs.sheetdb.io'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  let title =
    pageProps.metaTitle ??
    (router.pathname === '/'
      ? 'SheetDB API documentation'
      : `${pageProps.title} - SheetDB API documentation`)
  let canonicalUrl = `${SITE_URL}${router.pathname === '/' ? '' : router.pathname}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageProps.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SheetDB" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={pageProps.description} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"/>
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </MDXProvider>
      {/* <script async src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script> */}
      <script defer src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script>
    </>
  )
}

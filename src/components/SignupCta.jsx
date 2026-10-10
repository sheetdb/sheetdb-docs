import { useRouter } from 'next/router'

import { Button } from '@/components/Button'

const SIGNUP_URL = 'https://sheetdb.io/login'

// utm_medium = where on the page the link sits, utm_content = which docs page it was clicked on
export function buildTrackedUrl(base, medium, pathname) {
  let url = new URL(base)

  url.searchParams.set('utm_source', 'docs')
  url.searchParams.set('utm_medium', medium)
  url.searchParams.set('utm_campaign', 'docs_cta')
  url.searchParams.set('utm_content', pathname)

  return url.toString()
}

export function useTrackedUrl(base, medium) {
  let router = useRouter()

  return buildTrackedUrl(base, medium, router.pathname)
}

export function useSignupUrl(medium) {
  return useTrackedUrl(SIGNUP_URL, medium)
}

export function SignupButton({
  medium = 'inline',
  variant = 'filled',
  children = 'Create free API',
  ...props
}) {
  let href = useSignupUrl(medium)

  return (
    <Button href={href} variant={variant} data-markdown-ignore {...props}>
      {children}
    </Button>
  )
}

export function SignupCta({ medium = 'page_end' }) {
  return (
    <div
      data-markdown-ignore
      className="not-prose my-6 flex flex-col gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-base font-semibold text-zinc-900 dark:text-white">
          Turn your own Google Sheet into an API
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Connect a spreadsheet and get your own endpoint. The first 500
          requests each month are free, no credit card required.
        </p>
      </div>
      <SignupButton medium={medium} arrow="right" className="flex-none" />
    </div>
  )
}

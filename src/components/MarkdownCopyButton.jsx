import { useCallback, useMemo, useState } from 'react'
import TurndownService from 'turndown'

export function MarkdownCopyButton() {
    const [isCopying, setIsCopying] = useState(false)
    const [copied, setCopied] = useState(false)

    const turndown = useMemo(() => {
        const service = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-',
            emDelimiter: '*',
            strongDelimiter: '**',
        })

        // Preserve line breaks more generously
        service.addRule('preserveLineBreaks', {
            filter: ['br'],
            replacement: () => '  \n',
        })

        return service
    }, [])

    const handleCopy = useCallback(async () => {
        if (isCopying) return
        setIsCopying(true)
        try {
            const article = typeof document !== 'undefined'
                ? document.querySelector('main article') || document.querySelector('article')
                : null

            if (!article) throw new Error('No article element found')

            // Prepare a cleaned clone to avoid copying UI-only elements
            const cloned = article.cloneNode(true)

            // 1) Remove any buttons inside the article (e.g., code copy buttons)
            cloned.querySelectorAll('button').forEach((el) => el.remove())

            // 2) Remove other copy helpers / decorative icons if present
            cloned
                .querySelectorAll('[data-copyable],[data-flux-icon],[data-slot="icon"]')
                .forEach((el) => el.remove())

            // 3) Unwrap anchor links inside headings → keep pure heading text
            cloned.querySelectorAll('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a').forEach((a) => {
                const parent = a.parentNode
                if (parent && /^H[1-6]$/.test(parent.tagName) && a.textContent) {
                    parent.replaceChild(document.createTextNode(a.textContent), a)
                }
            })

            // Convert cleaned HTML → Markdown
            const html = cloned.innerHTML
            const markdown = turndown.turndown(html)

            await navigator.clipboard.writeText(markdown)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            // Fallback: copy plain text if markdown conversion fails
            try {
                let text = ''
                if (typeof document !== 'undefined') {
                    const article = document.querySelector('main article') || document.querySelector('article')
                    if (article) {
                        const cloned = article.cloneNode(true)
                        cloned.querySelectorAll('button').forEach((el) => el.remove())
                        cloned
                            .querySelectorAll('[data-copyable],[data-flux-icon],[data-slot="icon"]')
                            .forEach((el) => el.remove())
                        text = cloned.innerText || ''
                    }
                }
                if (text) {
                    await navigator.clipboard.writeText(text)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                }
            } catch { }
        } finally {
            setIsCopying(false)
        }
    }, [isCopying, turndown])

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={isCopying}
            className={
                `inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-medium transition active:scale-[0.98] ` +
                `border-zinc-900/10 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5 ` +
                (copied ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200')
            }
            aria-label={copied ? 'Copied to clipboard' : 'Copy page as Markdown'}
            title={copied ? 'Copied to clipboard' : 'Copy page as Markdown'}
        >
            {copied ? (
                <svg
                    className="shrink-0 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.14-.094l4.057-5.495Z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg
                    className="shrink-0 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z" clipRule="evenodd" />
                    <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" />
                </svg>
            )}
            <span className="tracking-tight">{copied ? 'Copied to clipboard' : 'Copy as Markdown'}</span>
        </button>
    )
}



import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import { MarkdownCopyButton } from '@/components/MarkdownCopyButton'

export function Layout({ children, sections = [] }) {
    return (
        <SectionProvider sections={sections}>
            <div className="lg:ml-72 xl:ml-80">
                <motion.header
                    layoutScroll
                    className="fixed inset-y-0 left-0 z-40 contents w-72 overflow-y-auto border-r border-zinc-900/10 px-6 pt-4 pb-8 dark:border-white/10 lg:block xl:w-80"
                >
                    <div className="hidden lg:flex">
                        <Link href="/" className="flex items-center justify-center text-emerald-500 text-xl space-x-2" aria-label="Home">
                            <Logo className="h-8" />
                            <span className="font-semibold">SheetDB</span>
                        </Link>
                    </div>
                    <Header />
                    <Navigation className="hidden lg:mt-10 lg:block" />
                </motion.header>
                <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
                    <main className="py-16">
                        <Prose as="article">
                            <div className="float-right">
                                <MarkdownCopyButton />
                            </div>
                            {children}
                            <div className="float-right">
                                <MarkdownCopyButton />
                            </div>
                        </Prose>
                    </main>
                    <Footer />
                </div>
            </div>
        </SectionProvider>
    )
}

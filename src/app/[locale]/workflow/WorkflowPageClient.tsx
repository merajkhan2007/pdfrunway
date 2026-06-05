'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Home, Wrench, HelpCircle, FileText, GitBranch } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';

// Dynamic import WorkflowEditor to avoid SSR problems (ReactFlow needs browser window object)
const WorkflowEditor = dynamic(
    () => import('@/components/workflow/WorkflowEditor').then(mod => mod.WorkflowEditor),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading workflow editor...</p>
                </div>
            </div>
        )
    }
);

interface WorkflowPageClientProps {
    locale: Locale;
}

export default function WorkflowPageClient({ locale }: WorkflowPageClientProps) {
    const t = useTranslations('common');
    const tWorkflow = useTranslations('workflow');

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Compact Top Navigation Bar - 48px */}
            <header className="h-12 flex-shrink-0 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 flex items-center justify-between shadow-sm">
                
                {/* Left: Brand Logo & Title */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        aria-label="Go to homepage"
                    >
                        <Image
                            src="/images/pdfrunway.png"
                            alt="PDFRunway"
                            width={130}
                            height={36}
                            className="h-8 w-auto object-contain dark:hidden"
                            priority
                        />
                        <Image
                            src="/images/pdfrunway-dark.png"
                            alt="PDFRunway"
                            width={130}
                            height={36}
                            className="h-8 w-auto object-contain hidden dark:block"
                            priority
                        />
                    </Link>

                    <span className="text-gray-250 dark:text-gray-850">|</span>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <GitBranch className="w-4 h-4 text-[#E31E24]" />
                        <span className="font-bold hidden sm:inline">
                            {tWorkflow('title') || 'PDF Workflow Builder'}
                        </span>
                    </div>
                </div>

                {/* Right: Navigation Links */}
                <nav className="flex items-center gap-1" role="navigation" aria-label="Workflow toolbar navigation">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-650 dark:text-gray-400 hover:text-[#E31E24] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('navigation.home') || 'Home'}</span>
                    </Link>
                    <Link
                        href={`/${locale}/tools`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-655 dark:text-gray-400 hover:text-[#E31E24] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all"
                    >
                        <Wrench className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('navigation.tools') || 'Tools'}</span>
                    </Link>
                    <Link
                        href={`/${locale}/about`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-655 dark:text-gray-400 hover:text-[#E31E24] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('navigation.about') || 'About'}</span>
                    </Link>
                    <Link
                        href={`/${locale}/faq`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-655 dark:text-gray-400 hover:text-[#E31E24] hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all"
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{t('navigation.faq') || 'FAQ'}</span>
                    </Link>
                </nav>
            </header>

            {/* Workflow Editor - fills remaining height */}
            <main id="main-content" className="flex-1 overflow-hidden" tabIndex={-1}>
                <WorkflowEditor />
            </main>
        </div>
    );
}

import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import WorkflowPageClient from './WorkflowPageClient';

export function generateStaticParams() {
    return locales.map((locale) => ({ localeOrTool: locale }));
}

interface WorkflowPageProps {
    params: Promise<{ localeOrTool: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
    const { localeOrTool } = await params;
    const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';

    // Enable static rendering
    setRequestLocale(validLocale);

    return <WorkflowPageClient locale={validLocale} />;
}

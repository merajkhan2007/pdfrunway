'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Tool, ToolCategory } from '@/types/tool';
import { getToolIcon } from '@/config/icons';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export interface ToolCardProps {
  tool: Tool;
  locale: string;
  className?: string;
  localizedContent?: { title: string; description: string };
}

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'edit-annotate':    'editAnnotate',
  'convert-to-pdf':  'convertToPdf',
  'convert-from-pdf':'convertFromPdf',
  'organize-manage': 'organizeManage',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf':      'securePdf',
};

// Per-category icon background + icon color
const categoryColors: Record<ToolCategory, { iconBg: string; iconColor: string; badgeBg: string; badgeText: string }> = {
  'edit-annotate':    { iconBg: 'bg-red-100',    iconColor: 'text-[#E31E24]',  badgeBg: 'bg-red-100',    badgeText: 'text-red-700'    },
  'convert-to-pdf':  { iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   badgeBg: 'bg-blue-100',   badgeText: 'text-blue-700'   },
  'convert-from-pdf':{ iconBg: 'bg-purple-100', iconColor: 'text-purple-600', badgeBg: 'bg-purple-100', badgeText: 'text-purple-700' },
  'organize-manage': { iconBg: 'bg-orange-100', iconColor: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' },
  'optimize-repair': { iconBg: 'bg-green-100',  iconColor: 'text-green-600',  badgeBg: 'bg-green-100',  badgeText: 'text-green-700'  },
  'secure-pdf':      { iconBg: 'bg-slate-100',  iconColor: 'text-slate-700',  badgeBg: 'bg-slate-100',  badgeText: 'text-slate-700'  },
};

export function ToolCard({ tool, locale, className = '', localizedContent }: ToolCardProps) {
  const t = useTranslations();
  const toolUrl = `/${locale}/tools/${tool.slug}`;

  const toolName = localizedContent?.title
    || tool.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const description = localizedContent?.description
    || tool.features.slice(0, 3).map(f => f.replace(/-/g, ' ')).join(', ');

  const IconComponent = getToolIcon(tool.icon);
  const colors = categoryColors[tool.category];
  const categoryName = t(`home.categories.${categoryTranslationKeys[tool.category]}`);

  return (
    <Link
      href={toolUrl}
      className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-2 rounded-2xl ${className}`}
      data-testid="tool-card"
    >
      <div
        className="relative h-full bg-white rounded-2xl border border-gray-100 p-5 flex flex-col hover:border-[#E31E24]/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        data-testid="tool-card-container"
      >
        {/* Top row: favorite + arrow */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-[#E31E24]" />
          </span>
          <FavoriteButton toolId={tool.id} size="sm" />
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}
          data-testid="tool-card-icon"
          aria-hidden="true"
        >
          <IconComponent className={`w-6 h-6 ${colors.iconColor}`} data-icon={tool.icon} />
        </div>

        {/* Name */}
        <h3
          className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#E31E24] transition-colors pr-10 line-clamp-1"
          data-testid="tool-card-name"
        >
          {toolName}
        </h3>

        {/* Description */}
        <p
          className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1"
          data-testid="tool-card-description"
        >
          {description}
        </p>

        {/* Category badge */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
            {categoryName}
          </span>
          <span className="text-xs font-semibold text-[#E31E24] opacity-0 group-hover:opacity-100 transition-opacity">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;

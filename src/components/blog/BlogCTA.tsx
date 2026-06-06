import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { getToolById } from '@/config/tools';
import { getToolContent } from '@/config/tool-content';

interface BlogCTAProps {
  toolId: string;
}

export function BlogCTA({ toolId }: BlogCTAProps) {
  const tool = getToolById(toolId);
  if (!tool) return null;

  const content = getToolContent('en', toolId);

  // Format title (e.g. "Merge PDF")
  const toolName = content?.title || tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="my-10 bg-gradient-to-br from-[#1B2A4A] to-red-950/20 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden group">
      {/* Glowing background decor */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E31E24] rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500 rounded-full opacity-10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/5">
            <FileText className="h-3 w-3 text-[#E31E24]" />
            Free Online PDF Tool
          </span>
          <h4 className="text-xl sm:text-2xl font-black mb-2 tracking-tight">
            Use PDFRunway {toolName} Tool
          </h4>
          <p className="text-sm text-white/80 dark:text-gray-300 max-w-xl leading-relaxed">
            Process your documents safely, securely, and instantly. All conversions occur directly in your web browser—your files never leave your device.
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <Link href={`/tools/${tool.slug}`}>
            <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E31E24] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer text-sm">
              Launch {toolName}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { History, PlusCircle, Share2, Database } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LanguageSelector } from './LanguageSelector';

interface EnterpriseNavbarProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenExport?: () => void;
  hasActiveDecision: boolean;
  historyCount: number;
  activeTitle?: string;
}

export const EnterpriseNavbar: React.FC<EnterpriseNavbarProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenExport,
  hasActiveDecision,
  historyCount,
  activeTitle,
}) => {
  const t = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
                {t.navbar.brand}
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 rounded border border-indigo-400/30">
                {t.navbar.enterpriseBadge}
              </span>
            </div>
            <span className="hidden md:block text-[11px] font-medium text-slate-400 whitespace-nowrap">
              {activeTitle ? `${t.navbar.decisionPrefix}: ${activeTitle.slice(0, 36)}...` : t.navbar.subtitleDefault}
            </span>
          </div>
        </div>

        {/* Center BI Indicators */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{t.navbar.indicators.matrix}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{t.navbar.indicators.whatif}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{t.navbar.indicators.evidence}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{t.navbar.indicators.report}</span>
        </div>

        {/* Action Zone: Language Selector, History, Report, New Decision */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Multilingual Selector */}
          <LanguageSelector />

          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            aria-label={`${t.navbar.history} (${historyCount})`}
            title={`${t.navbar.history} (${historyCount})`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span className="hidden sm:inline">{t.navbar.history}</span>
            {historyCount > 0 && (
              <span className="px-1 py-0.2 font-mono text-[9px] sm:text-[10px] font-bold text-slate-300 bg-slate-800 rounded border border-slate-700">
                {historyCount}
              </span>
            )}
          </button>

          {hasActiveDecision && onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
              aria-label={t.navbar.exportReport}
              title={t.navbar.exportReport}
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="hidden sm:inline">{t.navbar.exportReport}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewDecision}
            className="inline-flex items-center justify-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            aria-label={t.navbar.newDecision}
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.navbar.newDecision}</span>
            <span className="sm:hidden text-[11px]">{t.navbar.newDecisionShort}</span>
          </button>
        </div>
      </div>
    </header>
  );
};


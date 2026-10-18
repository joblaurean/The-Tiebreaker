import React from 'react';
import { X, Clock, Trash2, ArrowRight, Database } from 'lucide-react';
import type { EnterpriseDecision } from '../../types/enterprise';
import { useTranslation, useLanguage } from '../../i18n';

interface EnterpriseHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: EnterpriseDecision[];
  onSelectDecision: (decision: EnterpriseDecision) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const EnterpriseHistoryDrawer: React.FC<EnterpriseHistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  const t = useTranslation();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    pt: 'pt-BR',
    fr: 'fr-FR',
    de: 'de-DE',
    zh: 'zh-CN',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight">{t.history.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto grow space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {t.history.emptyTitle}
              </p>
              <p className="text-xs text-slate-500">
                {t.history.emptyDesc}
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(localeMap[language] || 'en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white transition-all group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                      {formattedDate} · {item.department}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                      title={t.history.deleteTooltip}
                      aria-label={t.history.deleteTooltip}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                    className="text-xs font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors mb-2"
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 text-[10px] font-mono">
                      {item.options.length} {t.history.alternativesLabel} · {item.criteria.length} {t.history.criteriaLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>{t.history.openDecision}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {savedDecisions.length} {t.history.countDecisions}
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              {t.history.clearAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, History, PlusCircle, Share2, Compass, Database } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
                The Tiebreaker
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 rounded border border-indigo-400/30">
                Enterprise
              </span>
            </div>
            <span className="hidden md:block text-[11px] font-medium text-slate-400 whitespace-nowrap">
              {activeTitle ? `Decisión: ${activeTitle.slice(0, 36)}...` : 'Toma de Decisiones Cuantitativas'}
            </span>
          </div>
        </div>

        {/* Center BI Indicators */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Matriz Ponderada</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Análisis What-If</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Evidencia de Datos</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Reporte Ejecutivo</span>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            aria-label={`Historial (${historyCount})`}
            title={`Historial (${historyCount} evaluaciones guardadas)`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span className="hidden sm:inline">Historial</span>
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
              aria-label="Exportar informe ejecutivo"
              title="Exportar informe para stakeholders"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="hidden sm:inline">Reporte</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewDecision}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            aria-label="Nueva Evaluación Cuantitativa"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Nueva Decisión</span>
            <span className="sm:hidden text-[11px]">Nueva</span>
          </button>
        </div>
      </div>
    </header>
  );
};

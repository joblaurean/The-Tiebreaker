import React from 'react';
import { Scale, History, PlusCircle, Share2 } from 'lucide-react';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenExport?: () => void;
  hasActiveDecision: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenExport,
  hasActiveDecision,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Desempate
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-slate-500 whitespace-nowrap">
              Resuelve tus dilemas con IA
            </span>
          </div>
        </div>

        {/* Center Navigation / Status (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <span className="text-slate-500">
            Pros y Contras <span aria-hidden="true" className="mx-1">·</span> Tabla Comparativa <span aria-hidden="true" className="mx-1">·</span> DAFO <span aria-hidden="true" className="mx-1">·</span> Desempate
          </span>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
            aria-label={`Ver historial (${historyCount} guardados)`}
            title={`Historial (${historyCount} guardados)`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 font-mono text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 rounded">
                {historyCount}
              </span>
            )}
          </button>

          {hasActiveDecision && onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
              aria-label="Exportar informe de decisión"
              title="Exportar informe"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewDecision}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            aria-label="Plantear nuevo dilema"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Nuevo Dilema</span>
            <span className="xs:hidden sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

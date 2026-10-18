import React from 'react';
import { X, Clock, Trash2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import type { SavedDecision } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">Historial de Decisiones</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto grow space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Aún no tienes decisiones guardadas
              </p>
              <p className="text-xs text-slate-500">
                Cada vez que analices un dilema, se almacenará en este dispositivo para que puedas revisarlo o ajustar su ponderación en cualquier momento.
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => {
              const winner = item.analysis.options.find(
                (o) => o.id === item.analysis.verdict.winnerOptionId
              );
              const formattedDate = new Date(item.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {formattedDate}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                      title="Eliminar del historial"
                      aria-label="Eliminar decisión del historial"
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
                    {item.input.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 truncate max-w-[200px]">
                      Ganador: <strong>{winner?.name || 'Recomendado'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>Abrir</span>
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
              {savedDecisions.length} guardadas
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              Borrar todo el historial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

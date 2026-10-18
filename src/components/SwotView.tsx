import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, TrendingUp, Skull, Lightbulb, Grid2X2 } from 'lucide-react';
import type { DecisionOption } from '../types/decision';

interface SwotViewProps {
  options: DecisionOption[];
}

export const SwotView: React.FC<SwotViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [compareAll, setCompareAll] = useState(false);

  const currentOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const renderSwotGrid = (opt: DecisionOption) => {
    return (
      <div key={opt.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              Matriz Estratégica DAFO
            </div>
            <h3 className="text-lg font-bold text-slate-900">{opt.name}</h3>
          </div>
          <p className="text-xs text-slate-500 max-w-md">{opt.summary}</p>
        </div>

        {/* 2x2 DAFO Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fortalezas (Internas +) */}
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Fortalezas (Internas)
              </h4>
            </div>
            <ul className="space-y-2">
              {opt.swot.strengths.map((item, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Oportunidades (Externas +) */}
          <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-200/80">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-sky-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                Oportunidades (Externas)
              </h4>
            </div>
            <ul className="space-y-2">
              {opt.swot.opportunities.map((item, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Debilidades (Internas -) */}
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Debilidades (Internas)
              </h4>
            </div>
            <ul className="space-y-2">
              {opt.swot.weaknesses.map((item, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenazas (Externas -) */}
          <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-4 h-4 text-rose-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Amenazas (Externas)
              </h4>
            </div>
            <ul className="space-y-2">
              {opt.swot.threats.map((item, i) => (
                <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategic Recommendation Tip */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-900 block mb-0.5">
              Directriz Estratégica (Acción CAME)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {opt.swot.strategicTip}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedOptionId(opt.id);
                setCompareAll(false);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                !compareAll && currentOption.id === opt.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {String.fromCharCode(65 + idx)}. {opt.name}
            </button>
          ))}

          {options.length > 1 && (
            <button
              type="button"
              onClick={() => setCompareAll(!compareAll)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                compareAll
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Grid2X2 className="w-3.5 h-3.5" />
                <span>Comparar Ambas</span>
              </span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Análisis de Fortalezas, Oportunidades, Debilidades y Amenazas
        </div>
      </div>

      {compareAll ? (
        <div className="space-y-8">{options.map((opt) => renderSwotGrid(opt))}</div>
      ) : (
        renderSwotGrid(currentOption)
      )}
    </div>
  );
};

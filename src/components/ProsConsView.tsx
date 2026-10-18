import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Sliders,
  Scale,
} from 'lucide-react';
import type { DecisionOption, WeightedFactor } from '../types/decision';
import { calculateOptionScore } from '../utils/decisionCalculations';

interface ProsConsViewProps {
  options: DecisionOption[];
  onUpdateOptions: (updated: DecisionOption[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onUpdateOptions }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [newProText, setNewProText] = useState('');
  const [newConText, setNewConText] = useState('');
  const [newProWeight, setNewProWeight] = useState(3);
  const [newConWeight, setNewConWeight] = useState(3);

  const currentOption = options.find((o) => o.id === selectedOptionId) || options[0];
  if (!currentOption) return null;

  const scoreResult = calculateOptionScore(currentOption);

  const handleWeightChange = (factorId: string, isPro: boolean, newWeight: number) => {
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      if (isPro) {
        return {
          ...opt,
          pros: opt.pros.map((p) => (p.id === factorId ? { ...p, weight: newWeight } : p)),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) => (c.id === factorId ? { ...c, weight: newWeight } : c)),
        };
      }
    });
    onUpdateOptions(updated);
  };

  const handleDeleteFactor = (factorId: string, isPro: boolean) => {
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      if (isPro) {
        return { ...opt, pros: opt.pros.filter((p) => p.id !== factorId) };
      } else {
        return { ...opt, cons: opt.cons.filter((c) => c.id !== factorId) };
      }
    });
    onUpdateOptions(updated);
  };

  const handleAddPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim()) return;
    const newFactor: WeightedFactor = {
      id: `pro-custom-${Date.now()}`,
      text: newProText.trim(),
      weight: newProWeight,
      category: 'Personal',
    };
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return { ...opt, pros: [...opt.pros, newFactor] };
    });
    onUpdateOptions(updated);
    setNewProText('');
  };

  const handleAddCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim()) return;
    const newFactor: WeightedFactor = {
      id: `con-custom-${Date.now()}`,
      text: newConText.trim(),
      weight: newConWeight,
      category: 'Personal',
    };
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return { ...opt, cons: [...opt.cons, newFactor] };
    });
    onUpdateOptions(updated);
    setNewConText('');
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentOption.id === opt.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {String.fromCharCode(65 + idx)}. {opt.name}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium sm:text-right shrink-0">
          Ajusta los deslizadores de ponderación (1 a 5) para reflejar tus prioridades.
        </div>
      </div>

      {/* Option Summary & Score Balance Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Evaluando Alternativa
            </div>
            <h2 className="text-xl font-bold text-slate-900">{currentOption.name}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentOption.summary}</p>
          </div>

          {/* Net Score Balance Meter */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[260px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Balance Ponderado</span>
              <span
                className={`font-mono font-bold tabular-nums text-sm ${
                  scoreResult.netScore > 0
                    ? 'text-emerald-700'
                    : scoreResult.netScore < 0
                    ? 'text-rose-700'
                    : 'text-slate-700'
                }`}
              >
                {scoreResult.netScore > 0 ? `+${scoreResult.netScore}` : scoreResult.netScore} pts netos
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex mb-2">
              <div
                className="bg-emerald-600 transition-all duration-300"
                style={{ width: `${scoreResult.proRatio}%` }}
                title={`Ventajas: ${scoreResult.proSum} pts (${scoreResult.proRatio}%)`}
              />
              <div
                className="bg-rose-500 transition-all duration-300"
                style={{ width: `${100 - scoreResult.proRatio}%` }}
                title={`Desventajas: ${scoreResult.conSum} pts (${100 - scoreResult.proRatio}%)`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 font-mono tabular-nums">
              <span>{scoreResult.proSum} pts de pros</span>
              <span>{scoreResult.conSum} pts de contras</span>
            </div>
          </div>
        </div>

        {/* Side-by-side Pros and Cons List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Pros Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Ventajas y Pros ({currentOption.pros.length})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                +{scoreResult.proSum} pts
              </span>
            </div>

            <div className="space-y-3">
              {currentOption.pros.map((pro) => (
                <div
                  key={pro.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs font-semibold text-slate-900 leading-snug">
                      {pro.text}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteFactor(pro.id, true)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                      title="Eliminar ventaja"
                      aria-label="Eliminar ventaja"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {pro.explanation && (
                    <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
                      {pro.explanation}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {pro.category || 'Impacto'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Peso:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => handleWeightChange(pro.id, true, w)}
                            className={`w-5 h-5 rounded text-[11px] font-mono font-semibold transition-colors ${
                              pro.weight === w
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={`Nivel de importancia: ${w}`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Pro Input */}
            <form onSubmit={handleAddPro} className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newProText}
                  onChange={(e) => setNewProText(e.target.value)}
                  placeholder="Añadir otra ventaja personal..."
                  className="grow px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
                <select
                  value={newProWeight}
                  onChange={(e) => setNewProWeight(Number(e.target.value))}
                  className="px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  title="Peso de la ventaja"
                >
                  <option value={1}>1 (Bajo)</option>
                  <option value={2}>2</option>
                  <option value={3}>3 (Medio)</option>
                  <option value={4}>4</option>
                  <option value={5}>5 (Crítico)</option>
                </select>
                <button
                  type="submit"
                  disabled={!newProText.trim()}
                  className="p-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg shrink-0"
                  aria-label="Guardar nueva ventaja"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Cons Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Desventajas y Contras ({currentOption.cons.length})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 tabular-nums">
                -{scoreResult.conSum} pts
              </span>
            </div>

            <div className="space-y-3">
              {currentOption.cons.map((con) => (
                <div
                  key={con.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs font-semibold text-slate-900 leading-snug">
                      {con.text}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteFactor(con.id, false)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                      title="Eliminar contra"
                      aria-label="Eliminar contra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {con.explanation && (
                    <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
                      {con.explanation}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {con.category || 'Fricción'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Fricción:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => handleWeightChange(con.id, false, w)}
                            className={`w-5 h-5 rounded text-[11px] font-mono font-semibold transition-colors ${
                              con.weight === w
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={`Nivel de fricción: ${w}`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Con Input */}
            <form onSubmit={handleAddCon} className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newConText}
                  onChange={(e) => setNewConText(e.target.value)}
                  placeholder="Añadir otra desventaja o riesgo..."
                  className="grow px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
                <select
                  value={newConWeight}
                  onChange={(e) => setNewConWeight(Number(e.target.value))}
                  className="px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  title="Peso de la desventaja"
                >
                  <option value={1}>1 (Leve)</option>
                  <option value={2}>2</option>
                  <option value={3}>3 (Moderado)</option>
                  <option value={4}>4</option>
                  <option value={5}>5 (Grave)</option>
                </select>
                <button
                  type="submit"
                  disabled={!newConText.trim()}
                  className="p-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg shrink-0"
                  aria-label="Guardar nueva desventaja"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

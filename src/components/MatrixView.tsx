import React from 'react';
import { Table, Check, Award, SlidersHorizontal, Info } from 'lucide-react';
import type { Criterion, DecisionOption, CriterionRating } from '../types/decision';
import { calculateMatrixScores } from '../utils/decisionCalculations';

interface MatrixViewProps {
  options: DecisionOption[];
  criteria: Criterion[];
  ratings: Record<string, Record<string, CriterionRating>>;
  onUpdateCriteria: (updatedCriteria: Criterion[]) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  options,
  criteria,
  ratings,
  onUpdateCriteria,
}) => {
  const matrixResult = calculateMatrixScores(options, criteria, ratings);

  const handleCriterionWeightChange = (criterionId: string, newWeight: number) => {
    const updated = criteria.map((c) => (c.id === criterionId ? { ...c, weight: newWeight } : c));
    onUpdateCriteria(updated);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Weighted Scores Summary Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-700" />
              <span>Matriz Comparativa Multicriterio (1 a 10)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Evaluación Objetiva por Dimensiones
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Cada alternativa se evalúa objetivamente en las dimensiones clave. Puedes alterar la ponderación de los criterios para observar cómo cambia el desempate.
            </p>
          </div>

          {matrixResult.isTie && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 font-medium">
              Empate técnico: La diferencia entre las mejores opciones es menor a 0.35 pts.
            </div>
          )}
        </div>

        {/* Head-to-Head Weighted Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {options.map((opt, idx) => {
            const scoreData = matrixResult.optionScores[opt.id] || { weightedScore: 0, rawTotal: 0 };
            const isLeader = matrixResult.leaderOptionId === opt.id;

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isLeader
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs font-bold ${
                      isLeader ? 'text-indigo-300' : 'text-slate-500'
                    }`}
                  >
                    Opción {String.fromCharCode(65 + idx)}
                  </span>
                  {isLeader && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                      <Award className="w-3 h-3" />
                      <span>Líder</span>
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mb-2 leading-tight" title={opt.name}>
                  {opt.name}
                </div>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-mono text-3xl font-extrabold tabular-nums">
                    {scoreData.weightedScore.toFixed(2)}
                  </span>
                  <span className={`text-xs ${isLeader ? 'text-slate-400' : 'text-slate-500'}`}>
                    / 10
                  </span>
                </div>

                {/* Relative progress bar */}
                <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isLeader ? 'bg-indigo-400' : 'bg-slate-700'
                    }`}
                    style={{ width: `${Math.min(100, (scoreData.weightedScore / 10) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multicriteria Interactive Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-1/3">Criterio de Decisión</th>
                <th className="py-3.5 px-4 text-center w-28">Importancia</th>
                {options.map((opt, idx) => (
                  <th key={opt.id} className="py-3.5 px-4 text-left">
                    <span className="text-slate-900">
                      {String.fromCharCode(65 + idx)}. {opt.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {criteria.map((crit) => {
                // Find highest score in this row
                let maxRowScore = -1;
                options.forEach((opt) => {
                  const s = ratings[opt.id]?.[crit.id]?.score ?? 0;
                  if (s > maxRowScore) maxRowScore = s;
                });

                return (
                  <tr key={crit.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Criterion Title and Description */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-slate-900 text-sm mb-1">{crit.name}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {crit.description}
                      </div>
                    </td>

                    {/* Weight Controls */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => handleCriterionWeightChange(crit.id, w)}
                            className={`w-4 h-4 rounded text-[10px] font-mono font-semibold transition-colors ${
                              crit.weight === w
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title={`Peso: ${w} de 5`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        ×{crit.weight}
                      </div>
                    </td>

                    {/* Ratings per option */}
                    {options.map((opt) => {
                      const rating = ratings[opt.id]?.[crit.id] || {
                        score: 5,
                        rationale: 'Sin calificar',
                      };
                      const isTopInRow = rating.score === maxRowScore && maxRowScore > 0;

                      return (
                        <td key={opt.id} className="py-4 px-4 align-top">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-mono font-extrabold text-sm tabular-nums ${
                                isTopInRow ? 'text-slate-900 font-black' : 'text-slate-700'
                              }`}
                            >
                              {rating.score} / 10
                            </span>
                            {isTopInRow && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                                Mejor
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {rating.rationale}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/70 border-t-2 border-slate-300 text-xs font-bold text-slate-900">
                <td className="py-4 px-4">Puntuación Ponderada Final</td>
                <td className="py-4 px-4 text-center font-mono tabular-nums text-slate-500">
                  Total
                </td>
                {options.map((opt) => {
                  const scoreData = matrixResult.optionScores[opt.id] || { weightedScore: 0 };
                  const isLeader = matrixResult.leaderOptionId === opt.id;

                  return (
                    <td key={opt.id} className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold tabular-nums">
                          {scoreData.weightedScore.toFixed(2)} pts
                        </span>
                        {isLeader && (
                          <span className="text-[11px] font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
                            Ganador
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

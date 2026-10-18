import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import type { EnterpriseCriterion, EnterpriseOption, CriterionRatingItem, SensitivityAnalysisResult } from '../../types/enterprise';
import { calculateCompositeScores, runFullSensitivityAnalysis } from '../../utils/enterpriseDecision';

interface SensitivityViewProps {
  options: EnterpriseOption[];
  criteria: EnterpriseCriterion[];
  ratings: Record<string, Record<string, CriterionRatingItem>>;
  baseCriteria: EnterpriseCriterion[];
  onUpdateCriteriaWeights: (updatedCriteria: EnterpriseCriterion[]) => void;
  onResetWeights: () => void;
}

export const SensitivityView: React.FC<SensitivityViewProps> = ({
  options,
  criteria,
  ratings,
  baseCriteria,
  onUpdateCriteriaWeights,
  onResetWeights,
}) => {
  const currentResult = calculateCompositeScores(options, criteria, ratings);
  const sensitivityResult = runFullSensitivityAnalysis(options, criteria, ratings);
  const currentWinner = options.find((o) => o.id === currentResult.winnerOptionId) || options[0];

  const handleSliderChange = (criterionId: string, newWeight: number) => {
    // Single slider change with proportional redistribution
    const otherCriteria = criteria.filter((c) => c.id !== criterionId);
    const sumOthers = otherCriteria.reduce((sum, c) => sum + c.weightPercent, 0);
    const clampedNew = Math.max(0, Math.min(100, newWeight));
    const remaining = 100 - clampedNew;

    const updated = criteria.map((c) => {
      if (c.id === criterionId) {
        return { ...c, weightPercent: clampedNew };
      }
      const fraction = sumOthers > 0 ? c.weightPercent / sumOthers : 1 / otherCriteria.length;
      return {
        ...c,
        weightPercent: Number((fraction * remaining).toFixed(1)),
      };
    });

    onUpdateCriteriaWeights(updated);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Stability Gauge */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Simulador What-If de Sensibilidad</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Análisis de Robustez y Criterios Críticos
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Modifica los pesos en tiempo real para simular distintos escenarios de negociación entre stakeholders (Dirección Financiera vs. Operaciones vs. Seguridad) y evalúa si la decisión cambia de ganador.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetWeights}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Pesos Base</span>
            </button>
          </div>
        </div>

        {/* Stability Index Summary Bar */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold mb-1">
              Alternativa Ganadora Actual
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-slate-900 text-base truncate">
                {currentWinner.name}
              </span>
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {currentWinner.code}
              </span>
            </div>
            <div className="font-mono text-sm font-extrabold text-indigo-600 mt-1 tabular-nums">
              Score: {currentResult.scores[currentWinner.id]?.toFixed(2)} / 10
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Índice de Estabilidad</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {sensitivityResult.stabilityIndex}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  sensitivityResult.stabilityIndex >= 70
                    ? 'bg-emerald-500'
                    : sensitivityResult.stabilityIndex >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${sensitivityResult.stabilityIndex}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {sensitivityResult.stabilityIndex >= 70
                ? 'Robusto ante desacuerdos de prioridades'
                : 'Sensible a la priorización'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold mb-1">
              Margen de Victoria vs #2
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              +{currentResult.scoreGap.toFixed(2)} pts
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {currentResult.scoreGap >= 0.5 ? 'Ventaja sólida' : 'Empate técnico potencial'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive What-If Sliders Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Ajuste Dinámico de Ponderación (%)
            </h3>
            <span className="text-[11px] text-slate-500">
              Suma fija: 100%
            </span>
          </div>

          <div className="space-y-4">
            {criteria.map((crit) => {
              const baseWeight = baseCriteria.find((b) => b.id === crit.id)?.weightPercent ?? crit.weightPercent;
              const delta = Number((crit.weightPercent - baseWeight).toFixed(1));

              return (
                <div key={crit.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{crit.name}</span>
                      <span className="ml-2 text-[10px] text-slate-500 font-mono">
                        {crit.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {crit.weightPercent.toFixed(1)}%
                      </span>
                      {delta !== 0 && (
                        <span className={`font-mono text-[10px] font-bold ${delta > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                          ({delta > 0 ? `+${delta}` : delta}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={crit.weightPercent}
                    onChange={(e) => handleSliderChange(crit.id, Number(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>0% (Sin impacto)</span>
                    <span>Base: {baseWeight}%</span>
                    <span>80% (Prioridad absoluta)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Alternative Ranking & Switch Points */}
        <div className="space-y-6">
          {/* Live Ranking Scoreboard */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Ranking en Tiempo Real</span>
              <span className="text-xs font-normal text-slate-500">Escenario Activo</span>
            </h3>

            <div className="space-y-3">
              {[...options]
                .sort((a, b) => (currentResult.scores[b.id] ?? 0) - (currentResult.scores[a.id] ?? 0))
                .map((opt, rankIdx) => {
                  const score = currentResult.scores[opt.id] ?? 0;
                  const isFirst = rankIdx === 0;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isFirst
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            isFirst ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rankIdx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-900">{opt.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">({opt.code})</span>
                        </div>
                        <span className="font-mono text-sm font-extrabold tabular-nums text-slate-900">
                          {score.toFixed(2)} pts
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            isFirst ? 'bg-indigo-600' : 'bg-slate-400'
                          }`}
                          style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Switch Points / Umbrales de Quiebre */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Puntos de Quiebre (Switch Points)</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Muestra a qué umbral exacto de peso una alternativa competidora superaría a la opción líder actual:
            </p>

            <div className="space-y-3">
              {sensitivityResult.switchPoints.length === 0 ? (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    No existe ningún punto de quiebre simple: la opción recomendada domina en todos los rangos razonables de ponderación.
                  </span>
                </div>
              ) : (
                sensitivityResult.switchPoints.map((sp, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-950">
                    <div className="font-bold mb-1 flex items-center justify-between">
                      <span>Criterio: {sp.criterionName}</span>
                      <span className="font-mono text-[11px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                        Umbral: {sp.switchWeightPercent}% (Actual: {sp.currentWeightPercent}%)
                      </span>
                    </div>
                    <p className="leading-relaxed text-amber-900">
                      {sp.insightDescription}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

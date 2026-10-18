import React from 'react';
import { Award, ShieldCheck, Database, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import type { EnterpriseDecision } from '../../types/enterprise';
import { calculateCompositeScores } from '../../utils/enterpriseDecision';

interface EnterpriseHeaderKpisProps {
  decision: EnterpriseDecision;
}

export const EnterpriseHeaderKpis: React.FC<EnterpriseHeaderKpisProps> = ({ decision }) => {
  const matrixResult = calculateCompositeScores(decision.options, decision.criteria, decision.ratings);
  const winner = decision.options.find((o) => o.id === matrixResult.winnerOptionId) || decision.options[0];
  const runnerUp = decision.options.find((o) => o.id === matrixResult.runnerUpOptionId);
  const winnerScore = matrixResult.scores[winner?.id ?? ''] ?? 0;

  // Total empirical data evidence count
  const totalEvidenceCount = decision.options.reduce((acc, opt) => acc + (opt.dataEvidence?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* KPI 1: Leading Alternative */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Alternativa Líder</span>
          </span>
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
            {winner?.code}
          </span>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 truncate mb-1" title={winner?.name}>
            {winner?.name}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {winnerScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 10 pts</span>
            {runnerUp && (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                +{matrixResult.scoreGap.toFixed(2)} vs #2
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI 2: Decision Stability & What-If Robustness */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Índice de Estabilidad</span>
          </span>
          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
            decision.sensitivity.stabilityIndex >= 70
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-amber-50 text-amber-800'
          }`}>
            {decision.sensitivity.stabilityIndex >= 70 ? 'Robusta' : 'Sensible'}
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {decision.sensitivity.stabilityIndex}%
            </span>
            <span className="text-xs text-slate-500">resiliencia a pesos</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {decision.sensitivity.switchPoints.length === 0
              ? 'El líder se mantiene en el 100% de los rangos.'
              : `${decision.sensitivity.switchPoints.length} puntos de quiebre identificados.`}
          </p>
        </div>
      </div>

      {/* KPI 3: Data-Backed Metrics */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Evidencias Cuantitativas</span>
          </span>
          <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-bold">
            Verificadas
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {totalEvidenceCount}
            </span>
            <span className="text-xs text-slate-500">métricas con fuente</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight truncate">
            Snowflake, BigQuery, Datadog & SLAs
          </p>
        </div>
      </div>

      {/* KPI 4: Financial Footprint */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>OPEX Anual (Líder)</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            TTV: {winner?.timeToValueWeeks} sem
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              ${(winner?.opexAnnualUsd ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">/ año</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            CAPEX inicial: ${(winner?.capexUsd ?? 0).toLocaleString()} USD
          </p>
        </div>
      </div>
    </div>
  );
};

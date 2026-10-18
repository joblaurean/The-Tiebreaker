import React, { useState } from 'react';
import {
  Trophy,
  Zap,
  Clock,
  RotateCcw,
  Coins,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { DecisionAnalysis, DecisionOption } from '../types/decision';

interface VerdictViewProps {
  analysis: DecisionAnalysis;
  onNavigateTab: (tab: 'proscons' | 'matrix' | 'swot') => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ analysis, onNavigateTab }) => {
  const { verdict, options } = analysis;
  const winner = options.find((o) => o.id === verdict.winnerOptionId) || options[0];

  // Coin Flip State for the Emotional Tiebreaker Test
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<DecisionOption | null>(null);
  const [hasFlipped, setHasFlipped] = useState(false);

  const handleFlipCoin = () => {
    if (coinFlipping) return;
    setCoinFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setCoinResult(options[randomIndex]);
      setCoinFlipping(false);
      setHasFlipped(true);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Primary Verdict Announcement */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Veredicto Recomendado de Desempate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              {verdict.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {verdict.rationale}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none">
            <div className="text-xs text-slate-500 font-medium">Índice de Certeza</div>
            <div className="font-mono text-3xl font-extrabold text-slate-900 tabular-nums">
              {verdict.confidenceScore}%
            </div>
            <div className="text-[11px] text-slate-500">
              {verdict.isCloseCall ? 'Dilema muy ajustado' : 'Ventaja analítica clara'}
            </div>
          </div>
        </div>

        {/* Decisive Tiebreaker Pivot Factor */}
        <div className="mt-6 p-4 rounded-lg bg-amber-50/60 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                El Factor de Desempate Decisivo
              </div>
              <p className="text-sm text-amber-950 leading-relaxed font-medium">
                {verdict.decisiveFactor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: 10/10/10 Rule and Reversibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The 10/10/10 Horizon Rule (Suzy Welch) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>Regla del Horizonte Temporal (10 / 10 / 10)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Evalúa las consecuencias de elegir «{winner.name}» en tres momentos vitales para neutralizar el miedo inicial:
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>En 10 Minutos</span>
                  <span className="font-mono text-[11px] text-slate-500">Inmediato</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {verdict.tenTenTenRule.tenMinutes}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>En 10 Meses</span>
                  <span className="font-mono text-[11px] text-slate-500">Medio Plazo</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {verdict.tenTenTenRule.tenMonths}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>En 10 Años</span>
                  <span className="font-mono text-[11px] text-slate-500">Largo Plazo</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {verdict.tenTenTenRule.tenYears}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reversibility & Pre-Mortem Safeguard */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          {/* Reversibility Meter (Bezos Type 1 vs Type 2) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <RotateCcw className="w-4 h-4 text-slate-700" />
                <span>Índice de Reversibilidad</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                {verdict.reversibilityScore} / 10
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div
                className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, verdict.reversibilityScore * 10)}%` }}
              />
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              {verdict.reversibilityScore >= 7 ? (
                <span>
                  <strong>Decisión Puerta de Dos Sentidos (Type 2):</strong> Es altamente reversible. Si tras implementarla no funciona, puedes retroceder o pivotar con mínimo coste. Conviene decidir rápido.
                </span>
              ) : verdict.reversibilityScore >= 4 ? (
                <span>
                  <strong>Decisión Semirreversible:</strong> Retroceder tiene un coste moderado de tiempo o recursos. Establece un punto de control a los 60-90 días.
                </span>
              ) : (
                <span>
                  <strong>Decisión Puerta de Un Sentido (Type 1):</strong> Es casi irreversible. Exige máxima deliberación y plan de contingencia claro.
                </span>
              )}
            </div>
          </div>

          {/* Pre-Mortem Safeguard Plan */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              <ShieldAlert className="w-4 h-4 text-slate-800" />
              <span>Análisis Pre-Mortem de Seguridad</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {verdict.preMortemAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* The Emotional Gut-Check: Interactive Coin Flip Test */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <Coins className="w-4 h-4 text-slate-700" />
            <span>El Test Emocional del Desempate (Psicología de la Moneda)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            ¿Tu intuición coincide con el análisis racional?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            {verdict.blindTestPrompt}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleFlipCoin}
            disabled={coinFlipping}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
          >
            <Coins className={`w-4 h-4 ${coinFlipping ? 'animate-spin' : ''}`} />
            <span>{coinFlipping ? 'Lanzando moneda al aire...' : 'Lanzar Moneda de Prueba'}</span>
          </button>

          {hasFlipped && coinResult && (
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-900 flex items-center gap-2">
              <span className="font-semibold">La moneda ha dictado:</span>
              <span className="font-bold underline decoration-indigo-500 decoration-2">
                {coinResult.name}
              </span>
              <span className="text-slate-500 text-[11px] ml-1">
                (¿Qué sentiste en el primer microsegundo? ¿Alivio o ganas de volver a tirar?)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Quick Triggers to other Deep Views */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          type="button"
          onClick={() => onNavigateTab('proscons')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-left transition-colors group"
        >
          <div className="text-xs text-slate-400 font-semibold mb-1">Paso siguiente</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
            <span>Ajustar Pros & Contras</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('matrix')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-left transition-colors group"
        >
          <div className="text-xs text-slate-400 font-semibold mb-1">Comparativa</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
            <span>Ver Matriz de Criterios</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('swot')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-left transition-colors group"
        >
          <div className="text-xs text-slate-400 font-semibold mb-1">Estrategia</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
            <span>Explorar Análisis DAFO</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

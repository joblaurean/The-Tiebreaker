import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  Briefcase,
  Compass,
  ArrowRight,
} from 'lucide-react';
import type { DecisionCategory, DecisionInput, RiskTolerance } from '../types/decision';
import { PRESET_DILEMMAS } from '../data/presets';

interface DilemmaFormProps {
  onSubmit: (input: DecisionInput) => void;
  isLoading: boolean;
}

const CATEGORIES: { id: DecisionCategory; label: string }[] = [
  { id: 'career', label: 'Carrera & Trabajo' },
  { id: 'finance', label: 'Finanzas & Inversión' },
  { id: 'business', label: 'Negocio & Estrategia' },
  { id: 'lifestyle', label: 'Hogar & Estilo de Vida' },
  { id: 'education', label: 'Educación & Cursos' },
  { id: 'tech', label: 'Tecnología & Proyectos' },
];

const RISK_LEVELS: { id: RiskTolerance; label: string; desc: string }[] = [
  { id: 'low', label: 'Bajo Riesgo', desc: 'Priorizar seguridad y preservación de lo actual.' },
  { id: 'moderate', label: 'Equilibrado', desc: 'Riesgo calculado para crecimiento sostenido.' },
  { id: 'high', label: 'Audaz / Asimétrico', desc: 'Máximo potencial asumiendo mayor incertidumbre.' },
];

export const DilemmaForm: React.FC<DilemmaFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState<DecisionCategory>('career');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('moderate');
  const [optionNames, setOptionNames] = useState<string[]>([
    '',
    '',
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const found = PRESET_DILEMMAS.find((p) => p.id === presetId);
    if (!found) return;
    setTitle(found.data.title);
    setContext(found.data.context);
    setCategory(found.data.category);
    setRiskTolerance(found.data.riskTolerance);
    setOptionNames([...found.data.optionNames]);
    setValidationError(null);
  };

  const handleAddOption = () => {
    if (optionNames.length >= 4) return;
    setOptionNames([...optionNames, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (optionNames.length <= 2) return;
    setOptionNames(optionNames.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...optionNames];
    updated[index] = value;
    setOptionNames(updated);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Por favor escribe la decisión o dilema que necesitas resolver.');
      return;
    }

    const cleanOptions = optionNames.map((o) => o.trim()).filter((o) => o.length > 0);
    if (cleanOptions.length < 2) {
      setValidationError('Debes plantear al menos 2 opciones o alternativas a comparar.');
      return;
    }

    setValidationError(null);
    onSubmit({
      title: title.trim(),
      context: context.trim(),
      category,
      riskTolerance,
      optionNames: cleanOptions,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Editorial Intro Banner */}
      <div className="mb-5 sm:mb-8 text-center max-w-2xl mx-auto px-1">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance mb-2 sm:mb-3">
          El fin de la parálisis por análisis
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Plantea tu dilema. La inteligencia artificial desglosará pros y contras ponderados, una tabla comparativa multicriterio, un análisis DAFO y el factor de desempate decisivo.
        </p>
      </div>

      {/* Preset Quick Starters */}
      <div className="mb-5 sm:mb-8 p-3 sm:p-4 rounded-xl bg-white border border-slate-200">
        <div className="flex items-center justify-between gap-4 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 shrink-0" />
            <span>Casos reales de prueba (1 clic para rellenar)</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {PRESET_DILEMMAS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.id)}
              className="text-left p-2.5 sm:p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors group flex flex-col justify-between"
            >
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mb-1 truncate">
                {preset.badge}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dilemma Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-8 space-y-4 sm:space-y-6">
        {/* Dilemma Title */}
        <div>
          <label htmlFor="dilemma-title" className="block text-sm font-bold text-slate-900 mb-1.5">
            1. ¿Cuál es el dilema o decisión que debes tomar? *
          </label>
          <input
            id="dilemma-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Ej.: ¿Debería aceptar una nueva oferta laboral remota o continuar en mi empresa actual?"
            className="w-full px-4 py-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Options to Compare */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-900">
              2. Opciones o alternativas a evaluar (mínimo 2) *
            </label>
            {optionNames.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                disabled={isLoading}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir opción</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {optionNames.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 shrink-0 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center border border-slate-200">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'Opción A (ej.: Aceptar la oferta de la startup remota)'
                      : idx === 1
                      ? 'Opción B (ej.: Quedarme y asumir el ascenso pactado)'
                      : `Opción ${String.fromCharCode(65 + idx)}`
                  }
                  className="grow px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 transition-colors"
                  disabled={isLoading}
                />
                {optionNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                    title="Eliminar opción"
                    aria-label={`Eliminar opción ${String.fromCharCode(65 + idx)}`}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Context & Personal Priorities */}
        <div>
          <label htmlFor="dilemma-context" className="block text-sm font-bold text-slate-900 mb-1.5">
            3. Contexto, prioridades personales o miedos (opcional pero muy valioso)
          </label>
          <textarea
            id="dilemma-context"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Ej.: Valoro mucho tener tiempo para mi familia y salud, pero también necesito incrementar mis ahorros este año. Me preocupa el síndrome del impostor..."
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 transition-colors resize-y"
            disabled={isLoading}
          />
        </div>

        {/* Category & Risk Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="dilemma-category" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Categoría
            </label>
            <select
              id="dilemma-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as DecisionCategory)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              disabled={isLoading}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Tolerancia al Riesgo
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {RISK_LEVELS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRiskTolerance(r.id)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    riskTolerance === r.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  disabled={isLoading}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analizando opciones con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>Analizar y Desempatar Decisión</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
          <div className="text-center text-[12px] text-slate-500 mt-2">
            Genera Pros & Contras Ponderados · Matriz Multicriterio · Análisis DAFO · Test de la Moneda
          </div>
        </div>
      </form>
    </div>
  );
};

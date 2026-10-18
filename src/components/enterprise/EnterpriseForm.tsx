import React, { useState } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Sliders,
} from 'lucide-react';
import type { EnterpriseDecisionInput } from '../../types/enterprise';
import { ENTERPRISE_PRESETS } from '../../data/enterprisePresets';

interface EnterpriseFormProps {
  onSubmit: (input: EnterpriseDecisionInput) => void;
  isLoading: boolean;
}

export const EnterpriseForm: React.FC<EnterpriseFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [businessObjective, setBusinessObjective] = useState('');
  const [department, setDepartment] = useState('Data & Analytics');
  const [optionNames, setOptionNames] = useState<string[]>(['', '']);
  const [budgetConstraintUsd, setBudgetConstraintUsd] = useState<number | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const found = ENTERPRISE_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setTitle(found.input.title);
    setBusinessObjective(found.input.businessObjective);
    setDepartment(found.input.department);
    setOptionNames([...found.input.optionNames]);
    setBudgetConstraintUsd(found.input.budgetConstraintUsd);
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

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...optionNames];
    updated[index] = val;
    setOptionNames(updated);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Por favor indica el título de la decisión empresarial a evaluar.');
      return;
    }

    const clean = optionNames.map((o) => o.trim()).filter((o) => o.length > 0);
    if (clean.length < 2) {
      setValidationError('Debes plantear al menos 2 alternativas o proveedores a comparar.');
      return;
    }

    setValidationError(null);
    onSubmit({
      title: title.trim(),
      businessObjective: businessObjective.trim(),
      department: department.trim() || 'Data & Analytics',
      optionNames: clean,
      budgetConstraintUsd,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-8 space-y-4 sm:space-y-6">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 text-slate-200 text-[10px] sm:text-xs font-semibold tracking-wide border border-slate-700">
          <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
          <span>The Tiebreaker: Enterprise Edition</span>
        </div>
        <h1 className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
          Toma de Decisiones Cuantitativa para Líderes de Datos & Proyectos
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-xl mx-auto">
          Matrices de Decisión Ponderadas (PCDA), simulaciones de sensibilidad What-If, evidencias empíricas y reportes ejecutivos.
        </p>
      </div>

      {/* Enterprise Presets Bar (Horizontal swipeable on mobile) */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Escenarios de Prueba (1 clic para cargar)
          </span>
          <span className="text-[10px] text-indigo-600 font-medium sm:hidden">Desliza para ver más →</span>
        </div>
        <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
          {ENTERPRISE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p.id)}
              className="min-w-[210px] sm:min-w-0 p-2.5 sm:p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group flex flex-col justify-between shrink-0 bg-slate-50/50 sm:bg-white"
            >
              <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                {p.badge}
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Title */}
        <div>
          <label htmlFor="ent-title" className="block text-sm font-bold text-slate-900 mb-1.5">
            1. Título de la Decisión / Iniciativa Estratégica *
          </label>
          <input
            id="ent-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="ej. Selección de Data Warehouse Central: Snowflake vs Databricks vs BigQuery"
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            disabled={isLoading}
          />
        </div>

        {/* Business Objective / OKR */}
        <div>
          <label htmlFor="ent-objective" className="block text-sm font-bold text-slate-900 mb-1.5">
            2. Objetivo de Negocio & OKRs Asociados (Métricas Cuantitativas Esperadas)
          </label>
          <textarea
            id="ent-objective"
            rows={2}
            value={businessObjective}
            onChange={(e) => setBusinessObjective(e.target.value)}
            placeholder="ej. Reducir latencia de consultas P95 a <2s, recortar el OPEX de infraestructura en 25% y asegurar cumplimiento SOC2."
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            disabled={isLoading}
          />
        </div>

        {/* Alternatives / Options to Compare */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-900">
              3. Alternativas Tecnológicas / Proveedores a Evaluar (mínimo 2) *
            </label>
            {optionNames.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                disabled={isLoading}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Alternativa</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {optionNames.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-16 h-9 shrink-0 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center border border-slate-200">
                  ALT-0{idx + 1}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'Alternativa 1 (ej. Snowflake Data Cloud)'
                      : idx === 1
                      ? 'Alternativa 2 (ej. Databricks Lakehouse Platform)'
                      : `Alternativa ${idx + 1}`
                  }
                  className="grow px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  disabled={isLoading}
                />
                {optionNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                    title="Eliminar alternativa"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Department and Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="ent-dept" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Departamento / Área Propietaria
            </label>
            <input
              id="ent-dept"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="ej. Data Platform / Cloud Engineering"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="ent-budget" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Presupuesto Límite Estimado (USD, opcional)
            </label>
            <input
              id="ent-budget"
              type="number"
              placeholder="ej. 150000"
              value={budgetConstraintUsd ?? ''}
              onChange={(e) => setBudgetConstraintUsd(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono"
              disabled={isLoading}
            />
          </div>
        </div>

        {validationError && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generando Matriz Cuantitativa & Análisis What-If...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Construir Evaluación Cuantitativa de Decisión</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

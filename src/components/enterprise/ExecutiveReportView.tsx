import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Award,
  Calendar,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { EnterpriseDecision } from '../../types/enterprise';
import { calculateCompositeScores } from '../../utils/enterpriseDecision';

interface ExecutiveReportViewProps {
  decision: EnterpriseDecision;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({ decision }) => {
  const [copied, setCopied] = useState(false);
  const matrixResult = calculateCompositeScores(decision.options, decision.criteria, decision.ratings);
  const winner = decision.options.find((o) => o.id === decision.executiveReport.winningOptionId) || decision.options[0];

  const generateFullMarkdown = (): string => {
    let md = `# REPORTE EJECUTIVO DE DECISIÓN: ${decision.title}\n`;
    md += `*The Tiebreaker: Enterprise Edition — Fecha: ${new Date(decision.createdAt).toLocaleDateString('es-ES')}*\n`;
    md += `*Departamento: ${decision.department} | Objetivo de Negocio: ${decision.businessObjective}*\n\n`;

    md += `## 1. RECOMENDACIÓN ESTRATÉGICA\n`;
    md += `**Dictamen:** ${decision.executiveReport.recommendationHeadline}\n\n`;
    md += `> ${decision.executiveReport.executiveSummary}\n\n`;
    md += `- **Puntuación Compuesta Ponderada:** ${matrixResult.scores[winner.id]?.toFixed(2)} / 10\n`;
    md += `- **Margen sobre 2.ª opción:** +${matrixResult.scoreGap.toFixed(2)} puntos\n`;
    md += `- **Índice de Estabilidad What-If:** ${decision.sensitivity.stabilityIndex}% (Resiliencia alta a cambios de peso)\n\n`;

    md += `## 2. COMPROMISOS & TRADE-OFFS CLAVE\n`;
    decision.executiveReport.keyTradeOffs.forEach((t) => {
      md += `- ${t}\n`;
    });
    md += `\n`;

    md += `## 3. JUSTIFICACIÓN CUANTITATIVA PARA STAKEHOLDERS & FINANZAS\n`;
    md += `${decision.executiveReport.stakeholderJustification}\n\n`;

    md += `## 4. MATRIZ DE DECISIÓN MULTICRITERIO RESUMIDA\n`;
    md += `| Criterio | Peso | ${decision.options.map((o) => `${o.code} (${o.name})`).join(' | ')} |\n`;
    md += `| :--- | :---: | ${decision.options.map(() => ':---:').join(' | ')} |\n`;
    decision.criteria.forEach((c) => {
      const scores = decision.options.map((o) => `${decision.ratings[o.id]?.[c.id]?.score.toFixed(1) ?? '-'}/10`);
      md += `| ${c.name} (${c.category}) | ${c.weightPercent}% | ${scores.join(' | ')} |\n`;
    });
    md += `| **Puntuación Final Ponderada** | 100% | ${decision.options.map((o) => `**${(matrixResult.scores[o.id] ?? 0).toFixed(2)} pts**`).join(' | ')} |\n\n`;

    md += `## 5. HOJA DE RUTA DE IMPLEMENTACIÓN\n`;
    decision.executiveReport.roadmap.forEach((r) => {
      md += `### ${r.phase} (${r.timeline})\n`;
      md += `- **Hito:** ${r.milestone}\n`;
      md += `- **Responsable:** ${r.owner}\n\n`;
    });

    md += `## 6. PLAN DE MITIGACIÓN DE RIESGOS\n`;
    decision.executiveReport.riskMitigation.forEach((rm) => {
      md += `- **[Riesgo - Severidad ${rm.severity}]** ${rm.risk}\n`;
      md += `  *Plan de contingencia:* ${rm.contingency}\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Documento para Comité de Dirección & Stakeholders</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Dossier Ejecutivo de Decisión Basado en Datos
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Corporate Executive Document Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 font-sans">
        {/* Title Header Lockup */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>REF: DEC-{decision.id.slice(-6).toUpperCase()}</span>
            <span>Fecha de Emisión: {new Date(decision.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {decision.executiveReport.recommendationHeadline}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Departamento: <strong>{decision.department}</strong> · Objetivo: {decision.businessObjective}
          </p>
        </div>

        {/* Executive Summary Card */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Resumen Ejecutivo para Stakeholders</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-normal">
            {decision.executiveReport.executiveSummary}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 font-mono">
            <span>Score Compuesto: <strong>{matrixResult.scores[winner.id]?.toFixed(2)} / 10</strong></span>
            <span>·</span>
            <span>Margen vs #2: <strong>+{matrixResult.scoreGap.toFixed(2)} pts</strong></span>
            <span>·</span>
            <span>Estabilidad What-If: <strong>{decision.sensitivity.stabilityIndex}%</strong></span>
          </div>
        </div>

        {/* Key Trade-Offs Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Compromisos & Trade-Offs Asumidos</span>
          </h3>
          <ul className="space-y-2">
            {decision.executiveReport.keyTradeOffs.map((tradeoff, i) => (
              <li key={i} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{tradeoff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stakeholder Justification */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Justificación Financiera y Operativa
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
            {decision.executiveReport.stakeholderJustification}
          </p>
        </div>

        {/* Implementation Roadmap */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Hoja de Ruta de Implementación (Roadmap)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decision.executiveReport.roadmap.map((stage, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-indigo-600">{stage.phase.split(':')[0]}</span>
                  <span>{stage.timeline}</span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {stage.phase.split(':')[1] || stage.phase}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {stage.milestone}
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-100">
                  Responsable: <strong className="text-slate-800">{stage.owner}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Mitigation Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Matriz de Mitigación de Riesgos</span>
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-4 w-2/5">Riesgo Identificado</th>
                  <th className="py-2.5 px-3 text-center w-24">Severidad</th>
                  <th className="py-2.5 px-4">Plan de Contingencia / Mitigación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {decision.executiveReport.riskMitigation.map((rm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900 align-top">
                      {rm.risk}
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        rm.severity === 'Critical' || rm.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : rm.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rm.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed align-top">
                      {rm.contingency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

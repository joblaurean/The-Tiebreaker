import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import type { DecisionAnalysis, DecisionInput } from '../types/decision';
import { calculateMatrixScores } from '../utils/decisionCalculations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: DecisionInput;
  analysis: DecisionAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  input,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const matrix = calculateMatrixScores(analysis.options, analysis.criteria, analysis.ratings);

  const generateMarkdown = (): string => {
    let md = `# Informe de Decisión: ${input.title}\n`;
    md += `*Generado por Desempate — ${new Date(analysis.generatedAt).toLocaleDateString('es-ES')}*\n\n`;

    if (input.context) {
      md += `### Contexto y Prioridades\n${input.context}\n\n`;
    }

    md += `## 1. El Veredicto del Desempate\n`;
    md += `**Recomendación:** ${analysis.verdict.headline}\n\n`;
    md += `> ${analysis.verdict.rationale}\n\n`;
    md += `- **Índice de Certeza:** ${analysis.verdict.confidenceScore}%\n`;
    md += `- **Factor Decisivo:** ${analysis.verdict.decisiveFactor}\n`;
    md += `- **Reversibilidad:** ${analysis.verdict.reversibilityScore} / 10\n\n`;

    md += `### Regla del Horizonte Temporal (10 / 10 / 10)\n`;
    md += `- **En 10 minutos:** ${analysis.verdict.tenTenTenRule.tenMinutes}\n`;
    md += `- **En 10 meses:** ${analysis.verdict.tenTenTenRule.tenMonths}\n`;
    md += `- **En 10 años:** ${analysis.verdict.tenTenTenRule.tenYears}\n\n`;

    md += `## 2. Comparativa de Pros y Contras Ponderados\n\n`;
    analysis.options.forEach((opt, idx) => {
      md += `### ${String.fromCharCode(65 + idx)}. ${opt.name}\n`;
      md += `${opt.summary}\n\n`;
      md += `**Ventajas (Pros):**\n`;
      opt.pros.forEach((p) => {
        md += `- [Peso ${p.weight}/5] ${p.text}${p.explanation ? ` — ${p.explanation}` : ''}\n`;
      });
      md += `\n**Desventajas (Contras):**\n`;
      opt.cons.forEach((c) => {
        md += `- [Fricción ${c.weight}/5] ${c.text}${c.explanation ? ` — ${c.explanation}` : ''}\n`;
      });
      md += `\n`;
    });

    md += `## 3. Matriz Comparativa Multicriterio\n\n`;
    md += `| Criterio | Peso | ${analysis.options.map((o) => o.name).join(' | ')} |\n`;
    md += `| :--- | :---: | ${analysis.options.map(() => ':---:').join(' | ')} |\n`;
    analysis.criteria.forEach((crit) => {
      const scores = analysis.options.map(
        (o) => `${analysis.ratings[o.id]?.[crit.id]?.score ?? '-'}/10`
      );
      md += `| ${crit.name} | ${crit.weight}/5 | ${scores.join(' | ')} |\n`;
    });
    md += `| **Puntuación Ponderada Final** | - | ${analysis.options
      .map((o) => `**${(matrix.optionScores[o.id]?.weightedScore ?? 0).toFixed(2)} pts**`)
      .join(' | ')} |\n\n`;

    md += `## 4. Análisis DAFO Estratégico\n\n`;
    analysis.options.forEach((opt) => {
      md += `### DAFO: ${opt.name}\n`;
      md += `- **Fortalezas:** ${opt.swot.strengths.join(', ')}\n`;
      md += `- **Oportunidades:** ${opt.swot.opportunities.join(', ')}\n`;
      md += `- **Debilidades:** ${opt.swot.weaknesses.join(', ')}\n`;
      md += `- **Amenazas:** ${opt.swot.threats.join(', ')}\n`;
      md += `- **Directriz Estratégica:** ${opt.swot.strategicTip}\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">Exportar Informe de Decisión</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Markdown preview */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-700 bg-slate-50 border-b border-slate-200 whitespace-pre-wrap leading-relaxed select-all">
          {generateMarkdown()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Copiado en Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

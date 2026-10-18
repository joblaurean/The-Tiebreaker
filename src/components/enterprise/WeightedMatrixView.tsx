import React, { useState } from 'react';
import {
  Table,
  Plus,
  Trash2,
  Award,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { EnterpriseCriterion, EnterpriseOption, CriterionRatingItem } from '../../types/enterprise';
import { calculateCompositeScores } from '../../utils/enterpriseDecision';
import { useTranslation } from '../../i18n';

interface WeightedMatrixViewProps {
  options: EnterpriseOption[];
  criteria: EnterpriseCriterion[];
  ratings: Record<string, Record<string, CriterionRatingItem>>;
  onUpdateCriteria: (updated: EnterpriseCriterion[]) => void;
  onUpdateRatingScore: (optionId: string, criterionId: string, newScore: number) => void;
  onAddCriterion: (newCrit: EnterpriseCriterion) => void;
  onDeleteCriterion: (criterionId: string) => void;
}

export const WeightedMatrixView: React.FC<WeightedMatrixViewProps> = ({
  options,
  criteria,
  ratings,
  onUpdateCriteria,
  onUpdateRatingScore,
  onAddCriterion,
  onDeleteCriterion,
}) => {
  const t = useTranslation();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritCategory, setNewCritCategory] = useState<'Financial' | 'Technical' | 'Operational' | 'Strategic' | 'Risk'>('Technical');
  const [newCritWeight, setNewCritWeight] = useState(15);
  const [newCritDesc, setNewCritDesc] = useState('');

  const matrixResult = calculateCompositeScores(options, criteria, ratings);
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weightPercent || 0), 0);
  const isWeight100 = Math.abs(totalWeight - 100) < 0.1;

  const handleNormalizeWeights = () => {
    if (totalWeight <= 0) return;
    const normalized = criteria.map((c) => ({
      ...c,
      weightPercent: Number(((c.weightPercent / totalWeight) * 100).toFixed(1)),
    }));
    onUpdateCriteria(normalized);
  };

  const handleWeightChange = (critId: string, newWeight: number) => {
    const updated = criteria.map((c) => (c.id === critId ? { ...c, weightPercent: Math.max(0, Math.min(100, newWeight)) } : c));
    onUpdateCriteria(updated);
  };

  const handleCreateCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCrit: EnterpriseCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: newCritName.trim(),
      category: newCritCategory,
      weightPercent: newCritWeight,
      description: newCritDesc.trim() || 'Custom evaluation criterion added by team.',
      direction: 'higher_is_better',
    };

    onAddCriterion(newCrit);
    setNewCritName('');
    setNewCritDesc('');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Table className="w-4 h-4 text-indigo-600" />
              <span>{t.matrix.sectionTag}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.matrix.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.matrix.subtitle}
            </p>
          </div>

          {/* Weight Totals & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
              isWeight100
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isWeight100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>{t.matrix.sumOfWeights} {totalWeight.toFixed(1)}%</span>
            </div>

            {!isWeight100 && (
              <button
                type="button"
                onClick={handleNormalizeWeights}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1"
                title={t.matrix.autoNormalize}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.matrix.autoNormalize}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.matrix.addCriterion}</span>
            </button>
          </div>
        </div>

        {/* Form Modal/Dropdown for Adding New Criterion */}
        {isAddingNew && (
          <form onSubmit={handleCreateCriterion} className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {t.matrix.modalNewTitle}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={t.matrix.namePlaceholder}
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                required
              />
              <select
                value={newCritCategory}
                onChange={(e) => setNewCritCategory(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="Financial">{t.matrix.catFinancial}</option>
                <option value="Technical">{t.matrix.catTechnical}</option>
                <option value="Operational">{t.matrix.catOperational}</option>
                <option value="Strategic">{t.matrix.catStrategic}</option>
                <option value="Risk">{t.matrix.catRisk}</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newCritWeight}
                  onChange={(e) => setNewCritWeight(Number(e.target.value))}
                  className="w-20 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
                <span className="text-xs text-slate-500 font-mono">{t.matrix.weightLabel}</span>
              </div>
            </div>
            <input
              type="text"
              placeholder={t.matrix.descPlaceholder}
              value={newCritDesc}
              onChange={(e) => setNewCritDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
              >
                {t.matrix.saveCriterion}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Corporate BI Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-semibold tracking-wider">
                <th className="py-3 px-4 w-72">{t.matrix.colCriterion}</th>
                <th className="py-3 px-3 text-center w-28">{t.matrix.colWeight}</th>
                {options.map((opt) => {
                  const isLeader = matrixResult.winnerOptionId === opt.id;

                  return (
                    <th key={opt.id} className="py-3 px-4 min-w-[200px] border-l border-slate-800">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] text-indigo-300">
                          {opt.code}
                        </span>
                        {isLeader && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                            <Award className="w-3 h-3" />
                            <span>{t.matrix.firstPlaceBadge}</span>
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-white text-xs truncate" title={opt.name}>
                        {opt.name}
                      </div>
                    </th>
                  );
                })}
                <th className="py-3 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {criteria.map((crit) => {
                let maxScore = -1;
                options.forEach((opt) => {
                  const s = ratings[opt.id]?.[crit.id]?.score ?? 0;
                  if (s > maxScore) maxScore = s;
                });

                return (
                  <tr key={crit.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Criterion Title, Category and Description */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-xs">{crit.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          {crit.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {crit.description}
                      </p>
                    </td>

                    {/* Weight Control */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={crit.weightPercent}
                          onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                          className="w-14 px-2 py-1 text-center font-mono text-xs font-bold rounded border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                        />
                        <span className="font-mono text-[11px] text-slate-400">%</span>
                      </div>
                    </td>

                    {/* Options Scores and Rationale */}
                    {options.map((opt) => {
                      const cell = ratings[opt.id]?.[crit.id] || {
                        rawValue: '-',
                        score: 5,
                        rationale: t.matrix.withoutRating,
                      };
                      const isRowWinner = cell.score === maxScore && maxScore > 0;

                      return (
                        <td key={opt.id} className="py-3.5 px-4 align-top border-l border-slate-100">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-mono text-xs font-bold tabular-nums ${
                                isRowWinner ? 'text-indigo-950 font-black' : 'text-slate-700'
                              }`}>
                                {cell.score.toFixed(1)}
                              </span>
                              <span className="text-[10px] text-slate-400">/ 10</span>
                            </div>
                            {cell.rawValue && (
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded truncate max-w-[110px]" title={cell.rawValue}>
                                {cell.rawValue}
                              </span>
                            )}
                          </div>

                          {/* Quick Score Adjustment Slider */}
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={cell.score}
                            onChange={(e) => onUpdateRatingScore(opt.id, crit.id, Number(e.target.value))}
                            className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer mb-1.5"
                            title={t.matrix.adjustScoreTooltip.replace('{name}', opt.name).replace('{score}', String(cell.score))}
                          />

                          <p className="text-[11px] text-slate-500 leading-tight">
                            {cell.rationale}
                          </p>
                        </td>
                      );
                    })}

                    {/* Delete Criterion */}
                    <td className="py-3.5 px-2 align-top text-center">
                      {criteria.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onDeleteCriterion(crit.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                          title={t.matrix.deleteCriterionTooltip}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Summary Row */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 text-xs font-bold text-slate-900">
                <td className="py-3.5 px-4">{t.matrix.compositeRowTitle}</td>
                <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-600">
                  {totalWeight.toFixed(0)}%
                </td>
                {options.map((opt) => {
                  const score = matrixResult.scores[opt.id] ?? 0;
                  const isLeader = matrixResult.winnerOptionId === opt.id;

                  return (
                    <td key={opt.id} className="py-3.5 px-4 border-l border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-extrabold tabular-nums text-slate-900">
                          {score.toFixed(2)} {t.common.pts}
                        </span>
                        {isLeader ? (
                          <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {t.matrix.recommendedBadge}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-500">
                            -{(matrixResult.scores[matrixResult.winnerOptionId] - score).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

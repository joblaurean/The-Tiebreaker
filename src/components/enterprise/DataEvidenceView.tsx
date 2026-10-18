import React, { useState } from 'react';
import {
  Database,
  Plus,
  ShieldCheck,
  Search,
  FileCheck,
} from 'lucide-react';
import type { EnterpriseOption, DataEvidenceItem, EvidenceConfidence } from '../../types/enterprise';
import { useTranslation } from '../../i18n';

interface DataEvidenceViewProps {
  options: EnterpriseOption[];
  onAddEvidence: (optionId: string, newEvidence: DataEvidenceItem) => void;
}

export const DataEvidenceView: React.FC<DataEvidenceViewProps> = ({ options, onAddEvidence }) => {
  const t = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);

  // Form states for new empirical metric
  const [targetOptionId, setTargetOptionId] = useState(options[0]?.id || '');
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [confidence, setConfidence] = useState<EvidenceConfidence>('High (CI 95%)');
  const [sourceName, setSourceName] = useState('');
  const [benchmark, setBenchmark] = useState('');

  // Collect all evidence items tagged with option details
  const allEvidence = options.flatMap((opt) =>
    (opt.dataEvidence || []).map((evi) => ({
      ...evi,
      optionId: opt.id,
      optionCode: opt.code,
      optionName: opt.name,
    }))
  );

  const filtered = allEvidence.filter((item) => {
    const matchesOpt = selectedOptionId === 'all' || item.optionId === selectedOptionId;
    const matchesSearch =
      searchQuery === '' ||
      item.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOpt && matchesSearch;
  });

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim() || !metricValue.trim() || !sourceName.trim()) return;

    const newEvidence: DataEvidenceItem = {
      id: `evi-custom-${Date.now()}`,
      metricName: metricName.trim(),
      value: metricValue.trim(),
      unit: metricUnit.trim(),
      confidence,
      sourceName: sourceName.trim(),
      benchmarkBenchmark: benchmark.trim() || undefined,
    };

    onAddEvidence(targetOptionId, newEvidence);
    setMetricName('');
    setMetricValue('');
    setMetricUnit('');
    setSourceName('');
    setBenchmark('');
    setIsAddingEvidence(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Database className="w-4 h-4 text-sky-600" />
              <span>{t.evidence.sectionTag}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.evidence.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              {t.evidence.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingEvidence(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.evidence.linkNewMetric}</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedOptionId('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedOptionId === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.evidence.allAlternatives} ({allEvidence.length})
            </button>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedOptionId === opt.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.code} ({opt.dataEvidence?.length || 0})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.evidence.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Add Metric Form Modal/Drawer */}
        {isAddingEvidence && (
          <form onSubmit={handleCreateEvidence} className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {t.evidence.modalTitle}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.targetAlt}</label>
                <select
                  value={targetOptionId}
                  onChange={(e) => setTargetOptionId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.code} - {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.metricNameLabel}</label>
                <input
                  type="text"
                  placeholder={t.evidence.metricNamePlaceholder}
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.valueUnitLabel}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.evidence.valuePlaceholder}
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-2/3 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    required
                  />
                  <input
                    type="text"
                    placeholder={t.evidence.unitPlaceholder}
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    className="w-1/3 px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.confidenceLabel}</label>
                <select
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="High (CI 95%)">{t.evidence.confHigh}</option>
                  <option value="Moderate">{t.evidence.confModerate}</option>
                  <option value="Estimated">{t.evidence.confEstimated}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.sourceLabel}</label>
                <input
                  type="text"
                  placeholder={t.evidence.sourcePlaceholder}
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">{t.evidence.targetBenchmarkLabel}</label>
                <input
                  type="text"
                  placeholder={t.evidence.benchmarkPlaceholder}
                  value={benchmark}
                  onChange={(e) => setBenchmark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAddingEvidence(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
              >
                {t.evidence.saveEvidence}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Evidence Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">{t.evidence.colAlt}</th>
                <th className="py-3 px-4">{t.evidence.colMetric}</th>
                <th className="py-3 px-4">{t.evidence.colValue}</th>
                <th className="py-3 px-4">{t.evidence.colConfidence}</th>
                <th className="py-3 px-4">{t.evidence.colSource}</th>
                <th className="py-3 px-4">{t.evidence.colBenchmark}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    {t.evidence.emptyFilter}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Option */}
                    <td className="py-3 px-4 align-top">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.optionCode}
                      </span>
                      <div className="font-bold text-slate-900 text-xs mt-1 truncate max-w-[160px]" title={item.optionName}>
                        {item.optionName}
                      </div>
                    </td>

                    {/* Metric Name */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-bold text-slate-900">{item.metricName}</div>
                    </td>

                    {/* Value + Unit */}
                    <td className="py-3 px-4 align-top font-mono font-extrabold text-slate-900 tabular-nums">
                      <span>{item.value}</span>
                      {item.unit && <span className="text-[11px] text-slate-500 ml-1 font-normal">{item.unit}</span>}
                    </td>

                    {/* Confidence Level */}
                    <td className="py-3 px-4 align-top">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.confidence.includes('High')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{item.confidence}</span>
                      </span>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4 align-top">
                      <div className="text-slate-800 font-medium flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate max-w-[200px]" title={item.sourceName}>{item.sourceName}</span>
                      </div>
                    </td>

                    {/* Benchmark */}
                    <td className="py-3 px-4 align-top text-slate-500 text-[11px]">
                      {item.benchmarkBenchmark || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

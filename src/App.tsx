import React, { useState, useEffect } from 'react';
import {
  Table,
  SlidersHorizontal,
  Database,
  FileText,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { EnterpriseNavbar } from './components/enterprise/EnterpriseNavbar';
import { EnterpriseForm } from './components/enterprise/EnterpriseForm';
import { EnterpriseHeaderKpis } from './components/enterprise/EnterpriseHeaderKpis';
import { WeightedMatrixView } from './components/enterprise/WeightedMatrixView';
import { SensitivityView } from './components/enterprise/SensitivityView';
import { DataEvidenceView } from './components/enterprise/DataEvidenceView';
import { ExecutiveReportView } from './components/enterprise/ExecutiveReportView';
import { EnterpriseHistoryDrawer } from './components/enterprise/EnterpriseHistoryDrawer';
import { getLocalizedEnterprisePresets, ENTERPRISE_PRESETS } from './data/enterprisePresets';
import {
  generateFallbackEnterpriseDecision,
  runFullSensitivityAnalysis,
} from './utils/enterpriseDecision';
import type {
  EnterpriseDecision,
  EnterpriseDecisionInput,
  EnterpriseCriterion,
  DataEvidenceItem,
} from './types/enterprise';
import { LanguageProvider, useTranslation, useLanguage } from './i18n';

type EnterpriseTab = 'matrix' | 'sensitivity' | 'evidence' | 'report';

const STORAGE_KEY = 'the_tiebreaker_enterprise_decisions_v1';

function AppContent() {
  const t = useTranslation();
  const { language } = useLanguage();

  const [decision, setDecision] = useState<EnterpriseDecision | null>(null);
  const [baseCriteria, setBaseCriteria] = useState<EnterpriseCriterion[]>([]);
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('matrix');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedDecisions, setSavedDecisions] = useState<EnterpriseDecision[]>([]);

  // Load from localStorage or autostart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedDecisions(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const autostart = urlParams.get('autostart');
    if (autostart === '1') {
      const localizedPresets = getLocalizedEnterprisePresets(t);
      const defaultPreset = localizedPresets[0] || ENTERPRISE_PRESETS[0];
      const initial = generateFallbackEnterpriseDecision(defaultPreset.input);
      setDecision(initial);
      setBaseCriteria(JSON.parse(JSON.stringify(initial.criteria)));
    }
  }, [t]);

  const saveToHistory = (item: EnterpriseDecision) => {
    try {
      const updated = [item, ...savedDecisions.filter((d) => d.id !== item.id)].slice(0, 20);
      setSavedDecisions(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCreateDecision = async (input: EnterpriseDecisionInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    const payload: EnterpriseDecisionInput = {
      ...input,
      language,
    };

    try {
      const response = await fetch('/api/analyze-enterprise-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`${t.common.error} (${response.status})`);
      }

      const data: EnterpriseDecision = await response.json();
      setDecision(data);
      setBaseCriteria(JSON.parse(JSON.stringify(data.criteria)));
      setActiveTab('matrix');
      saveToHistory(data);
    } catch (err: unknown) {
      console.warn('Backend call failed, using heuristic enterprise engine fallback:', err);
      const fallback = generateFallbackEnterpriseDecision(payload);
      setDecision(fallback);
      setBaseCriteria(JSON.parse(JSON.stringify(fallback.criteria)));
      setActiveTab('matrix');
      saveToHistory(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCriteria = (updatedCriteria: EnterpriseCriterion[]) => {
    if (!decision) return;
    const sensitivity = runFullSensitivityAnalysis(decision.options, updatedCriteria, decision.ratings);
    const updated: EnterpriseDecision = {
      ...decision,
      criteria: updatedCriteria,
      sensitivity,
      updatedAt: new Date().toISOString(),
    };
    setDecision(updated);
    saveToHistory(updated);
  };

  const handleResetWeights = () => {
    if (!decision || baseCriteria.length === 0) return;
    handleUpdateCriteria(JSON.parse(JSON.stringify(baseCriteria)));
  };

  const handleUpdateRatingScore = (optionId: string, criterionId: string, newScore: number) => {
    if (!decision) return;
    const updatedRatings = {
      ...decision.ratings,
      [optionId]: {
        ...decision.ratings[optionId],
        [criterionId]: {
          ...(decision.ratings[optionId]?.[criterionId] || { rawValue: '', score: 5, rationale: '' }),
          score: newScore,
        },
      },
    };

    const sensitivity = runFullSensitivityAnalysis(decision.options, decision.criteria, updatedRatings);
    const updated: EnterpriseDecision = {
      ...decision,
      ratings: updatedRatings,
      sensitivity,
      updatedAt: new Date().toISOString(),
    };
    setDecision(updated);
    saveToHistory(updated);
  };

  const handleAddCriterion = (newCrit: EnterpriseCriterion) => {
    if (!decision) return;
    const updatedCriteria = [...decision.criteria, newCrit];
    handleUpdateCriteria(updatedCriteria);
  };

  const handleDeleteCriterion = (criterionId: string) => {
    if (!decision || decision.criteria.length <= 2) return;
    const updatedCriteria = decision.criteria.filter((c) => c.id !== criterionId);
    handleUpdateCriteria(updatedCriteria);
  };

  const handleAddEvidence = (optionId: string, newEvidence: DataEvidenceItem) => {
    if (!decision) return;
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        dataEvidence: [...(opt.dataEvidence || []), newEvidence],
      };
    });

    const updated: EnterpriseDecision = {
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    };
    setDecision(updated);
    saveToHistory(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    setSavedDecisions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearAllHistory = () => {
    setSavedDecisions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <EnterpriseNavbar
        onNewDecision={() => {
          setDecision(null);
          setErrorMessage(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={decision ? () => setActiveTab('report') : undefined}
        hasActiveDecision={!!decision}
        historyCount={savedDecisions.length}
        activeTitle={decision?.title}
      />

      <main className="grow">
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {!decision ? (
          <EnterpriseForm onSubmit={handleCreateDecision} isLoading={isLoading} />
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-6">
            {/* Context Sub-Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 font-mono">
                  <span>{t.report.deptLabel.replace(':', '')}: {decision.department.toUpperCase()}</span>
                  <span>·</span>
                  <span>{decision.options.length} {t.history.alternativesLabel.toUpperCase()}</span>
                  <span>·</span>
                  <span>{decision.criteria.length} {t.history.criteriaLabel.toUpperCase()}</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {decision.title}
                </h1>
                {decision.businessObjective && (
                  <p className="text-xs text-slate-600 max-w-4xl pt-0.5">
                    <strong>{t.report.objectiveLabel}</strong> {decision.businessObjective}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setDecision(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.common.back}</span>
                </button>
              </div>
            </div>

            {/* Corporate BI KPI Cards */}
            <EnterpriseHeaderKpis decision={decision} />

            {/* Segmented Enterprise BI Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl w-full sm:max-w-fit overflow-x-auto shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'matrix'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>1. {t.navbar.indicators.matrix}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sensitivity')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'sensitivity'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. {t.navbar.indicators.whatif}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('evidence')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'evidence'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-sky-400" />
                <span>3. {t.navbar.indicators.evidence} ({decision.options.reduce((a, o) => a + (o.dataEvidence?.length || 0), 0)})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'report'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>4. {t.navbar.indicators.report}</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="pt-1">
              {activeTab === 'matrix' && (
                <WeightedMatrixView
                  options={decision.options}
                  criteria={decision.criteria}
                  ratings={decision.ratings}
                  onUpdateCriteria={handleUpdateCriteria}
                  onUpdateRatingScore={handleUpdateRatingScore}
                  onAddCriterion={handleAddCriterion}
                  onDeleteCriterion={handleDeleteCriterion}
                />
              )}

              {activeTab === 'sensitivity' && (
                <SensitivityView
                  options={decision.options}
                  criteria={decision.criteria}
                  ratings={decision.ratings}
                  baseCriteria={baseCriteria}
                  onUpdateCriteriaWeights={handleUpdateCriteria}
                  onResetWeights={handleResetWeights}
                />
              )}

              {activeTab === 'evidence' && (
                <DataEvidenceView
                  options={decision.options}
                  onAddEvidence={handleAddEvidence}
                />
              )}

              {activeTab === 'report' && (
                <ExecutiveReportView decision={decision} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Corporate BI Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{t.footer.appName}</span>
            <span>·</span>
            <span>{t.footer.tagline}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            {t.footer.badges}
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <EnterpriseHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(d) => {
          setDecision(d);
          setBaseCriteria(JSON.parse(JSON.stringify(d.criteria)));
          setActiveTab('matrix');
          setIsHistoryOpen(false);
        }}
        onDeleteDecision={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

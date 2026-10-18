export type CriterionCategory = 'Financial' | 'Technical' | 'Strategic' | 'Operational' | 'Risk';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type EvidenceConfidence = 'High (CI 95%)' | 'Moderate' | 'Estimated';

export interface DataEvidenceItem {
  id: string;
  metricName: string;
  value: string | number;
  unit: string;
  confidence: EvidenceConfidence;
  sourceName: string; // e.g. Snowflake, BigQuery, Vendor SLA, Datadog
  sourceUrl?: string;
  benchmarkBenchmark?: string;
}

export interface EnterpriseOption {
  id: string;
  code: string; // e.g., "ALT-01"
  name: string;
  vendorOrTeam: string;
  capexUsd: number;
  opexAnnualUsd: number;
  timeToValueWeeks: number;
  riskLevel: RiskLevel;
  executiveSummary: string;
  dataEvidence: DataEvidenceItem[];
}

export interface EnterpriseCriterion {
  id: string;
  name: string;
  category: CriterionCategory;
  weightPercent: number; // 0 to 100
  description: string;
  direction: 'higher_is_better' | 'lower_is_better';
}

export interface CriterionRatingItem {
  rawValue: string; // e.g., "$140,000 / año" or "99.95% SLA"
  score: number; // 1 to 10 scale
  rationale: string;
  linkedMetricId?: string;
}

export interface SwitchPointInsight {
  criterionId: string;
  criterionName: string;
  currentWeightPercent: number;
  switchWeightPercent: number;
  currentLeaderOptionId: string;
  newLeaderOptionId: string;
  isAchievable: boolean;
  insightDescription: string;
}

export interface SensitivityAnalysisResult {
  stabilityIndex: number; // 0 - 100% (how resilient the choice is)
  switchPoints: SwitchPointInsight[];
  robustnessSummary: string;
}

export interface ExecutiveRoadmapItem {
  phase: string;
  timeline: string;
  milestone: string;
  owner: string;
}

export interface ExecutiveRiskItem {
  risk: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  contingency: string;
}

export interface ExecutiveReport {
  executiveSummary: string;
  winningOptionId: string;
  recommendationHeadline: string;
  strategicAlignment: string;
  keyTradeOffs: string[];
  stakeholderJustification: string;
  roadmap: ExecutiveRoadmapItem[];
  riskMitigation: ExecutiveRiskItem[];
}

export interface EnterpriseDecision {
  id: string;
  title: string;
  businessObjective: string;
  department: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  options: EnterpriseOption[];
  criteria: EnterpriseCriterion[];
  ratings: Record<string, Record<string, CriterionRatingItem>>; // [optionId][criterionId]
  sensitivity: SensitivityAnalysisResult;
  executiveReport: ExecutiveReport;
}

export interface EnterpriseDecisionInput {
  title: string;
  businessObjective: string;
  department: string;
  optionNames: string[];
  focusCriteria?: string[];
  budgetConstraintUsd?: number;
  language?: string;
}


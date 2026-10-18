export type RiskTolerance = 'low' | 'moderate' | 'high';

export type DecisionCategory = 'career' | 'finance' | 'business' | 'lifestyle' | 'education' | 'tech';

export interface WeightedFactor {
  id: string;
  text: string;
  weight: number; // 1 (bajo) to 5 (crítico)
  category?: string;
  explanation?: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicTip: string;
}

export interface DecisionOption {
  id: string;
  name: string;
  summary: string;
  pros: WeightedFactor[];
  cons: WeightedFactor[];
  swot: SwotAnalysis;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
}

export interface CriterionRating {
  score: number; // 1 to 10
  rationale: string;
}

export interface TenTenTenRule {
  tenMinutes: string; // En 10 minutos (reacción emocional inmediata)
  tenMonths: string;  // En 10 meses (consecuencias prácticas y adaptación)
  tenYears: string;   // En 10 años (impacto en la trayectoria vital)
}

export interface TiebreakerVerdict {
  winnerOptionId: string;
  headline: string;
  rationale: string;
  confidenceScore: number; // 0 to 100
  decisiveFactor: string; // El factor de desempate clave
  isCloseCall: boolean;
  tenTenTenRule: TenTenTenRule;
  reversibilityScore: number; // 1-10 (qué tan reversible es la decisión)
  blindTestPrompt: string; // Test de la moneda / intuición
  preMortemAnalysis: string; // Análisis pre-mortem: plan de contingencia ante el peor escenario
}

export interface DecisionAnalysis {
  options: DecisionOption[];
  criteria: Criterion[];
  ratings: Record<string, Record<string, CriterionRating>>; // [optionId][criterionId]
  verdict: TiebreakerVerdict;
  generatedAt: string;
}

export interface DecisionInput {
  title: string;
  context: string;
  category: DecisionCategory;
  riskTolerance: RiskTolerance;
  optionNames: string[];
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: DecisionInput;
  analysis: DecisionAnalysis;
}

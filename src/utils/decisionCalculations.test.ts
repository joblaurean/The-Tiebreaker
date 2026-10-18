import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOptionScore,
  calculateMatrixScores,
  formatCategoryLabel,
  formatRiskLabel,
  generateFallbackAnalysis,
} from './decisionCalculations.ts';
import type { DecisionOption, Criterion, CriterionRating, DecisionInput } from '../types/decision.ts';

test('calculateOptionScore accurately computes sums, net score, and proRatio', () => {
  const dummyOption: DecisionOption = {
    id: 'opt-1',
    name: 'Opción Test',
    summary: 'Resumen test',
    pros: [
      { id: 'p1', text: 'Gran salario', weight: 5 },
      { id: 'p2', text: 'Trabajo remoto', weight: 4 },
      { id: 'p3', text: 'Buen equipo', weight: 3 },
    ],
    cons: [
      { id: 'c1', text: 'Horario extendido', weight: 3 },
      { id: 'c2', text: 'Más responsabilidad', weight: 2 },
    ],
    swot: {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      strategicTip: '',
    },
  };

  const result = calculateOptionScore(dummyOption);
  // Pros sum: 5 + 4 + 3 = 12
  // Cons sum: 3 + 2 = 5
  // Net score: 12 - 5 = 7
  // Total weights: 17
  // Ratio: round((12 / 17) * 100) = 71
  assert.equal(result.proSum, 12);
  assert.equal(result.conSum, 5);
  assert.equal(result.netScore, 7);
  assert.equal(result.totalWeights, 17);
  assert.equal(result.proRatio, 71);
});

test('calculateOptionScore handles zero or empty pros and cons gracefully', () => {
  const emptyOption: DecisionOption = {
    id: 'opt-empty',
    name: 'Opción Vacía',
    summary: '',
    pros: [],
    cons: [],
    swot: { strengths: [], weaknesses: [], opportunities: [], threats: [], strategicTip: '' },
  };

  const result = calculateOptionScore(emptyOption);
  assert.equal(result.proSum, 0);
  assert.equal(result.conSum, 0);
  assert.equal(result.netScore, 0);
  assert.equal(result.proRatio, 50);
});

test('calculateMatrixScores identifies the winning option and detects tie states', () => {
  const options: DecisionOption[] = [
    {
      id: 'opt-a',
      name: 'A',
      summary: '',
      pros: [],
      cons: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [], strategicTip: '' },
    },
    {
      id: 'opt-b',
      name: 'B',
      summary: '',
      pros: [],
      cons: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [], strategicTip: '' },
    },
  ];

  const criteria: Criterion[] = [
    { id: 'c1', name: 'Coste', weight: 5, description: '' },
    { id: 'c2', name: 'Tiempo', weight: 3, description: '' },
  ];

  // Total weight = 8
  // Option A: (10 * 5 + 6 * 3) / 8 = (50 + 18) / 8 = 68 / 8 = 8.5
  // Option B: (7 * 5 + 8 * 3) / 8 = (35 + 24) / 8 = 59 / 8 = 7.375 -> 7.38
  const ratings: Record<string, Record<string, CriterionRating>> = {
    'opt-a': {
      c1: { score: 10, rationale: '' },
      c2: { score: 6, rationale: '' },
    },
    'opt-b': {
      c1: { score: 7, rationale: '' },
      c2: { score: 8, rationale: '' },
    },
  };

  const matrix = calculateMatrixScores(options, criteria, ratings);
  assert.equal(matrix.totalCriteriaWeight, 8);
  assert.equal(matrix.leaderOptionId, 'opt-a');
  assert.equal(matrix.optionScores['opt-a'].weightedScore, 8.5);
  assert.equal(matrix.optionScores['opt-b'].weightedScore, 7.38);
  assert.equal(matrix.isTie, false);
});

test('calculateMatrixScores flags a tie when top options are within 0.35 threshold', () => {
  const options: DecisionOption[] = [
    {
      id: 'opt-1',
      name: 'Option 1',
      summary: '',
      pros: [],
      cons: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [], strategicTip: '' },
    },
    {
      id: 'opt-2',
      name: 'Option 2',
      summary: '',
      pros: [],
      cons: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [], strategicTip: '' },
    },
  ];

  const criteria: Criterion[] = [
    { id: 'c1', name: 'Equilibrio', weight: 2, description: '' },
  ];

  const ratings: Record<string, Record<string, CriterionRating>> = {
    'opt-1': { c1: { score: 8.0, rationale: '' } },
    'opt-2': { c1: { score: 8.2, rationale: '' } },
  };

  const matrix = calculateMatrixScores(options, criteria, ratings);
  assert.equal(matrix.isTie, true);
  assert.ok(matrix.scoreDifference <= 0.35);
});

test('generateFallbackAnalysis returns full structured decision model', () => {
  const input: DecisionInput = {
    title: '¿Cambiar de trabajo o quedarme?',
    context: 'Llevo 4 años en la empresa actual con ascenso prometido pero oferta remota del 25% más.',
    category: 'career',
    riskTolerance: 'moderate',
    optionNames: ['Aceptar oferta remota', 'Permanecer con ascenso'],
  };

  const analysis = generateFallbackAnalysis(input);
  assert.equal(analysis.options.length, 2);
  assert.equal(analysis.criteria.length, 5);
  assert.ok(analysis.verdict.winnerOptionId);
  assert.ok(analysis.verdict.headline.length > 0);
  assert.ok(analysis.verdict.tenTenTenRule.tenMinutes.length > 0);
  assert.ok(analysis.verdict.tenTenTenRule.tenMonths.length > 0);
  assert.ok(analysis.verdict.tenTenTenRule.tenYears.length > 0);
  assert.equal(typeof analysis.verdict.confidenceScore, 'number');
  assert.equal(typeof analysis.verdict.reversibilityScore, 'number');
});

test('format labels output expected Spanish text', () => {
  assert.equal(formatCategoryLabel('career'), 'Carrera y Trabajo');
  assert.equal(formatCategoryLabel('finance'), 'Finanzas e Inversión');
  assert.equal(formatRiskLabel('low'), 'Conservador (Bajo Riesgo)');
  assert.equal(formatRiskLabel('high'), 'Audaz (Alto Riesgo / Alto Retorno)');
});

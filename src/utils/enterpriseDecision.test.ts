import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCompositeScores,
  calculateSensitivityForCriterion,
  runFullSensitivityAnalysis,
  generateFallbackEnterpriseDecision,
} from './enterpriseDecision.ts';
import type { EnterpriseOption, EnterpriseCriterion, CriterionRatingItem, EnterpriseDecisionInput } from '../types/enterprise.ts';

test('calculateCompositeScores calculates normalized weighted scores accurately', () => {
  const options: EnterpriseOption[] = [
    {
      id: 'opt-1',
      code: 'ALT-01',
      name: 'Cloud Vendor X',
      vendorOrTeam: 'Vendor',
      capexUsd: 10000,
      opexAnnualUsd: 50000,
      timeToValueWeeks: 4,
      riskLevel: 'Low',
      executiveSummary: 'Managed SaaS',
      dataEvidence: [],
    },
    {
      id: 'opt-2',
      code: 'ALT-02',
      name: 'Custom Build',
      vendorOrTeam: 'Internal',
      capexUsd: 80000,
      opexAnnualUsd: 20000,
      timeToValueWeeks: 20,
      riskLevel: 'Medium',
      executiveSummary: 'In-house build',
      dataEvidence: [],
    },
  ];

  const criteria: EnterpriseCriterion[] = [
    {
      id: 'c-cost',
      name: 'Costo',
      category: 'Financial',
      weightPercent: 60,
      description: '',
      direction: 'lower_is_better',
    },
    {
      id: 'c-speed',
      name: 'Velocidad',
      category: 'Operational',
      weightPercent: 40,
      description: '',
      direction: 'higher_is_better',
    },
  ];

  // Total weight = 100%
  // Option 1: score cost 6, speed 9 -> 0.6 * 6 + 0.4 * 9 = 3.6 + 3.6 = 7.2
  // Option 2: score cost 8, speed 4 -> 0.6 * 8 + 0.4 * 4 = 4.8 + 1.6 = 6.4
  const ratings: Record<string, Record<string, CriterionRatingItem>> = {
    'opt-1': {
      'c-cost': { rawValue: '', score: 6, rationale: '' },
      'c-speed': { rawValue: '', score: 9, rationale: '' },
    },
    'opt-2': {
      'c-cost': { rawValue: '', score: 8, rationale: '' },
      'c-speed': { rawValue: '', score: 4, rationale: '' },
    },
  };

  const result = calculateCompositeScores(options, criteria, ratings);
  assert.equal(result.winnerOptionId, 'opt-1');
  assert.equal(result.runnerUpOptionId, 'opt-2');
  assert.equal(result.scores['opt-1'], 7.2);
  assert.equal(result.scores['opt-2'], 6.4);
  assert.equal(result.scoreGap, 0.8);
});

test('calculateSensitivityForCriterion detects crossover switch points when weight is varied', () => {
  const options: EnterpriseOption[] = [
    {
      id: 'opt-a',
      code: 'ALT-A',
      name: 'A',
      vendorOrTeam: '',
      capexUsd: 0,
      opexAnnualUsd: 0,
      timeToValueWeeks: 0,
      riskLevel: 'Low',
      executiveSummary: '',
      dataEvidence: [],
    },
    {
      id: 'opt-b',
      code: 'ALT-B',
      name: 'B',
      vendorOrTeam: '',
      capexUsd: 0,
      opexAnnualUsd: 0,
      timeToValueWeeks: 0,
      riskLevel: 'Low',
      executiveSummary: '',
      dataEvidence: [],
    },
  ];

  const criteria: EnterpriseCriterion[] = [
    { id: 'crit-1', name: 'Crit 1', category: 'Financial', weightPercent: 20, description: '', direction: 'higher_is_better' },
    { id: 'crit-2', name: 'Crit 2', category: 'Technical', weightPercent: 80, description: '', direction: 'higher_is_better' },
  ];

  // At base weight (crit-1 = 20%, crit-2 = 80%):
  // Opt A: 0.2 * 10 + 0.8 * 2 = 2 + 1.6 = 3.6
  // Opt B: 0.2 * 2 + 0.8 * 8 = 0.4 + 6.4 = 6.8 -> Opt B leads
  // But if crit-1 weight increases (e.g. at 90%):
  // Opt A: 0.9 * 10 + 0.1 * 2 = 9 + 0.2 = 9.2
  // Opt B: 0.9 * 2 + 0.1 * 8 = 1.8 + 0.8 = 2.6 -> Opt A leads!
  const ratings: Record<string, Record<string, CriterionRatingItem>> = {
    'opt-a': {
      'crit-1': { rawValue: '', score: 10, rationale: '' },
      'crit-2': { rawValue: '', score: 2, rationale: '' },
    },
    'opt-b': {
      'crit-1': { rawValue: '', score: 2, rationale: '' },
      'crit-2': { rawValue: '', score: 8, rationale: '' },
    },
  };

  const sensitivity = calculateSensitivityForCriterion(options, criteria, ratings, 'crit-1');
  assert.ok(sensitivity.crossoverPoints.length > 0);
  const switchPoint = sensitivity.crossoverPoints[0];
  assert.equal(switchPoint.leaderOptionId, 'opt-a');
  assert.ok(switchPoint.weightPercent > 30 && switchPoint.weightPercent < 80);
});

test('runFullSensitivityAnalysis computes stabilityIndex and summary', () => {
  const options: EnterpriseOption[] = [
    { id: 'opt-1', code: 'A', name: 'A', vendorOrTeam: '', capexUsd: 0, opexAnnualUsd: 0, timeToValueWeeks: 0, riskLevel: 'Low', executiveSummary: '', dataEvidence: [] },
    { id: 'opt-2', code: 'B', name: 'B', vendorOrTeam: '', capexUsd: 0, opexAnnualUsd: 0, timeToValueWeeks: 0, riskLevel: 'Low', executiveSummary: '', dataEvidence: [] },
  ];
  const criteria: EnterpriseCriterion[] = [
    { id: 'c1', name: 'Cost', category: 'Financial', weightPercent: 50, description: '', direction: 'lower_is_better' },
    { id: 'c2', name: 'Speed', category: 'Technical', weightPercent: 50, description: '', direction: 'higher_is_better' },
  ];
  const ratings: Record<string, Record<string, CriterionRatingItem>> = {
    'opt-1': { c1: { rawValue: '', score: 8, rationale: '' }, c2: { rawValue: '', score: 9, rationale: '' } },
    'opt-2': { c1: { rawValue: '', score: 4, rationale: '' }, c2: { rawValue: '', score: 4, rationale: '' } },
  };

  const result = runFullSensitivityAnalysis(options, criteria, ratings);
  assert.ok(result.stabilityIndex >= 90); // Opt 1 dominates across almost all weight combinations
  assert.ok(result.robustnessSummary.includes('Robusta'));
});

test('generateFallbackEnterpriseDecision constructs complete data-backed model', () => {
  const input: EnterpriseDecisionInput = {
    title: 'Migración de Data Lake a Snowflake vs Databricks',
    businessObjective: 'Reducir latencias P95 y centralizar analítica de negocio con governance unificado.',
    department: 'Data & Analytics',
    optionNames: ['Snowflake Data Cloud', 'Databricks Lakehouse Platform'],
  };

  const decision = generateFallbackEnterpriseDecision(input);
  assert.equal(decision.options.length, 2);
  assert.equal(decision.criteria.length, 5);
  assert.ok(decision.options[0].dataEvidence.length > 0);
  assert.ok(decision.executiveReport.winningOptionId);
  assert.ok(decision.executiveReport.keyTradeOffs.length >= 2);
  assert.ok(decision.executiveReport.roadmap.length >= 2);
  assert.ok(decision.sensitivity.stabilityIndex >= 0);
});

import type {
  EnterpriseCriterion,
  EnterpriseOption,
  CriterionRatingItem,
  SwitchPointInsight,
  SensitivityAnalysisResult,
  EnterpriseDecision,
  EnterpriseDecisionInput,
} from '../types/enterprise';

export interface OptionCompositeScore {
  optionId: string;
  compositeScore: number; // 0 to 10
  rank: number;
}

export interface MatrixCalculationResult {
  scores: Record<string, number>;
  winnerOptionId: string;
  runnerUpOptionId: string | null;
  scoreGap: number;
  totalWeight: number;
  normalizedWeights: Record<string, number>; // criterionId -> fraction [0, 1]
}

/**
 * Calculates composite score for each option based on criterion weights and scores.
 */
export function calculateCompositeScores(
  options: EnterpriseOption[],
  criteria: EnterpriseCriterion[],
  ratings: Record<string, Record<string, CriterionRatingItem>>
): MatrixCalculationResult {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weightPercent || 0), 0);
  const normalizedWeights: Record<string, number> = {};

  criteria.forEach((c) => {
    normalizedWeights[c.id] = totalWeight > 0 ? (c.weightPercent || 0) / totalWeight : 0;
  });

  const scores: Record<string, number> = {};

  options.forEach((opt) => {
    let sum = 0;
    criteria.forEach((crit) => {
      const cell = ratings[opt.id]?.[crit.id];
      const score = cell?.score ?? 5;
      sum += score * (normalizedWeights[crit.id] ?? 0);
    });
    scores[opt.id] = Number(sum.toFixed(2));
  });

  // Determine winner and runner up
  const sorted = [...options].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  const winnerOptionId = sorted[0]?.id || '';
  const runnerUpOptionId = sorted[1]?.id || null;
  const scoreGap = runnerUpOptionId
    ? Number(((scores[winnerOptionId] ?? 0) - (scores[runnerUpOptionId] ?? 0)).toFixed(2))
    : 0;

  return {
    scores,
    winnerOptionId,
    runnerUpOptionId,
    scoreGap,
    totalWeight,
    normalizedWeights,
  };
}

/**
 * Simulates sweeping a single criterion's weight from 0% to 100% while scaling
 * all other criteria proportionally, and finds any switch/crossover points.
 */
export function calculateSensitivityForCriterion(
  options: EnterpriseOption[],
  criteria: EnterpriseCriterion[],
  ratings: Record<string, Record<string, CriterionRatingItem>>,
  targetCriterionId: string
): { crossoverPoints: { weightPercent: number; leaderOptionId: string }[] } {
  if (options.length < 2) return { crossoverPoints: [] };

  const targetCrit = criteria.find((c) => c.id === targetCriterionId);
  if (!targetCrit) return { crossoverPoints: [] };

  const otherCriteria = criteria.filter((c) => c.id !== targetCriterionId);
  const sumOtherWeights = otherCriteria.reduce((sum, c) => sum + c.weightPercent, 0);

  const crossoverPoints: { weightPercent: number; leaderOptionId: string }[] = [];
  let prevLeader = '';

  // Sample weights from 0% to 100% in 1% steps
  for (let w = 0; w <= 100; w += 2) {
    const targetWeightFrac = w / 100;
    const remainingFrac = 1 - targetWeightFrac;

    const scoresAtW: Record<string, number> = {};

    options.forEach((opt) => {
      const targetScore = ratings[opt.id]?.[targetCriterionId]?.score ?? 5;
      let total = targetScore * targetWeightFrac;

      otherCriteria.forEach((otherCrit) => {
        const otherScore = ratings[opt.id]?.[otherCrit.id]?.score ?? 5;
        const scaledWeight = sumOtherWeights > 0
          ? (otherCrit.weightPercent / sumOtherWeights) * remainingFrac
          : remainingFrac / otherCriteria.length;
        total += otherScore * scaledWeight;
      });

      scoresAtW[opt.id] = total;
    });

    const currentLeader = [...options].sort((a, b) => (scoresAtW[b.id] ?? 0) - (scoresAtW[a.id] ?? 0))[0]?.id || '';

    if (prevLeader && currentLeader !== prevLeader) {
      crossoverPoints.push({
        weightPercent: w,
        leaderOptionId: currentLeader,
      });
    }
    prevLeader = currentLeader;
  }

  return { crossoverPoints };
}

/**
 * Computes a full sensitivity analysis report across all criteria
 */
export function runFullSensitivityAnalysis(
  options: EnterpriseOption[],
  criteria: EnterpriseCriterion[],
  ratings: Record<string, Record<string, CriterionRatingItem>>
): SensitivityAnalysisResult {
  const baseResult = calculateCompositeScores(options, criteria, ratings);
  const baseWinnerId = baseResult.winnerOptionId;
  const switchPoints: SwitchPointInsight[] = [];

  let totalStableRangeSum = 0;

  criteria.forEach((crit) => {
    const { crossoverPoints } = calculateSensitivityForCriterion(options, criteria, ratings, crit.id);
    const firstSwitch = crossoverPoints.find((cp) => cp.leaderOptionId !== baseWinnerId);

    if (firstSwitch) {
      const newLeader = options.find((o) => o.id === firstSwitch.leaderOptionId);
      const isAchievable = Math.abs(firstSwitch.weightPercent - crit.weightPercent) <= 30;

      switchPoints.push({
        criterionId: crit.id,
        criterionName: crit.name,
        currentWeightPercent: crit.weightPercent,
        switchWeightPercent: firstSwitch.weightPercent,
        currentLeaderOptionId: baseWinnerId,
        newLeaderOptionId: firstSwitch.leaderOptionId,
        isAchievable,
        insightDescription: `Si el peso de «${crit.name}» se ajustara a ${firstSwitch.weightPercent}% (actual: ${crit.weightPercent}%), la opción «${newLeader?.name || 'Alternativa'}» pasaría al 1.er puesto.`,
      });
    } else {
      totalStableRangeSum += 100;
    }
  });

  // Calculate overall stability index (0 to 100%)
  const maxPossiblePoints = criteria.length * 100;
  let stabilityPoints = 0;

  criteria.forEach((crit) => {
    const sp = switchPoints.find((s) => s.criterionId === crit.id);
    if (!sp) {
      stabilityPoints += 100;
    } else {
      // Distance from current weight to switch weight
      const distance = Math.abs(sp.switchWeightPercent - crit.weightPercent);
      stabilityPoints += Math.min(100, distance * 2.5);
    }
  });

  const stabilityIndex = maxPossiblePoints > 0
    ? Math.round((stabilityPoints / maxPossiblePoints) * 100)
    : 80;

  const robustnessSummary = stabilityIndex >= 75
    ? `Decisión Altamente Robusta (Índice ${stabilityIndex}%): El ranking se mantiene estable frente a variaciones moderadas de ponderación.`
    : stabilityIndex >= 50
    ? `Decisión Moderadamente Sensible (Índice ${stabilityIndex}%): Existen criterios donde un cambio de peso podría alterar el primer puesto.`
    : `Decisión Altamente Sensible (Índice ${stabilityIndex}%): Los resultados son vulnerables a desacuerdos en la priorización de criterios.`;

  return {
    stabilityIndex,
    switchPoints,
    robustnessSummary,
  };
}

/**
 * Generates an executive decision model for enterprise scenarios with full quantitative evidence.
 */
export function generateFallbackEnterpriseDecision(input: EnterpriseDecisionInput): EnterpriseDecision {
  const optNames = input.optionNames.length >= 2 ? input.optionNames : ['Opción A (SaaS Gestionado)', 'Opción B (Desarrollo a Medida)'];

  const criteria: EnterpriseCriterion[] = [
    {
      id: 'crit-tco',
      name: 'TCO a 3 Años (Coste Total)',
      category: 'Financial',
      weightPercent: 30,
      description: 'Gasto total acumulado incluyendo licencias, infraestructura, migración y mantenimiento.',
      direction: 'lower_is_better',
    },
    {
      id: 'crit-time',
      name: 'Time to Value & Despliegue',
      category: 'Operational',
      weightPercent: 20,
      description: 'Semanas estimadas hasta la puesta en producción y adopción por los equipos.',
      direction: 'lower_is_better',
    },
    {
      id: 'crit-scalability',
      name: 'Rendimiento y Escalabilidad',
      category: 'Technical',
      weightPercent: 20,
      description: 'Capacidad de soportar picos de carga, latencia P95 y límites de throughput.',
      direction: 'higher_is_better',
    },
    {
      id: 'crit-security',
      name: 'Gobernanza y Cumplimiento (SOC2/GDPR)',
      category: 'Risk',
      weightPercent: 15,
      description: 'Facilidad de auditoría, control de acceso RBAC, cifrado y soberanía del dato.',
      direction: 'higher_is_better',
    },
    {
      id: 'crit-vendor-lockin',
      name: 'Independencia Tecnológica / Lock-in',
      category: 'Strategic',
      weightPercent: 15,
      description: 'Facilidad de exportación, uso de estándares abiertos y costes de salida.',
      direction: 'higher_is_better',
    },
  ];

  const options: EnterpriseOption[] = optNames.map((name, idx) => {
    const id = `opt-${idx + 1}`;
    const code = `ALT-0${idx + 1}`;
    const isFirst = idx === 0;

    return {
      id,
      code,
      name,
      vendorOrTeam: isFirst ? 'Proveedor Líder en el Cuadrante Gartner' : 'Equipo Interno de Ingeniería & DevOps',
      capexUsd: isFirst ? 28000 : 95000,
      opexAnnualUsd: isFirst ? 74000 : 38000,
      timeToValueWeeks: isFirst ? 8 : 24,
      riskLevel: isFirst ? 'Low' : 'Medium',
      executiveSummary: isFirst
        ? `Arquitectura gestionada que acelera el time-to-market en un 65% con SLA del 99.99% garantizado contractualmente.`
        : `Solución modular in-house con control absoluto sobre la propiedad intelectual y costes recurrentes reducidos a largo plazo.`,
      dataEvidence: [
        {
          id: `evi-${id}-1`,
          metricName: isFirst ? 'Disponibilidad SLA Contractual' : 'Disponibilidad Histórica Interna',
          value: isFirst ? '99.99%' : '99.85%',
          unit: '% uptime',
          confidence: 'High (CI 95%)',
          sourceName: isFirst ? 'Vendor SLA & SOC2 Report' : 'Datadog APM Dashboard (Q3-Q4)',
          benchmarkBenchmark: 'Target Corporativo: >= 99.90%',
        },
        {
          id: `evi-${id}-2`,
          metricName: 'Coste Total Proyectado a 36 Meses',
          value: isFirst ? '$250,000' : '$209,000',
          unit: 'USD',
          confidence: 'High (CI 95%)',
          sourceName: 'Modelo Financiero de FinOps (Excel/BigQuery)',
          benchmarkBenchmark: 'Presupuesto Aprobado: $300,000',
        },
        {
          id: `evi-${id}-3`,
          metricName: 'Esfuerzo de Mantenimiento Estimado',
          value: isFirst ? '0.2 FTE' : '1.5 FTE',
          unit: 'FTE/año',
          confidence: 'Moderate',
          sourceName: 'Auditoría de Capacidad de Ingeniería (Jira Analytics)',
          benchmarkBenchmark: 'Capacidad Disponible: 0.5 FTE',
        },
      ],
    };
  });

  const ratings: Record<string, Record<string, CriterionRatingItem>> = {};
  options.forEach((opt, idx) => {
    ratings[opt.id] = {};
    const isFirst = idx === 0;

    criteria.forEach((c) => {
      if (c.id === 'crit-tco') {
        ratings[opt.id][c.id] = {
          rawValue: isFirst ? '$250k TCO (Opex predominante)' : '$209k TCO (Capex inicial alto)',
          score: isFirst ? 7.8 : 8.6,
          rationale: isFirst
            ? 'Coste predecible mensual pero acumulativo a 3 años.'
            : 'Menor coste neto a partir del mes 20 pese a la inversión inicial.',
        };
      } else if (c.id === 'crit-time') {
        ratings[opt.id][c.id] = {
          rawValue: isFirst ? '8 semanas de onboarding' : '24 semanas de ciclo de vida',
          score: isFirst ? 9.2 : 5.4,
          rationale: isFirst
            ? 'Integraciones llave en mano listas en menos de 2 meses.'
            : 'Curva de desarrollo prolongada con riesgo de desvíos en sprints.',
        };
      } else if (c.id === 'crit-scalability') {
        ratings[opt.id][c.id] = {
          rawValue: isFirst ? 'Latencia P95 < 45ms' : 'Latencia P95 < 60ms',
          score: isFirst ? 8.9 : 7.6,
          rationale: isFirst
            ? 'Infraestructura elástica global con auto-scaling nativo probado.'
            : 'Requiere tuning manual de clústeres y balanceadores.',
        };
      } else if (c.id === 'crit-security') {
        ratings[opt.id][c.id] = {
          rawValue: isFirst ? 'SOC2 Type II + ISO 27001' : 'Validación por InfoSec Interno',
          score: isFirst ? 8.5 : 7.9,
          rationale: isFirst
            ? 'Certificaciones de terceros listas para auditorías de clientes enterprise.'
            : 'Control total de la red pero responsabilidad de parches interna.',
        };
      } else if (c.id === 'crit-vendor-lockin') {
        ratings[opt.id][c.id] = {
          rawValue: isFirst ? 'APIs propietarias + exportador Parquet' : 'Código 100% Open Source',
          score: isFirst ? 6.2 : 9.3,
          rationale: isFirst
            ? 'Coste de conmutación medio si se decide migrar en el futuro.'
            : 'Cero fricción de portabilidad ni dependencia de roadmap ajeno.',
        };
      }
    });
  });

  const sensitivity = runFullSensitivityAnalysis(options, criteria, ratings);
  const matrixResult = calculateCompositeScores(options, criteria, ratings);
  const winner = options.find((o) => o.id === matrixResult.winnerOptionId) || options[0];
  const runnerUp = options.find((o) => o.id === matrixResult.runnerUpOptionId) || options[1];

  const executiveReport = {
    winningOptionId: winner.id,
    recommendationHeadline: `Aprobación Estratégica de «${winner.name}» (${winner.code})`,
    executiveSummary: `Tras un análisis multicriterio ponderado de 5 dimensiones cuantitativas y 6 evidencias de datos empíricos, la alternativa «${winner.name}» obtiene una puntuación compuesta de ${matrixResult.scores[winner.id]?.toFixed(2)} sobre 10, superando a la segunda opción por un margen neto de +${matrixResult.scoreGap.toFixed(2)} puntos. La decisión destaca por su aceleración del time-to-value y reducción del riesgo operativo inicial.`,
    strategicAlignment: `Alineada con el OKR Q3 de acelerar la entrega de valor a clientes corporativos minimizando el consumo de horas de ingeniería dedicadas a infraestructura no esencial.`,
    keyTradeOffs: [
      `Aceptación de un OPEX de suscripción $${winner.opexAnnualUsd.toLocaleString()}/año a cambio de recortar 16 semanas de incertidumbre de entrega.`,
      `El TCO a 3 años es ligeramente superior al escenario in-house, pero el coste de oportunidad de retrasar 4 meses la llegada al mercado compensa ampliamente el diferencial.`,
      `Se establecen cláusulas de salida contractuales con exportación periódica en formato abierto para mitigar el riesgo de lock-in tecnológico.`,
    ],
    stakeholderJustification: `Para el Comité de Dirección y Finanzas: La alternativa «${winner.name}» ofrece el retorno ajustado por riesgo más elevado. Con un TTV de solo ${winner.timeToValueWeeks} semanas y un consumo de 0.2 FTE frente a 1.5 FTE de la alternativa, libera recursos críticos de ingeniería para centrarse en productos nucleares de negocio.`,
    roadmap: [
      {
        phase: 'Fase 1: Validación de Seguridad & Contratación',
        timeline: 'Semanas 1 - 2',
        milestone: 'Aprobación de InfoSec, DPA firmado y Sandbox activado.',
        owner: 'Director de Seguridad & Compras',
      },
      {
        phase: 'Fase 2: Conexión de Datos & Piloto',
        timeline: 'Semanas 3 - 5',
        milestone: 'Pipeline de Snowflake/BigQuery conectado y test de carga P95 validado.',
        owner: 'Lead Data Engineer',
      },
      {
        phase: 'Fase 3: Despliegue General & Formación',
        timeline: 'Semanas 6 - 8',
        milestone: '100% de usuarios migrados y desconexión de tooling legado.',
        owner: 'Project Manager',
      },
    ],
    riskMitigation: [
      {
        risk: 'Subida inesperada en los costes de compute o consumo de licencias',
        severity: 'Medium' as const,
        contingency: 'Fijar alertas presupuestarias automatizadas al 80% y negociar techo de gasto contractual con revisión semestral.',
      },
      {
        risk: 'Resistencia al cambio de usuarios o fricción en adopción',
        severity: 'Low' as const,
        contingency: 'Programa de capacitación intensiva en las semanas 5-6 con 3 Champions designados por área.',
      },
    ],
  };

  return {
    id: `decision-${Date.now()}`,
    title: input.title,
    businessObjective: input.businessObjective,
    department: input.department,
    author: 'Analista de Datos / Líder de Proyecto',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options,
    criteria,
    ratings,
    sensitivity,
    executiveReport,
  };
}

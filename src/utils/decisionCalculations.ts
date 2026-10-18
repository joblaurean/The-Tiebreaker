import type {
  DecisionAnalysis,
  DecisionInput,
  DecisionOption,
  Criterion,
  CriterionRating,
} from '../types/decision';

export interface OptionScoreResult {
  proSum: number;
  conSum: number;
  netScore: number;
  totalWeights: number;
  proRatio: number; // 0 to 100
}

export interface MatrixResult {
  optionScores: Record<string, {
    weightedScore: number;
    rawTotal: number;
  }>;
  totalCriteriaWeight: number;
  leaderOptionId: string | null;
  isTie: boolean;
  scoreDifference: number;
}

/**
 * Calculates the balance of pros and cons based on user weights (1-5).
 */
export function calculateOptionScore(option: DecisionOption): OptionScoreResult {
  const proSum = option.pros.reduce((acc, p) => acc + (p.weight || 1), 0);
  const conSum = option.cons.reduce((acc, c) => acc + (c.weight || 1), 0);
  const netScore = proSum - conSum;
  const totalWeights = proSum + conSum;
  const proRatio = totalWeights > 0 ? Math.round((proSum / totalWeights) * 100) : 50;

  return {
    proSum,
    conSum,
    netScore,
    totalWeights,
    proRatio,
  };
}

/**
 * Calculates weighted scores for multicriteria evaluation matrix.
 */
export function calculateMatrixScores(
  options: DecisionOption[],
  criteria: Criterion[],
  ratings: Record<string, Record<string, CriterionRating>>
): MatrixResult {
  const totalCriteriaWeight = criteria.reduce((sum, c) => sum + (c.weight || 1), 0);
  const optionScores: Record<string, { weightedScore: number; rawTotal: number }> = {};

  let highestScore = -Infinity;
  let secondHighestScore = -Infinity;
  let leaderOptionId: string | null = null;

  for (const opt of options) {
    let weightedSum = 0;
    let rawTotal = 0;

    for (const crit of criteria) {
      const score = ratings[opt.id]?.[crit.id]?.score ?? 5;
      const weight = crit.weight || 1;
      weightedSum += score * weight;
      rawTotal += score;
    }

    const finalWeightedScore = totalCriteriaWeight > 0
      ? Number((weightedSum / totalCriteriaWeight).toFixed(2))
      : 0;

    optionScores[opt.id] = {
      weightedScore: finalWeightedScore,
      rawTotal,
    };

    if (finalWeightedScore > highestScore) {
      secondHighestScore = highestScore;
      highestScore = finalWeightedScore;
      leaderOptionId = opt.id;
    } else if (finalWeightedScore > secondHighestScore) {
      secondHighestScore = finalWeightedScore;
    }
  }

  const scoreDifference = secondHighestScore === -Infinity
    ? 0
    : Number(Math.abs(highestScore - secondHighestScore).toFixed(2));

  // If top scores differ by 0.35 points or less (on a 1-10 scale), it is considered a tight tiebreaker situation
  const isTie = scoreDifference <= 0.35 && options.length > 1;

  return {
    optionScores,
    totalCriteriaWeight,
    leaderOptionId,
    isTie,
    scoreDifference,
  };
}

/**
 * Translates categories to Spanish readable labels
 */
export function formatCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    career: 'Carrera y Trabajo',
    finance: 'Finanzas e Inversión',
    business: 'Negocio y Emprendimiento',
    lifestyle: 'Estilo de Vida y Hogar',
    education: 'Educación y Desarrollo',
    tech: 'Tecnología y Proyectos',
  };
  return map[category] || 'General';
}

/**
 * Translates risk level to Spanish readable labels
 */
export function formatRiskLabel(risk: string): string {
  const map: Record<string, string> = {
    low: 'Conservador (Bajo Riesgo)',
    moderate: 'Equilibrado (Riesgo Moderado)',
    high: 'Audaz (Alto Riesgo / Alto Retorno)',
  };
  return map[risk] || 'Moderado';
}

/**
 * Fallback generator for instant offline demonstration or test runs
 */
export function generateFallbackAnalysis(input: DecisionInput): DecisionAnalysis {
  const cleanOptions = input.optionNames.filter((n) => n.trim().length > 0);
  const optNames = cleanOptions.length >= 2 ? cleanOptions : ['Opción A', 'Opción B'];

  const criteria: Criterion[] = [
    {
      id: 'crit-growth',
      name: 'Potencial de Crecimiento',
      weight: 5,
      description: 'Impacto a medio y largo plazo en tus metas principales.',
    },
    {
      id: 'crit-wellbeing',
      name: 'Paz Mental y Bienestar',
      weight: 4,
      description: 'Estrés generado, equilibrio personal y calidad de vida.',
    },
    {
      id: 'crit-finances',
      name: 'Rendimiento y Seguridad Financiera',
      weight: 4,
      description: 'Costes, beneficios económicos y estabilidad de ingresos.',
    },
    {
      id: 'crit-reversibility',
      name: 'Facilidad de Reversibilidad',
      weight: 3,
      description: 'Capacidad de retroceder o corregir el rumbo si no funciona.',
    },
    {
      id: 'crit-autonomy',
      name: 'Autonomía y Control',
      weight: 3,
      description: 'Grado de control directo sobre los resultados y las decisiones diarias.',
    },
  ];

  const options: DecisionOption[] = optNames.map((name, idx) => {
    const id = `opt-${idx + 1}`;
    const isFirst = idx === 0;

    return {
      id,
      name,
      summary: isFirst
        ? `Enfoque proactivo centrado en maximizar el potencial y la transformación: ${name}.`
        : `Enfoque defensivo o alternativo enfocado en mitigar riesgos y preservar estabilidad: ${name}.`,
      pros: [
        {
          id: `pro-${id}-1`,
          text: isFirst ? 'Mayor horizonte de recompensas a largo plazo' : 'Menor incertidumbre y riesgos inmediatos controlados',
          weight: isFirst ? 5 : 4,
          category: 'Impacto',
          explanation: 'Permite avanzar con bases sólidas y mayor claridad de ejecución.',
        },
        {
          id: `pro-${id}-2`,
          text: isFirst ? 'Alineación más estrecha con tus prioridades expresadas' : 'Curva de adaptación más suave y predecible',
          weight: 4,
          category: 'Alineación',
          explanation: 'Reduce la fricción operativa durante los primeros meses.',
        },
        {
          id: `pro-${id}-3`,
          text: isFirst ? 'Crecimiento de habilidades y expansión de red' : 'Preservación de recursos y colchón de seguridad',
          weight: 3,
          category: 'Recursos',
          explanation: 'Optimiza la posición para futuras oportunidades.',
        },
      ],
      cons: [
        {
          id: `con-${id}-1`,
          text: isFirst ? 'Exige un esfuerzo inicial y curva de aprendizaje más pronunciada' : 'Costo de oportunidad por no explorar el máximo potencial',
          weight: isFirst ? 3 : 4,
          category: 'Fricción',
          explanation: 'Requiere disciplina y gestión deliberada de expectativas.',
        },
        {
          id: `con-${id}-2`,
          text: isFirst ? 'Cierto nivel de exposición a factores externos no controlados' : 'Riesgo de estancamiento o frustración diferida con el tiempo',
          weight: isFirst ? 4 : 3,
          category: 'Incertidumbre',
          explanation: 'Debe contemplarse en el plan de mitigación.',
        },
      ],
      swot: {
        strengths: isFirst
          ? ['Alta motivación intrínseca', 'Diferenciación y ventaja competitiva', 'Alineación con el futuro']
          : ['Estabilidad comprobada', 'Control directo del entorno actual', 'Bajo costo financiero inicial'],
        weaknesses: isFirst
          ? ['Mayor consumo de tiempo en fase de arranque', 'Dependencia de nuevos hábitos']
          : ['Menor emoción o entusiasmo renovado', 'Límites de crecimiento conocidos'],
        opportunities: isFirst
          ? ['Posicionamiento privilegiado en nuevos escenarios', 'Apertura a alianzas y aprendizajes rápidos']
          : ['Optimizar lo existente con mejoras incrementales', 'Acumular reservas para el momento óptimo'],
        threats: isFirst
          ? ['Fatiga temporal por sobrecarga de decisiones', 'Cambios macro imprevistos en el entorno']
          : ['Competencia externa que sí asume riesgos', 'Sensación de arrepentimiento por inacción'],
        strategicTip: isFirst
          ? 'Establece hitos de 30, 60 y 90 días con métricas claras para no dudar del proceso.'
          : 'Si eliges este camino, fija una fecha límite de revisión para no caer en la inercia pasiva.',
      },
    };
  });

  const ratings: Record<string, Record<string, CriterionRating>> = {};
  options.forEach((opt, idx) => {
    ratings[opt.id] = {};
    const isFirst = idx === 0;

    criteria.forEach((crit) => {
      let score = 7;
      let rationale = 'Desempeño equilibrado en esta dimensión.';

      if (crit.id === 'crit-growth') {
        score = isFirst ? 9 : 6;
        rationale = isFirst ? 'Excelente proyección y apertura de nuevos caminos.' : 'Crecimiento más gradual y lineal.';
      } else if (crit.id === 'crit-wellbeing') {
        score = isFirst ? 7 : 8;
        rationale = isFirst ? 'Exige gestionar el estrés inicial de cambio.' : 'Mayor tranquilidad por entorno conocido.';
      } else if (crit.id === 'crit-finances') {
        score = isFirst ? 8 : 7;
        rationale = isFirst ? 'Mayor techo de rentabilidad esperada.' : 'Ingresos o costes más seguros a corto plazo.';
      } else if (crit.id === 'crit-reversibility') {
        score = isFirst ? 6 : 9;
        rationale = isFirst ? 'Reversible con costo moderado de tiempo.' : 'Muy fácil de mantener o pausar.';
      } else if (crit.id === 'crit-autonomy') {
        score = isFirst ? 8 : 7;
        rationale = isFirst ? 'Empodera a tomar riendas directas.' : 'Sujeto a las reglas del ecosistema actual.';
      }

      ratings[opt.id][crit.id] = { score, rationale };
    });
  });

  const winner = options[0];
  const verdict: DecisionAnalysis['verdict'] = {
    winnerOptionId: winner.id,
    headline: `La balanza se inclina estratégicamente hacia «${winner.name}».`,
    rationale: `Tras ponderar los factores críticos frente al contexto planteado, «${winner.name}» presenta un valor neto superior porque ataca la causa raíz de tu dilema y maximiza el aprendizaje a largo plazo, evitando el riesgo invisible del estancamiento.`,
    confidenceScore: 84,
    decisiveFactor: `El factor de desempate decisivo es la asimetría positiva: los beneficios potenciales de «${winner.name}» superan con creces el coste temporal de la transición, mientras que la otra opción conlleva un coste de oportunidad permanente.`,
    isCloseCall: false,
    tenTenTenRule: {
      tenMinutes: `En 10 minutos sentirás un pico de alivio por haber cerrado la deliberación, acompañado de una dosis natural de adrenalina por dar el paso.`,
      tenMonths: `En 10 meses los primeros obstáculos iniciales estarán superados y los nuevos beneficios de «${winner.name}» formarán parte de tu rutina consolidada.`,
      tenYears: `En 10 años te alegrarás de no haber postergado la decisión por miedo a la fricción temporal: sentó un precedente de autoeficacia en tu vida.`,
    },
    reversibilityScore: 7,
    blindTestPrompt: `Prueba del Desempate Emocional: Imagina que lanzas una moneda al aire. Si en el aire la moneda marcara que debes elegir «${options[1]?.name || 'la alternativa'}», ¿tu primer impulso sería alivio o una pequeña decepción? Tu intuición ya sabe cuál quieres.`,
    preMortemAnalysis: `Plan Pre-Mortem: Si dentro de 6 meses las cosas no fueran según lo planeado, la causa principal sería la dispersión en los primeros 45 días. Antidoto: define 2 metas no negociables semanales y un hito de parada o pivote al día 90.`,
  };

  return {
    options,
    criteria,
    ratings,
    verdict,
    generatedAt: new Date().toISOString(),
  };
}

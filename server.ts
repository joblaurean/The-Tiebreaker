import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateFallbackAnalysis } from './src/utils/decisionCalculations.ts';
import { generateFallbackEnterpriseDecision, runFullSensitivityAnalysis } from './src/utils/enterpriseDecision.ts';
import type { DecisionInput, DecisionAnalysis } from './src/types/decision.ts';
import type { EnterpriseDecisionInput, EnterpriseDecision } from './src/types/enterprise.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Gemini Decision Analysis Schema
const decisionSchema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      description: 'List of analyzed decision options/alternatives with detailed pros, cons and SWOT.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                weight: { type: Type.INTEGER, description: 'Importance from 1 (low) to 5 (critical)' },
                category: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'text', 'weight'],
            },
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                weight: { type: Type.INTEGER, description: 'Importance/friction from 1 (minor) to 5 (severe)' },
                category: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'text', 'weight'],
            },
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategicTip: { type: Type.STRING },
            },
            required: ['strengths', 'weaknesses', 'opportunities', 'threats', 'strategicTip'],
          },
        },
        required: ['id', 'name', 'summary', 'pros', 'cons', 'swot'],
      },
    },
    criteria: {
      type: Type.ARRAY,
      description: 'Standardized evaluation criteria across all options.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          weight: { type: Type.INTEGER, description: '1 to 5' },
          description: { type: Type.STRING },
        },
        required: ['id', 'name', 'weight', 'description'],
      },
    },
    ratings: {
      type: Type.OBJECT,
      description: 'Key-value map of option ID to map of criterion ID to score (1-10) and rationale.',
    },
    verdict: {
      type: Type.OBJECT,
      properties: {
        winnerOptionId: { type: Type.STRING },
        headline: { type: Type.STRING },
        rationale: { type: Type.STRING },
        confidenceScore: { type: Type.INTEGER, description: '0 to 100 percentage confidence' },
        decisiveFactor: { type: Type.STRING, description: 'The exact key insight that tips the balance' },
        isCloseCall: { type: Type.BOOLEAN },
        tenTenTenRule: {
          type: Type.OBJECT,
          properties: {
            tenMinutes: { type: Type.STRING },
            tenMonths: { type: Type.STRING },
            tenYears: { type: Type.STRING },
          },
          required: ['tenMinutes', 'tenMonths', 'tenYears'],
        },
        reversibilityScore: { type: Type.INTEGER, description: '1 (irreversible) to 10 (effortlessly reversible)' },
        blindTestPrompt: { type: Type.STRING, description: 'Coin-flip gut check psychological question' },
        preMortemAnalysis: { type: Type.STRING, description: 'Pre-mortem risk mitigation plan' },
      },
      required: [
        'winnerOptionId',
        'headline',
        'rationale',
        'confidenceScore',
        'decisiveFactor',
        'isCloseCall',
        'tenTenTenRule',
        'reversibilityScore',
        'blindTestPrompt',
        'preMortemAnalysis',
      ],
    },
  },
  required: ['options', 'criteria', 'ratings', 'verdict'],
};

// API Endpoint: /api/analyze-decision
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const input: DecisionInput = req.body;

    if (!input || !input.title || !input.optionNames || input.optionNames.length < 2) {
      return res.status(400).json({
        error: 'Por favor, proporciona el dilema y al menos 2 opciones a comparar.',
      });
    }

    if (!aiClient) {
      // Deterministic fallback if API key is not configured
      const fallback = generateFallbackAnalysis(input);
      return res.json({
        ...fallback,
        source: 'fallback',
        message: 'Generado con motor heurístico local de Desempate.',
      });
    }

    const prompt = `
Actúa como un estratega de decisiones de clase mundial y psicólogo de toma de decisiones para la aplicación «Desempate».
Tu objetivo es analizar en profundidad este dilema humano o profesional y desatascar la indecisión.

Dilema: "${input.title}"
Contexto y Prioridades del usuario: "${input.context || 'No especificado explícitamente.'}"
Categoría: "${input.category}"
Perfil de Tolerancia al Riesgo: "${input.riskTolerance}"
Opciones a comparar:
${input.optionNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Instrucciones de análisis:
1. Analiza cada opción con rigor e imparcialidad, generando:
   - Resumen conciso de la propuesta de valor.
   - 3 a 5 Pros reales y fundamentados, cada uno con un peso de importancia (1 a 5) y categoría.
   - 2 a 4 Contras reales y honestos, cada uno con peso de fricción (1 a 5) y categoría.
   - Análisis DAFO (SWOT): Debilidades, Amenazas, Fortalezas y Oportunidades claras, más 1 consejo estratégico clave.
2. Define de 4 a 6 Criterios de Evaluación Multicriterio relevantes (ej. Crecimiento a Largo Plazo, Bienestar y Estrés, Rendimiento Financiero, Grado de Autonomía, Facilidad de Reversibilidad, Alineación con Valores).
3. Asigna a cada opción una calificación en cada criterio de 1 a 10 con una justificación de una frase. La estructura de ratings debe ser un objeto con formato:
   {
     "opción_id": {
       "criterio_id": { "score": 8, "rationale": "..." }
     }
   }
4. EMITE EL VEREDICTO DE DESEMPATE («Veredicto de Desempate»):
   - Identifica la opción ganadora con fundamentos sólidos.
   - Señala claramente el "Factor de Desempate" (la variable crítica que rompe el empate).
   - Aplica la regla 10/10/10 (¿Cómo te afectará en 10 minutos, en 10 meses y en 10 años?).
   - Evalúa la Reversibilidad (escala 1 a 10: 10 siendo una puerta de dos direcciones como define Jeff Bezos, y 1 siendo irreversible).
   - Redacta el "Test de la Moneda / Intuición" para despertar la sensación visceral del usuario.
   - Realiza un "Análisis Pre-Mortem": si esta decisión fallase dentro de 1 año, ¿cuál habría sido el motivo y cómo protegerse desde hoy?

Responde en español, con un tono analítico, empático y perspicaz. Todo debe devolver formato JSON estricto.
    `.trim();

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: decisionSchema,
        systemInstruction:
          'Eres Desempate, el asesor analítico de decisiones más lúcido, perspicaz y estructurado. Tu misión es desatascar dudas difíciles combinando teoría de decisiones multicriterio, psicología del arrepentimiento y pragmatismo estratégico.',
        temperature: 0.7,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData: DecisionAnalysis = JSON.parse(jsonText);

    // Ensure IDs exist and ratings are well-formed
    if (!parsedData.options || parsedData.options.length === 0) {
      throw new Error('Estructura de respuesta inválida');
    }

    parsedData.options.forEach((opt, idx) => {
      if (!opt.id) opt.id = `opt-${idx + 1}`;
      opt.pros = (opt.pros || []).map((p, pIdx) => ({
        ...p,
        id: p.id || `pro-${opt.id}-${pIdx + 1}`,
        weight: typeof p.weight === 'number' ? Math.max(1, Math.min(5, p.weight)) : 3,
      }));
      opt.cons = (opt.cons || []).map((c, cIdx) => ({
        ...c,
        id: c.id || `con-${opt.id}-${cIdx + 1}`,
        weight: typeof c.weight === 'number' ? Math.max(1, Math.min(5, c.weight)) : 3,
      }));
    });

    parsedData.criteria = (parsedData.criteria || []).map((c, cIdx) => ({
      ...c,
      id: c.id || `crit-${cIdx + 1}`,
      weight: typeof c.weight === 'number' ? Math.max(1, Math.min(5, c.weight)) : 3,
    }));

    parsedData.generatedAt = new Date().toISOString();

    return res.json({
      ...parsedData,
      source: 'gemini',
    });
  } catch (err: unknown) {
    console.error('Error generating decision analysis:', err);
    // Graceful fallback on API or parsing error
    const input: DecisionInput = req.body;
    const fallback = generateFallbackAnalysis(input);
    return res.json({
      ...fallback,
      source: 'fallback',
      warning: 'Se generó con motor heurístico debido a un límite temporal de la API.',
    });
  }
});

// Enterprise Decision Schema
const enterpriseDecisionSchema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          code: { type: Type.STRING },
          name: { type: Type.STRING },
          vendorOrTeam: { type: Type.STRING },
          capexUsd: { type: Type.NUMBER },
          opexAnnualUsd: { type: Type.NUMBER },
          timeToValueWeeks: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          dataEvidence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                metricName: { type: Type.STRING },
                value: { type: Type.STRING },
                unit: { type: Type.STRING },
                confidence: { type: Type.STRING },
                sourceName: { type: Type.STRING },
                benchmarkBenchmark: { type: Type.STRING },
              },
              required: ['id', 'metricName', 'value', 'unit', 'confidence', 'sourceName'],
            },
          },
        },
        required: [
          'id',
          'code',
          'name',
          'vendorOrTeam',
          'capexUsd',
          'opexAnnualUsd',
          'timeToValueWeeks',
          'riskLevel',
          'executiveSummary',
          'dataEvidence',
        ],
      },
    },
    criteria: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          weightPercent: { type: Type.NUMBER },
          description: { type: Type.STRING },
          direction: { type: Type.STRING },
        },
        required: ['id', 'name', 'category', 'weightPercent', 'description', 'direction'],
      },
    },
    ratings: {
      type: Type.OBJECT,
      description: 'Nested map of [optionId][criterionId] to { rawValue, score: number 1-10, rationale }',
    },
    executiveReport: {
      type: Type.OBJECT,
      properties: {
        recommendationHeadline: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        strategicAlignment: { type: Type.STRING },
        keyTradeOffs: { type: Type.ARRAY, items: { type: Type.STRING } },
        stakeholderJustification: { type: Type.STRING },
        roadmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phase: { type: Type.STRING },
              timeline: { type: Type.STRING },
              milestone: { type: Type.STRING },
              owner: { type: Type.STRING },
            },
            required: ['phase', 'timeline', 'milestone', 'owner'],
          },
        },
        riskMitigation: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              risk: { type: Type.STRING },
              severity: { type: Type.STRING },
              contingency: { type: Type.STRING },
            },
            required: ['risk', 'severity', 'contingency'],
          },
        },
      },
      required: [
        'recommendationHeadline',
        'executiveSummary',
        'strategicAlignment',
        'keyTradeOffs',
        'stakeholderJustification',
        'roadmap',
        'riskMitigation',
      ],
    },
  },
  required: ['options', 'criteria', 'ratings', 'executiveReport'],
};

// API Endpoint: /api/analyze-enterprise-decision
app.post('/api/analyze-enterprise-decision', async (req, res) => {
  try {
    const input: EnterpriseDecisionInput = req.body;

    if (!input || !input.title || !input.optionNames || input.optionNames.length < 2) {
      return res.status(400).json({
        error: 'Por favor, proporciona el dilema empresarial y al menos 2 alternativas a evaluar.',
      });
    }

    if (!aiClient) {
      const fallback = generateFallbackEnterpriseDecision(input);
      return res.json({
        ...fallback,
        source: 'fallback',
        message: 'Generado con motor cuantitativo local de The Tiebreaker: Enterprise Edition.',
      });
    }

    const targetLang = input.language || 'en';
    const langInstructions: Record<string, string> = {
      en: 'Respond in professional corporate English with high analytical rigor.',
      es: 'Responde en español corporativo con alto rigor analítico.',
      pt: 'Responda em português corporativo com alto rigor analítico.',
      fr: 'Répondez en français professionnel d’entreprise avec une grande rigueur analytique.',
      de: 'Antworten Sie auf professionellem Unternehmens-Deutsch mit hoher analytischer Präzision.',
      zh: '请使用专业严谨的企业商务中文回答。',
    };
    const langDirective = langInstructions[targetLang] || langInstructions.en;

    const prompt = `
Act as a Chief Data & Architecture Officer and Senior Strategic Consultant for «The Tiebreaker: Enterprise Edition».
Quantitatively analyze this strategic enterprise decision for data leaders, project managers, and executive steering committees.

Decision Title: "${input.title}"
Business Objective / OKRs: "${input.businessObjective || 'Optimize performance, scalability, and corporate TCO.'}"
Department: "${input.department || 'Data & Analytics'}"
Candidate Alternatives to Compare:
${input.optionNames.map((name, i) => `ALT-0${i + 1}: ${name}`).join('\n')}

Quantitative Enterprise Requirements:
1. Define 4 to 6 Weighted Criteria that sum to exactly 100% (Financial, Technical, Operational, Strategic, Risk). Assign direction ('higher_is_better' or 'lower_is_better').
2. For each alternative generate:
   - Identifier code (ALT-01, ALT-02...)
   - Estimated CAPEX in USD, Annual OPEX in USD, Time to Value in weeks, RiskLevel ('Low', 'Medium', 'High').
   - Technical executive summary.
   - 2 to 4 concrete empirical Data Metrics and Evidence tied to real data sources (Snowflake, BigQuery, Datadog APM, AWS FinOps, SOC2 Type II, Industry Benchmarks) with measurement units and confidence level (High CI 95% or Moderate).
3. Scoring Matrix:
   - Rate each option across each criterion on an objective 1 to 10 scale with rawValue (e.g. "$180k/yr", "P95 Latency < 25ms", "99.99% SLA") and a concise rationale.
4. Executive Stakeholder Report:
   - Strategic recommendation headline.
   - Executive summary for the steering committee / board.
   - Strategic alignment with business OKRs.
   - Key quantified trade-offs.
   - Financial and operational justification.
   - 3-phase Implementation Roadmap with milestones and role owners.
   - Risk mitigation plan with severity levels and contingency actions.

${langDirective} Strict JSON format matching schema.
    `.trim();

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: enterpriseDecisionSchema,
        systemInstruction:
          'Eres The Tiebreaker: Enterprise Edition, el motor de toma de decisiones cuantitativas y análisis de sensibilidad para líderes de datos y tecnología. Priorizas métricas duras, TCO, SLAs, análisis What-If y gobernanza de datos sobre opiniones subjetivas.',
        temperature: 0.5,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);

    // Normalize weights to 100% if needed
    const totalW = (parsedData.criteria || []).reduce((sum: number, c: any) => sum + (c.weightPercent || 0), 0);
    if (totalW > 0 && Math.abs(totalW - 100) > 1) {
      parsedData.criteria.forEach((c: any) => {
        c.weightPercent = Math.round((c.weightPercent / totalW) * 100);
      });
    }

    // Compute sensitivity
    const sensitivity = runFullSensitivityAnalysis(parsedData.options, parsedData.criteria, parsedData.ratings);

    const fullDecision: EnterpriseDecision = {
      id: `decision-${Date.now()}`,
      title: input.title,
      businessObjective: input.businessObjective,
      department: input.department,
      author: 'Líder de Proyecto / Analista de Datos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      options: parsedData.options,
      criteria: parsedData.criteria,
      ratings: parsedData.ratings,
      sensitivity,
      executiveReport: {
        ...parsedData.executiveReport,
        winningOptionId: parsedData.options[0]?.id || '',
      },
    };

    return res.json({
      ...fullDecision,
      source: 'gemini',
    });
  } catch (err: unknown) {
    console.error('Error generating enterprise decision:', err);
    const input: EnterpriseDecisionInput = req.body;
    const fallback = generateFallbackEnterpriseDecision(input);
    return res.json({
      ...fallback,
      source: 'fallback',
      warning: 'Generado con motor cuantitativo heurístico local.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();

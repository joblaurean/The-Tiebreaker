import type { EnterpriseDecisionInput } from '../types/enterprise';
import type { Translations } from '../i18n/types';

export interface EnterprisePreset {
  id: string;
  badge: string;
  domain: string;
  name: string;
  input: EnterpriseDecisionInput;
}

export function getLocalizedEnterprisePresets(t: Translations): EnterprisePreset[] {
  return [
    {
      id: 'data-stack-migration',
      badge: t.presets.p1.badge,
      domain: t.presets.p1.domain,
      name: t.presets.p1.name,
      input: {
        title: t.presets.p1.title,
        businessObjective: t.presets.p1.objective,
        department: t.presets.p1.dept,
        optionNames: [
          t.presets.p1.opt1,
          t.presets.p1.opt2,
          t.presets.p1.opt3,
        ],
        budgetConstraintUsd: 180000,
      },
    },
    {
      id: 'cloud-infrastructure',
      badge: t.presets.p2.badge,
      domain: t.presets.p2.domain,
      name: t.presets.p2.name,
      input: {
        title: t.presets.p2.title,
        businessObjective: t.presets.p2.objective,
        department: t.presets.p2.dept,
        optionNames: [
          t.presets.p2.opt1,
          t.presets.p2.opt2,
        ],
        budgetConstraintUsd: 250000,
      },
    },
    {
      id: 'vector-ai-search',
      badge: t.presets.p3.badge,
      domain: t.presets.p3.domain,
      name: t.presets.p3.name,
      input: {
        title: t.presets.p3.title,
        businessObjective: t.presets.p3.objective,
        department: t.presets.p3.dept,
        optionNames: [
          t.presets.p3.opt1,
          t.presets.p3.opt2,
          t.presets.p3.opt3,
        ],
        budgetConstraintUsd: 75000,
      },
    },
  ];
}

export const ENTERPRISE_PRESETS: EnterprisePreset[] = [
  {
    id: 'data-stack-migration',
    badge: 'Data & Analytics',
    domain: 'Data Infrastructure',
    name: 'Snowflake vs. Databricks Lakehouse vs. BigQuery',
    input: {
      title: 'Enterprise Analytics & Data Warehouse Platform Selection (2026-2028)',
      businessObjective: 'Consolidate 40+ TB of telemetry and transactional data, maintain query P95 latency < 2s, and reduce monthly compute OPEX by 25%.',
      department: 'Data Platform & BI',
      optionNames: [
        'Snowflake Data Cloud (Separated Compute/Storage)',
        'Databricks Lakehouse Platform (Delta Lake & Spark)',
        'Google Cloud BigQuery (Serverless Analytics)',
      ],
      budgetConstraintUsd: 180000,
    },
  },
  {
    id: 'cloud-infrastructure',
    badge: 'DevOps & Cloud',
    domain: 'Systems Architecture',
    name: 'Multi-Cloud Kubernetes vs. Managed Serverless',
    input: {
      title: 'Microservices Deployment Strategy: Multi-Cloud EKS/GKE vs. Managed Serverless',
      businessObjective: 'Ensure 99.99% uptime SLA for critical billing APIs while keeping the infrastructure operations team under 3 dedicated FTEs.',
      department: 'Infrastructure & Platform',
      optionNames: [
        'Multi-Cloud Kubernetes Architecture (AWS EKS + GCP GKE)',
        'Managed Serverless Architecture (GCP Cloud Run + AWS Lambda)',
      ],
      budgetConstraintUsd: 250000,
    },
  },
  {
    id: 'vector-ai-search',
    badge: 'AI & Search',
    domain: 'Artificial Intelligence',
    name: 'Vertex AI Search vs. Managed Pinecone vs. Self-Hosted Qdrant',
    input: {
      title: 'Enterprise Vector Database & RAG Pipeline Evaluation for Internal Copilot',
      businessObjective: 'Index 2.5 million corporate docs, honor Google Workspace ACL permissions, and guarantee hybrid search response latency under 120ms.',
      department: 'AI & Data Science',
      optionNames: [
        'Google Cloud Vertex AI Search & Vector Store',
        'Pinecone Serverless Vector Database',
        'Self-Hosted Qdrant Cluster on Kubernetes',
      ],
      budgetConstraintUsd: 75000,
    },
  },
];

import type { EnterpriseDecisionInput } from '../types/enterprise';

export interface EnterprisePreset {
  id: string;
  badge: string;
  domain: string;
  name: string;
  input: EnterpriseDecisionInput;
}

export const ENTERPRISE_PRESETS: EnterprisePreset[] = [
  {
    id: 'data-stack-migration',
    badge: 'Data & Analytics',
    domain: 'Infraestructura de Datos',
    name: 'Snowflake vs. Databricks Lakehouse vs. BigQuery',
    input: {
      title: 'Selección de Plataforma Central de Analítica & Data Warehouse para 2026-2028',
      businessObjective: 'Centralizar más de 40 TB de telemetría y datos transaccionales, reducir la latencia P95 de queries a <2s y bajar el OPEX mensual de compute en al menos un 25%.',
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
    domain: 'Arquitectura de Sistemas',
    name: 'Multi-Cloud Kubernetes vs. Cloud Run / Serverless',
    input: {
      title: 'Estrategia de Despliegue de Microservicios: Multi-Cloud EKS/GKE vs. Serverless Gestionado',
      businessObjective: 'Garantizar SLA 99.99% para servicios críticos de facturación y APIs externas, manteniendo el equipo de infraestructura en menos de 3 FTEs dedicados.',
      department: 'Infraestructura & Plataforma',
      optionNames: [
        'Arquitectura Multi-Cloud con Kubernetes (AWS EKS + GCP GKE)',
        'Arquitectura Serverless Gestionada (GCP Cloud Run + AWS Lambda)',
      ],
      budgetConstraintUsd: 250000,
    },
  },
  {
    id: 'vector-ai-search',
    badge: 'IA & Búsqueda',
    domain: 'Inteligencia Artificial',
    name: 'Vertex AI Search vs. Pinecone Gestionado vs. Self-Hosted Qdrant',
    input: {
      title: 'Evaluación de Base de Datos Vectorial & Pipeline RAG para Asistente Interno',
      businessObjective: 'Indexar 2.5 millones de documentos corporativos, respetar permisos ACL de Google Workspace y mantener tiempos de respuesta de búsqueda híbrida (dense + sparse) inferiores a 120ms.',
      department: 'AI & Data Science',
      optionNames: [
        'Google Cloud Vertex AI Search & Vector Store',
        'Pinecone Serverless Vector Database',
        'Clúster Self-Hosted Qdrant en Kubernetes',
      ],
      budgetConstraintUsd: 75000,
    },
  },
];

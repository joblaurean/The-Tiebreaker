[README.md](https://github.com/user-attachments/files/33635058/README.md)
# The Tiebreaker: Enterprise Edition

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Plataforma cuantitativa de soporte a la decisión (DSS) diseñada para Analistas de Datos, Líderes Técnicos y Project Managers.** Transforma dilemas estratégicos complejos en matrices ponderadas multicriterio con trazabilidad de datos, simulación de escenarios de sensibilidad (*what-if*) y reportes ejecutivos listos para comités de dirección.

---

## 📋 Descripción del Proyecto

En entornos corporativos y de ingeniería, la toma de decisiones críticas no puede depender de listas intuitivas o sesgadas de simples «pros y contras». **The Tiebreaker: Enterprise Edition** introduce una metodología cuantitativa estructurada basada en el análisis de decisiones multicriterio (**MCDA / Multi-Criteria Decision Analysis**).

La herramienta permite a los equipos:
- Modelar criterios técnicos, financieros, operativos y estratégicos con ponderación porcentual estricta ($\sum W_i = 100\%$).
- Sustentar cada evaluación con métricas empíricas (SLA, TCO, Latencia, CAC) y fuentes de verdad verificables (Data Warehouses, APMs, ERPs).
- Evaluar la resiliencia de la alternativa ganadora ante fluctuaciones de prioridades mediante pruebas de tensión y análisis de sensibilidad dinámicos.
- Comunicar las conclusiones a los *stakeholders* mediante dossiers ejecutivos con justificación analítica objetiva.

---

## ⚡ Características Principales (Core Features)

### 1. Matriz de Decisión Ponderada Multicriterio (MCDA)
- **Criterios Personalizables:** Definición de criterios clasificados en categorías clave (*Financial, Technical, Operational, Strategic*).
- **Normalización de Pesos:** Distribución porcentual en tiempo real que garantiza una ponderación balanceada sobre el 100%.
- **Cálculo Determinista de Puntuaciones:** Evaluación en escala estandarizada [1-10] con cálculo automático de medias ponderadas y ranking instantáneo de alternativas:
  $$\text{Score}(A_j) = \sum_{i=1}^{n} \left( W_i \times S_{ij} \right)$$
- **Índice de Estabilidad y Margen de Victoria:** Métricas instantáneas de gobernanza que miden la solidez del liderazgo de la alternativa frente a sus competidoras directas.

### 2. Módulo de Análisis de Sensibilidad (*What-If Scenarios*)
- **Simulación Dinámica de Pesos:** Sliders interactivos con rebalanceo automático de los criterios restantes para proyectar cambios de prioridades de negocio.
- **Detección de Puntos de Inflexión (*Tipping Points*):** Identificación exacta del umbral de peso donde una alternativa subcampeona superaría a la opción recomendada.
- **Gráficos de Variación Delta:** Medición visual del impacto porcentual ($\Delta\%$) en la puntuación total de cada opción ante variaciones de mercado o presupuesto.

### 3. Trazabilidad de Evidencia Cuantitativa & Data Grounding
- **Métricas Operativas Vinculadas:** Asignación de variables medibles (p. ej., *SLA 99.99%*, *Throughput ops/sec*, *Costo Anual Proyectado*).
- **Fuentes de Datos Declaradas:** Identificación explícita del origen del dato (*Snowflake, Datadog, Jira, AWS Cost Explorer, Salesforce, FinOps Dashboard*).
- **Nivel de Confianza Metrológica:** Puntuación de certeza sobre la calidad de la evidencia utilizada (*High, Medium, Low*), mitigando riesgos de sesgo o datos obsoletos.

### 4. Generador de Reportes Ejecutivos para Stakeholders
- **Executive Dossier:** Resumen sintetizado con formato directivo que incluye:
  - Recomendación estratégica final y justificación basada en datos.
  - Análisis de riesgos mitigados y compensaciones (*trade-offs*).
  - Tabla comparativa de puntuaciones finales y auditoría de criterios clave.
- **Exportación & Distribución:** Preparado con estilos CSS específicos para impresión limpia o exportación a PDF para comités de dirección y juntas de arquitectura técnica (ARB).

---

## 🛠️ Tech Stack

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Arquitectura reactiva declarativa de alto rendimiento. |
| **Language** | **TypeScript 5.x** | Tipado estático estricto en modelos de decisión y esquemas de cálculo. |
| **Styling** | **Tailwind CSS v4** | Sistema de diseño corporativo tipo Business Intelligence (BI). |
| **Iconography** | **Lucide React** | Conjunto de iconos analíticos y de interfaz. |
| **Backend & Proxy** | **Express 4.21 + TSX** | Servidor para proxies seguros de API y entrega de activos. |
| **AI Inference** | **@google/genai (Gemini 2.5 Flash)** | Generación contextual de criterios empresariales con esquemas JSON estructurados. |
| **Bundler & Build** | **Vite 8** | Servidor de desarrollo optimizado y empaquetado para producción. |
| **Testing** | **Node.js Test Runner** (`node:test`) | Suite de pruebas unitarias para algoritmos matemáticos y normalización. |

---

## 📂 Estructura del Proyecto

```text
├── server.ts                   # Servidor Express, proxy de API Gemini y middlewares Vite
├── index.html                  # Punto de entrada HTML con metadatos y fuentes tipográficas
├── metadata.json               # Configuración y capacidades del aplicativo
├── package.json                # Definición de dependencias, scripts de test y build
├── vite.config.ts              # Configuración de compilación Vite y Tailwind CSS v4
│
├── src/
│   ├── main.tsx                # Montaje raíz de la aplicación React
│   ├── App.tsx                 # Controlador principal de estado, pestañas e integraciones
│   ├── index.css               # Importación global de Tailwind CSS
│   │
│   ├── components/
│   │   └── enterprise/
│   │       ├── EnterpriseNavbar.tsx        # Barra de navegación adaptable (Desktop/Mobile)
│   │       ├── EnterpriseForm.tsx          # Formulario cuantitativo y preajustes de dilemas
│   │       ├── EnterpriseHeaderKpis.tsx    # Tarjetas KPI de alto nivel (Líder, Estabilidad, Margen)
│   │       ├── WeightedMatrixView.tsx      # Matriz interactiva de decisión ponderada
│   │       ├── SensitivityView.tsx         # Simulador de escenarios What-If y puntos de quiebre
│   │       ├── DataEvidenceView.tsx        # Cuadrícula de evidencia métrica y fuentes de verdad
│   │       ├── ExecutiveReportView.tsx     # Generador de reportes ejecutivos para stakeholders
│   │       └── EnterpriseHistoryDrawer.tsx # Historial local de evaluaciones corporativas
│   │
│   ├── types/
│   │   ├── enterprise.ts       # Interfaces de criterios, alternativas, evidencias y reporte
│   │   └── decision.ts         # Tipos legacy de modelos de decisión
│   │
│   └── utils/
│       ├── enterpriseDecision.ts       # Algoritmos de cálculo ponderado y normalización
│       ├── enterpriseDecision.test.ts  # Pruebas unitarias para cálculo de MCDA
│       ├── decisionCalculations.ts     # Utilidades de simulación matemática
│       └── decisionCalculations.test.ts # Pruebas unitarias para simuladores
```

---

## 🚀 Instalación y Configuración Local

### Prerrequisitos
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/the-tiebreaker-enterprise.git
   cd the-tiebreaker-enterprise
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y añade tu clave de API de Gemini:
   ```bash
   cp .env.example .env
   ```
   Edita `.env` con tus credenciales:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   APP_URL="http://localhost:3000"
   ```

4. **Ejecutar la suite de pruebas unitarias:**
   ```bash
   npm test
   ```

5. **Iniciar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000`.

6. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 💡 Guía Rápida de Uso

1. **Definir el Dilema y Alternativas:**
   - Ingresa el título de la decisión (ej. *«Migración de Data Lakehouse: Snowflake vs. Databricks vs. BigQuery»*).
   - Añade el contexto empresarial, los OKRs impactados y las alternativas a evaluar.
   - *Tip:* Puedes usar uno de los **Escenarios Preconfigurados** para probar de inmediato la plataforma.

2. **Ajustar la Matriz Ponderada:**
   - Modifica los pesos de los criterios según las prioridades de tu organización (la suma siempre se mantendrá normalizada al 100%).
   - Califica el desempeño de cada opción del 1 al 10.

3. **Simular Escenarios de Sensibilidad (*What-If*):**
   - Accede a la pestaña de sensibilidad y altera los deslizadores de ponderación.
   - Observa si la decisión es robusta o si un recorte de presupuesto altera al ganador.

4. **Vincular Métricas y Fuentes:**
   - Registra los datos empíricos de soporte (latencia observada, presupuestos aprobados, cotizaciones formales) y califica la confianza de la fuente.

5. **Exportar el Reporte Ejecutivo:**
   - Revisa el resumen gerencial generado, los *trade-offs* detectados y genera la versión para comités mediante el botón **Imprimir / Guardar PDF**.

---

## 🧪 Pruebas Automatizadas

El proyecto utiliza el ejecutor de pruebas nativo de Node.js (`node:test`) para validar los motores de cálculo en milisegundos sin dependencias externas pesadas:

```bash
npm run test
```

Los tests aseguran:
- Consistencia en la suma de pesos ponderados.
- Preservación de la precisión en puntuaciones de alternativas compuestas.
- Manejo correcto de empates técnicos (*ties*) y cálculo de márgenes de victoria.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas para enriquecer las capacidades analíticas de la plataforma. Para colaborar:

1. Realiza un Fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-metrica-mcda`).
3. Realiza tus cambios asegurando que los tests pasen (`npm test && npm run lint`).
4. Haz Commit con mensajes descriptivos bajo estándares de Conventional Commits (`git commit -m 'feat: add AHP sensitivity analysis'`).
5. Sube tu rama (`git push origin feature/nueva-metrica-mcda`).
6. Abre un Pull Request detallando el racional del cambio y evidencia de pruebas.

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.

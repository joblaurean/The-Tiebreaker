import type { DecisionInput } from '../types/decision';

export interface DilemmaPreset {
  id: string;
  name: string;
  categoryName: string;
  badge: string;
  data: DecisionInput;
}

export const PRESET_DILEMMAS: DilemmaPreset[] = [
  {
    id: 'career-remote-startup',
    name: 'Oferta Remota vs. Ascenso Local',
    categoryName: 'Carrera',
    badge: 'Profesional',
    data: {
      title: '¿Aceptar oferta 100% remota en startup internacional o quedarme con ascenso a líder?',
      context: 'Llevo 3 años y medio en mi empresa actual. El ambiente es bueno y me prometieron el ascenso a líder de equipo en 2 meses (+12% de sueldo). Sin embargo, recibí una oferta de una startup europea con trabajo remoto, compensación +32% en USD y tecnología puntera, aunque con menor estabilidad a largo plazo.',
      category: 'career',
      riskTolerance: 'moderate',
      optionNames: [
        'Aceptar oferta remota en startup (+32% y autonomía)',
        'Permanecer en empresa actual con ascenso a Team Lead',
      ],
    },
  },
  {
    id: 'lifestyle-housing',
    name: 'Comprar en las Afueras vs. Alquilar en el Centro',
    categoryName: 'Estilo de Vida',
    badge: 'Finanzas & Hogar',
    data: {
      title: '¿Comprar casa con jardín en las afueras o seguir alquilando en el centro?',
      context: 'Tenemos ahorrada la entrada para una hipoteca. Podemos adquirir una casa unifamiliar amplia con jardín y teletrabajo a 40 minutos en tren, o renovar el alquiler de nuestro piso en el centro para seguir disfrutando de caminar al trabajo, cultura y restaurantes.',
      category: 'lifestyle',
      riskTolerance: 'low',
      optionNames: [
        'Comprar casa con espacio y jardín a 40 min',
        'Alquilar piso moderno en el centro sin ataduras',
      ],
    },
  },
  {
    id: 'business-monetization',
    name: 'SaaS: Freemium Viral vs. Pago Directo B2B',
    categoryName: 'Negocio',
    badge: 'Estrategia',
    data: {
      title: '¿Lanzar producto con nivel Freemium o cobrar desde el primer día a empresas?',
      context: 'Estamos finalizando el MVP de una herramienta de automatización para creadores y agencias. Un modelo freemium nos dará usuarios rápidos y feedback, pero consumirá costes de servidor y soporte. Cobrar directo validará la disposición de pago real y asegurará flujo de caja.',
      category: 'business',
      riskTolerance: 'high',
      optionNames: [
        'Freemium Product-Led Growth para viralidad',
        'Cobro directo B2B desde el día 1 ($49/mes)',
      ],
    },
  },
  {
    id: 'education-upskilling',
    name: 'Bootcamp Práctico vs. Máster Universitario',
    categoryName: 'Educación',
    badge: 'Aprendizaje',
    data: {
      title: '¿Hacer un bootcamp intensivo de 6 meses o cursar un máster oficial de 2 años?',
      context: 'Quiero reorientar mi carrera hacia el desarrollo de software e inteligencia artificial. El bootcamp dura 6 meses y se enfoca en proyectos para portafolio. El máster otorga título oficial reconocido internacionalmente pero exige 24 meses y materias más teóricas.',
      category: 'education',
      riskTolerance: 'moderate',
      optionNames: [
        'Bootcamp acelerado de 6 meses orientado a portfolio',
        'Máster oficial universitario de 2 años con título',
      ],
    },
  },
];

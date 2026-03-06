// config/empresaConfig.js
// Configuración de la empresa cliente actual de la plataforma MAYIA

export const EMPRESA_CONFIG = {
  // Información básica
  nombre: 'Grupo MVS',
  nombreCompleto: 'Grupo MVS - Medios, Telecomunicaciones y Restaurantes',
  industria: 'Conglomerado de Medios, Telecomunicaciones y Servicios',
  fundacion: 1967,
  pais: 'México',
  fundador: 'Joaquín Vargas Gómez',
  controlador: 'Familia Vargas',
  slogan: 'Innovación en medios y telecomunicaciones',

  // Descripción corporativa
  descripcion: 'Grupo MVS es un importante conglomerado mexicano con presencia en medios de comunicación, telecomunicaciones y servicios restauranteros. Líder en radio, televisión de paga, internet satelital y operación de cadenas de restaurantes.',

  // Datos operativos
  operaciones: {
    estacionesRadio: '12+ estaciones icónicas',
    canalesTv: 'Múltiples canales de televisión de paga',
    restaurantes: '200+ ubicaciones en México',
    empleados: '5,000+',
    mercados: 'México (cobertura nacional)',
    divisiones: [
      'Radio MVS',
      'Dish México (Telecomunicaciones)',
      'MVS TV y canales de paga',
      'CMR (Corporación Mexicana de Restaurantes)',
      'MVS Educación (UTECA)',
      'Publicidad exterior',
      'Editorial'
    ]
  },

  // Marcas y propiedades del portafolio
  marcas: {
    radio: [
      'EXA FM (90.9 FM) - Música pop contemporánea',
      'La Mejor (100.3 FM) - Música grupera y regional',
      'MVS Noticias (102.5 FM) - Radio informativa',
      'FM Globo - Música internacional',
      'Beat 100.9 FM',
      'Stereorey'
    ],
    television: [
      'MVS TV',
      'Multimedios Televisión',
      'MASTV (anteriormente)',
      'Canales de paga'
    ],
    telecomunicaciones: [
      'Dish México - TV satelital',
      'Internet satelital',
      'Servicios de telecomunicaciones'
    ],
    restaurantes: [
      'Wings (comida casual)',
      'Chilis (casual dining)',
      'Red Lobster (mariscos)',
      'Olive Garden (cocina italiana)',
      'On The Border (comida Tex-Mex)'
    ],
    otros: [
      'UTECA (Universidad)',
      'Publicidad exterior',
      'Editorial MVS'
    ]
  },

  // Servicios principales
  serviciosPrincipales: [
    'Transmisión de radio AM/FM',
    'Producción de contenido audiovisual',
    'Televisión satelital (Dish)',
    'Internet satelital',
    'Operación de cadenas de restaurantes',
    'Educación universitaria',
    'Publicidad exterior',
    'Servicios editoriales'
  ],

  // Contactos corporativos
  contacto: {
    sitioWeb: 'https://www.mvs.com',
    corporativo: '+52 55 5261 2600',
    dish: 'https://www.dish.com.mx',
    exa: 'https://exa.fm',
    noticias: 'https://mvsnoticias.com'
  },

  // Enfoque estratégico
  enfoqueEstrategico: [
    'Liderazgo en medios de comunicación',
    'Innovación en telecomunicaciones',
    'Diversificación de negocios',
    'Cobertura nacional en radio',
    'Expansión de servicios digitales',
    'Calidad en entretenimiento y restaurantes',
    'Transformación digital de operaciones'
  ],

  // Servicios MAYIA prioritarios (según industria de medios y conglomerado)
  serviciosPrioritarios: {
    mediosRadio: [
      '🎙️ MonitorIA - Detección de menciones en transmisiones',
      'Analytics de audiencia y ratings',
      'Programación automatizada inteligente',
      'Análisis de contenido y tendencias',
      'Recomendación de contenido musical',
      'Monitoreo de competencia'
    ],
    telecomunicaciones: [
      'Atención a clientes Dish 24/7',
      'Predicción de churn (cancelaciones)',
      'Optimización de infraestructura satelital',
      'Recomendación de paquetes',
      'Detección de fraude'
    ],
    restaurantes: [
      'Control de inventario inteligente',
      'Predicción de demanda por ubicación',
      'Optimización de menús',
      'Análisis de satisfacción del cliente',
      'Gestión de personal por turno'
    ],
    rh: [
      'Reclutamiento inteligente',
      'Evaluación de desempeño',
      'Capacitación de personal multimedia',
      'Gestión de talento creativo'
    ],
    atencionCliente: [
      'Chatbots para Dish y servicios',
      'WhatsApp automatizado',
      'Agentes virtuales 24/7',
      'Gestión de quejas y sugerencias'
    ],
    ti: [
      'Ciberseguridad para transmisiones',
      'Infraestructura Cloud',
      'Gestión de bases de datos multimedia',
      'Protección de contenido digital'
    ],
    administracion: [
      'Analytics de negocios multiindustria',
      'Optimización de procesos',
      'Control financiero consolidado',
      'Inteligencia de mercado'
    ],
    marketingPublicidad: [
      'Análisis de campañas publicitarias',
      'Segmentación de audiencias',
      'Medición de ROI en pauta',
      'Predicción de impacto de campañas'
    ]
  },

  // MonitorIA - Servicio estrella para medios
  monitorIA: {
    descripcion: 'Sistema de monitoreo inteligente que escucha transmisiones de radio en tiempo real para detectar menciones de marcas y palabras clave contratadas',
    radiosMonitoreadas: [
      'EXA FM (90.9)',
      'La Mejor (100.3)',
      'MVS Radio (102.5)'
    ],
    funcionalidades: [
      'Detección automática de palabras clave',
      'Análisis de audio en tiempo real',
      'Reportes de menciones con timestamp',
      'Niveles de confianza por detección',
      'Dashboard de visualización',
      'Alertas automáticas',
      'Métricas de cumplimiento publicitario'
    ],
    casos_uso: [
      'Verificar cumplimiento de pautas publicitarias',
      'Monitorear menciones de marcas patrocinadoras',
      'Análisis competitivo de publicidad',
      'Control de calidad de transmisiones',
      'Reportes para clientes anunciantes',
      'Auditoría de contenido comercial'
    ],
    beneficios: [
      'Automatización del monitoreo manual',
      'Precisión del 99% en detecciones',
      'Reportes en tiempo real',
      'Reducción de costos operativos',
      'Transparencia con anunciantes',
      'Optimización de inventario publicitario'
    ]
  },

  // Cursos recomendados (según perfil de conglomerado de medios)
  cursosRecomendados: {
    gerentes: [
      'IA para Gerentes',
      'Analytics de Negocios',
      'Transformación Digital',
      'Toma de Decisiones Estratégicas',
      'Liderazgo en la Era Digital'
    ],
    medios: [
      'IA para Medios y Comunicación',
      'Análisis de Audiencias',
      'Machine Learning para Contenido',
      'NLP para Análisis de Audio',
      'Computer Vision para Video'
    ],
    ventas: [
      'IA para Trabajo Inteligente',
      'Comunicación Efectiva',
      'Fundamentos del Prompting',
      'Analytics para Ventas'
    ],
    ti: [
      'Ciberseguridad',
      'Python Fundamentos',
      'SQL Básico',
      'ML para Negocios',
      'Cloud Computing',
      'Streaming y CDN'
    ],
    operaciones: [
      'Series Temporales',
      'Análisis Estadístico',
      'Data Wrangling',
      'Tableau Visualización',
      'Optimización de Procesos'
    ],
    restaurantes: [
      'IA para Retail',
      'Predicción de Demanda',
      'Gestión de Inventarios',
      'Analytics de Clientes'
    ]
  },

  // Casos de uso específicos de IA por división
  casosDeUsoIA: {
    radio: {
      monitoreo: 'MonitorIA detecta automáticamente menciones de marcas en transmisiones en vivo',
      programacion: 'IA sugiere playlist basadas en horario, audiencia y tendencias',
      audiencia: 'Predicción de ratings por contenido y horario',
      contenido: 'Análisis de sentimiento de llamadas y comentarios',
      publicidad: 'Optimización de inventario publicitario por horario'
    },
    television: {
      recomendacion: 'Sistema de recomendación de contenido para Dish',
      analisis: 'Análisis de preferencias de suscriptores',
      produccion: 'IA para edición automática de contenido',
      subtitulos: 'Generación automática de subtítulos'
    },
    restaurantes: {
      demanda: 'Predicción de demanda por día, horario y clima',
      inventario: 'Optimización de stock de ingredientes',
      precios: 'Análisis dinámico de precios',
      experiencia: 'Análisis de sentimiento en reseñas'
    },
    telecomunicaciones: {
      churn: 'Predicción de cancelaciones de suscriptores Dish',
      soporte: 'Chatbot técnico para troubleshooting',
      upselling: 'Recomendación inteligente de upgrades',
      red: 'Optimización de infraestructura satelital'
    },
    general: {
      rh: 'Reclutamiento inteligente multiindustria',
      finanzas: 'Predicción de ingresos consolidados',
      riesgos: 'Análisis de riesgos operativos',
      fraude: 'Detección de anomalías financieras'
    }
  },

  // Métricas clave del negocio
  metricasClave: {
    radio: [
      'Rating por horario',
      'Share de audiencia',
      'Cumplimiento de pautas publicitarias (MonitorIA)',
      'Ingresos por publicidad',
      'Costo por mil (CPM)'
    ],
    television: [
      'Suscriptores activos Dish',
      'Tasa de churn',
      'ARPU (ingreso promedio por usuario)',
      'Uptime de servicios',
      'NPS de clientes'
    ],
    restaurantes: [
      'Ticket promedio',
      'Rotación de mesas',
      'Satisfacción del cliente',
      'Eficiencia operativa',
      'Ventas por ubicación'
    ],
    consolidado: [
      'EBITDA por división',
      'ROI de inversiones',
      'Crecimiento año contra año',
      'Participación de mercado',
      'Índice de innovación'
    ]
  },

  // Competidores principales por división
  competencia: {
    radio: ['Grupo Radio Centro', 'Grupo Imagen', 'Televisa Radio', 'Grupo ACIR'],
    television: ['Sky México', 'Izzi', 'Totalplay', 'Megacable'],
    restaurantes: ['Alsea', 'Grupo Anderson\'s', 'Operadores independientes'],
    medios_general: ['Televisa', 'TV Azteca', 'Grupo Imagen', 'Multimedios']
  }
};

// Función helper para obtener información de la empresa
export function getEmpresaInfo(campo) {
  return EMPRESA_CONFIG[campo] || null;
}

// Función para generar descripción contextual
export function getDescripcionContextual() {
  const { nombreCompleto, fundacion, fundador, operaciones } = EMPRESA_CONFIG;
  
  return `${nombreCompleto}, fundado en ${fundacion} por ${fundador}, es un conglomerado líder 
con ${operaciones.estacionesRadio}, televisión satelital (Dish México), 
${operaciones.restaurantes} en cadenas premium, y presencia en educación y publicidad.`;
}

// Función para obtener info de MonitorIA
export function getMonitorIAInfo() {
  return EMPRESA_CONFIG.monitorIA;
}

// Función para obtener servicios por división
export function getServiciosPorDivision(division) {
  const servicios = {
    radio: EMPRESA_CONFIG.serviciosPrioritarios.mediosRadio,
    tv: EMPRESA_CONFIG.serviciosPrioritarios.telecomunicaciones,
    restaurantes: EMPRESA_CONFIG.serviciosPrioritarios.restaurantes,
    ti: EMPRESA_CONFIG.serviciosPrioritarios.ti
  };
  
  return servicios[division] || [];
}

export default EMPRESA_CONFIG;
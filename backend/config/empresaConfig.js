// config/empresaConfig.js
// Configuración de la empresa cliente actual de la plataforma MAYIA

export const EMPRESA_CONFIG = {
  // Información básica
  nombre: 'MABE',
  nombreCompleto: 'MABE - Electrodomésticos',
  industria: 'Manufactura de Línea Blanca y Electrodomésticos',
  fundacion: 1946,
  pais: 'México',
  origenNombre: 'Mabardi + Berrondo = Ma-be',
  slogan: 'Cuando tu hogar funciona, todo funciona',
  slogansAnteriores: [
    'El corazón de tu hogar',
    'Más vida para tus alimentos (línea refrigeración)'
  ],

  // Descripción corporativa
  descripcion: 'Empresa mexicana emblemática líder en diseño, manufactura y comercialización de electrodomésticos y línea blanca en toda Latinoamérica. Exporta a más de 70 países.',

  // Datos operativos
  operaciones: {
    plantas: [
      'Celaya (Guanajuato)',
      'Salvatierra (Guanajuato)',
      'Saltillo (Coahuila)',
      'San Luis Potosí'
    ],
    mercados: '70+ países',
    empleados: '15,000+',
    lineasProducto: [
      'Refrigeradores',
      'Estufas',
      'Lavadoras',
      'Secadoras',
      'Lavavajillas',
      'Hornos',
      'Campanas'
    ],
    inicioActividad: 'Muebles de cocina (1946)',
    evolucion: 'De muebles a electrodomésticos de exportación global'
  },

  // Marcas del portafolio
  marcas: [
    'MABE',
    'GE Appliances',
    'GE Profile',
    'Monogram',
    'io mabe',
    'Easy',
    'IEM',
    'Centrales'
  ],

  // Alianzas estratégicas
  alianzas: [
    {
      empresa: 'Haier',
      participacion: '48%',
      desde: 2016,
      tipo: 'Alianza estratégica'
    }
  ],

  // Inversiones recientes
  inversiones: [
    {
      periodo: '2025-2027',
      monto: '$668 millones USD',
      destino: 'Infraestructura y desarrollo tecnológico en plantas',
      plantas: ['Celaya', 'Salvatierra', 'Saltillo', 'San Luis Potosí']
    }
  ],

  // Contactos corporativos
  contacto: {
    atencionCliente: '461 471 7000 / 461 471 7100',
    lineaPremium: '461 471 7200',
    sitioWeb: 'https://www.mabe.com.mx',
    tiendaEnLinea: 'https://www.tiendamabe.com.mx',
    servicioTecnico: 'Portal de servicio técnico y centros autorizados'
  },

  // Enfoque estratégico
  enfoqueEstrategico: [
    'Alta tecnología en electrodomésticos',
    'Sostenibilidad ambiental',
    'Innovación continua',
    'Exportación global (70+ países)',
    'Integración vertical (diseño + manufactura + comercialización)',
    'Expansión en Latinoamérica'
  ],

  // Servicios MAYIA prioritarios (según industria manufactura)
  serviciosPrioritarios: {
    operaciones: [
      'Mantenimiento Predictivo',
      'Control de Calidad con IA',
      'Gestión de Producción',
      'Análisis de Demanda',
      'Logística optimizada (exportación)'
    ],
    rh: [
      'Asesor en Seguridad en el Trabajo',
      'Reclutamiento Inteligente',
      'Evaluación de Desempeño',
      'Capacitación de personal técnico'
    ],
    ventas: [
      'Analytics predictivo',
      'Recomendador de Productos',
      'Agentes de Atención al Cliente',
      'CRM inteligente'
    ],
    ti: [
      'Ciberseguridad 24/7',
      'Infraestructura Cloud para plantas',
      'Protección de IP industrial',
      'Integración de sistemas'
    ],
    finanzas: [
      'Análisis Financiero',
      'Control de Presupuestos',
      'ROI de proyectos',
      'Consolidación financiera'
    ]
  },

  // Cursos recomendados (según perfil manufactura)
  cursosRecomendados: {
    ingenieria: [
      'Computer Vision (inspección de calidad)',
      'ML Fundamentos',
      'Series Temporales (pronósticos producción)',
      'Optimización de Procesos',
      'IoT para manufactura'
    ],
    gerencia: [
      'IA para Gerentes',
      'Gestión del Cambio',
      'Toma de Decisiones Estratégicas',
      'Innovación Empresarial'
    ],
    operaciones: [
      'Python para Análisis',
      'Análisis Estadístico',
      'SQL Avanzado',
      'Tableau Visualización'
    ],
    calidad: [
      'Computer Vision',
      'ML para Negocios',
      'Análisis Estadístico',
      'ISO 9001 con IA'
    ]
  },

  // Casos de uso específicos de IA para manufactura de línea blanca
  casosDeUsoIA: {
    produccion: 'Mantenimiento predictivo de líneas de ensamblaje (refrigeradores, estufas, lavadoras)',
    calidad: 'Inspección visual automatizada de acabados y ensamblajes',
    demanda: 'Pronóstico de ventas por producto y región (70 países)',
    logistica: 'Optimización de exportaciones y rutas internacionales',
    diseno: 'Simulación y pruebas virtuales de nuevos modelos',
    energia: 'Optimización de consumo energético en plantas',
    inventario: 'Control de componentes para múltiples líneas de producto',
    seguridad: 'Detección de riesgos en planta y cumplimiento normativo'
  },

  // Métricas clave del negocio
  metricasClave: [
    'OEE (Overall Equipment Effectiveness)',
    'Unidades producidas por línea',
    'Tasa de defectos por millón',
    'Tiempo de inactividad no programado',
    'Eficiencia energética',
    'Cumplimiento de órdenes de exportación',
    'Rotación de inventario de componentes',
    'Costo por unidad producida'
  ],

  // Tecnologías en productos
  tecnologiasProducto: [
    'Internet de las Cosas (IoT)',
    'Eficiencia energética',
    'Refrigeración inverter',
    'Control inteligente de temperatura',
    'Conectividad WiFi',
    'Electrodomésticos inteligentes'
  ]
};

// Función helper para obtener información de la empresa
export function getEmpresaInfo(campo) {
  return EMPRESA_CONFIG[campo] || null;
}

// Función para generar descripción contextual
export function getDescripcionContextual() {
  const { nombreCompleto, slogan, fundacion, operaciones, inversiones } = EMPRESA_CONFIG;
  
  return `${nombreCompleto} - "${slogan}". Empresa mexicana emblemática fundada en ${fundacion}, 
líder en electrodomésticos con ${operaciones.plantas.length} plantas en México. 
Inversión 2025-2027: ${inversiones[0].monto} en infraestructura y tecnología.`;
}

export default EMPRESA_CONFIG;
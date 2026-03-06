export const brandingConfig = {
  empresa: {
    nombre: "Grupo MVS",
    eslogan: "MVS",
    logo: "/assets/logosEmpresas/mvsLogo.png",
  },

  colores: {
    // Colores MVS Oficiales - TEMA CLARO
    primario: "#E62463",           // Rosa/Magenta MVS (principal)
    primarioOscuro: "#B81A4D",     // Rosa oscuro (hover, activo)
    primarioClaro: "#FDE8EF",      // Rosa muy claro (fondos sutiles)

    secundario: "#705091",         // Morado MVS
    secundarioOscuro: "#503870",   // Morado oscuro
    secundarioClaro: "#EDE8F5",    // Morado muy claro

    acento: "#F8CB0C",             // Amarillo MVS (highlights, badges, alertas)
    acentoOscuro: "#C9A200",       // Amarillo oscuro
    acentoClaro: "#FFFBE6",        // Amarillo muy claro

    complementario: "#EF7D58",     // Coral/Salmón MVS (apoyo, íconos, tags)
    complementarioOscuro: "#C95A34",// Coral oscuro
    complementarioClaro: "#FEF0EB",// Coral muy claro

    peligro: "#E62463",            // Usa el primario para errores/peligro
    advertencia: "#F8CB0C",        // Amarillo para advertencias
    exito: "#10B981",              // Verde neutro para éxito (no hay verde en paleta)

    // Fondos - CLAROS Y LIMPIOS
    fondoPrincipal: "#ffffff",     // Blanco puro
    fondoSecundario: "#FAF9FB",    // Gris con tinte morado muy sutil
    fondoTerciario: "#F3EFF7",     // Morado muy claro para secciones
    fondoClaro: "#FFFFFF",

    // Textos - ALTO CONTRASTE SOBRE FONDOS CLAROS
    textoClaro: "#1f1f68",         // Negro azulado (texto principal - WCAG AAA)
    textoMedio: "#4A3F5C",         // Morado gris oscuro (WCAG AAA)
    textoOscuro: "#8B7DA0",        // Morado claro (textos secundarios/placeholders)
    textoEnOscuro: "#FFFFFF",      // Blanco (para fondos oscuros/primario)

    // Bordes
    borde: "#DDD5E8",              // Morado gris suave
    bordeHover: "#E62463",         // Rosa al hacer hover

    // Gradientes
    gradientePrimario: "linear-gradient(135deg, #E62463 0%, #705091 100%)",
    gradienteSecundario: "linear-gradient(135deg, #705091 0%, #EF7D58 100%)",
    gradienteAcento: "linear-gradient(135deg, #F8CB0C 0%, #EF7D58 100%)",
    gradienteDark: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)",

    // Glass / efectos de superficie
    fondoGlass: "#F8F4FD",         // Morado muy suave

    // Sombras con tinte del brand
    sombra: "0 1px 3px rgba(112, 80, 145, 0.10), 0 1px 2px rgba(112, 80, 145, 0.06)",
    sombraMedia: "0 4px 6px rgba(112, 80, 145, 0.10), 0 2px 4px rgba(112, 80, 145, 0.06)",
    sombraGrande: "0 10px 15px rgba(230, 36, 99, 0.10), 0 4px 6px rgba(112, 80, 145, 0.07)",
  },

  metricas: {
    empleados: 568,
    departamentos: 9,
    tareasCompletadas: 13,
    progreso: 70,
  },

  ia: {
    nombre: "MAYIA",
    modelo: "Gemini 2.5 Flash",
    habilitado: true,
  }
};

export type BrandingConfig = typeof brandingConfig;
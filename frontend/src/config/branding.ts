export const brandingConfig = {
  empresa: {
    nombre: "Mabe",
    eslogan: "Mabe Es muy Bueno",
    logo: "/assets/logosEmpresas/mabeLogo.png",
  },
  
  colores: {
    // Colores MABE Oficiales - TEMA CLARO CON COLORES SÓLIDOS
    primario: "#008CAE",           // Azul turquesa MABE
    primarioOscuro: "#006B8A",     // Azul turquesa oscuro
    primarioClaro: "#B3E5F0",      // Azul claro SÓLIDO
    
    secundario: "#F5F7FA",         // Gris claro
    acento: "#F27405",             // Naranja MABE
    acentoOscuro: "#D66304",       // Naranja oscuro
    
    peligro: "#EF4444",            
    advertencia: "#F59E0B",        
    exito: "#10B981",              
    
    // Fondos - COLORES SÓLIDOS
    fondoPrincipal: "#FFFFFF",     // Blanco puro
    fondoSecundario: "#F8FAFB",    // Gris muy claro
    fondoTerciario: "#E8EDF2",     // Gris claro SÓLIDO
    fondoClaro: "#FFFFFF",         
    
    // Textos - ✅ CORREGIDOS PARA TEMA CLARO CON BUEN CONTRASTE
    textoClaro: "#1A202C",         // Negro/gris oscuro (texto principal - WCAG AAA)
    textoMedio: "#4A5568",         // Gris medio (WCAG AAA)
    textoOscuro: "#718096",        // Gris claro (textos secundarios)
    textoEnOscuro: "#FFFFFF",      // Blanco (para fondos oscuros)
    
    // Bordes - COLORES SÓLIDOS
    borde: "#CBD5E0",              // Gris claro SÓLIDO
    bordeHover: "#5CB8D1",         // Azul claro SÓLIDO
    
    // Gradientes
    gradientePrimario: "linear-gradient(135deg, #008CAE 0%, #3BA5C9 100%)",
    gradienteSecundario: "linear-gradient(135deg, #F27405 0%, #FF8C1A 100%)",
    gradienteAcento: "linear-gradient(135deg, #B3E5F0 0%, #FFFFFF 100%)",
    
    // Glass effects - COLOR SÓLIDO
    fondoGlass: "#E6F7FB",         // Azul muy claro SÓLIDO
    
    // Sombras
    sombra: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    sombraMedia: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)",
    sombraGrande: "0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)",
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
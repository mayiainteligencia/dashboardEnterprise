export const brandingConfig = {
  empresa: {
    nombre: "Suzuki",
    eslogan: "By your side",
    logo: "/assets/logosEmpresas/suzuki.png",
  },
  
  colores: {
    // Colores Suzuki Oficiales - Rojo #E20A17 | Azul #003399
    primario: "#003399",           // Azul Suzuki oficial
    primarioOscuro: "#002270",     // Azul Suzuki oscuro
    primarioClaro: "#D6E0F5",      // Azul muy claro (tint suave)
    
    secundario: "#F5F6FA",         // Gris muy frío (complementa el azul)
    acento: "#E20A17",             // Rojo Suzuki oficial
    acentoOscuro: "#B30813",       // Rojo oscuro

    peligro: "#EF4444",            
    advertencia: "#F59E0B",        
    exito: "#10B981",              
    
    // Fondos - limpios y neutros
    fondoPrincipal: "#FFFFFF",     // Blanco puro
    fondoSecundario: "#F7F8FC",    // Gris muy frío con toque azul
    fondoTerciario: "#EDF0F8",     // Azul hielo suave
    fondoClaro: "#FFFFFF",         
    
    // Textos
    textoClaro: "#1A202C",         // Negro/gris oscuro (texto principal - WCAG AAA)
    textoMedio: "#4A5568",         // Gris medio (WCAG AAA)
    textoOscuro: "#718096",        // Gris claro (textos secundarios)
    textoEnOscuro: "#FFFFFF",      // Blanco (para fondos oscuros)
    
    // Bordes
    borde: "#CBD5E0",              // Gris neutro
    bordeHover: "#6685CC",         // Azul Suzuki suavizado
    
    // Gradientes
    gradientePrimario: "linear-gradient(135deg, #003399 0%, #2952B3 100%)",
    gradienteSecundario: "linear-gradient(135deg, #E20A17 0%, #F04040 100%)",
    gradienteAcento: "linear-gradient(135deg, #D6E0F5 0%, #FFFFFF 100%)",
    
    // Glass effect
    fondoGlass: "#EAEFFa",         // Azul hielo muy suave
    
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
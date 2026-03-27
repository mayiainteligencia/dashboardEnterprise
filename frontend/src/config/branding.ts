export const brandingConfig = {
  empresa: {
    nombre: "Susurro",
    eslogan: "Gobierno de la Gente",
    logo: "/assets/logosEmpresas/guanajuato.png",
  },
  
  colores: {
    // TEMA OSCURO MINIMALISTA — inspirado en dashboard negro/blanco
    primario: "#FFFFFF",           // Blanco — elemento primario activo
    primarioOscuro: "#E2E8F0",     // Blanco apagado — hover/estados
    primarioClaro: "#2D3748",      // Gris oscuro — superficies activas claras

    secundario: "#1A1A1A",         // Negro profundo — fondo de tarjetas secundarias
    acento: "#FFFFFF",             // Blanco — acento de iconos y badges activos
    acentoOscuro: "#A0AEC0",       // Gris plateado — acento secundario

    peligro: "#EF4444",
    advertencia: "#F59E0B",
    exito: "#10B981",

    // Fondos
    fondoPrincipal: "#F0F0F0",     // Gris muy claro — fondo base (como la imagen)
    fondoSecundario: "#E8E8E8",    // Gris claro — áreas de contenido
    fondoTerciario: "#D4D4D4",     // Gris medio — separadores / hover
    fondoClaro: "#FFFFFF",         // Blanco puro — tarjetas blancas

    // Textos
    textoClaro: "#0A0A0A",         // Negro puro — título principal
    textoMedio: "#2D2D2D",         // Negro suave — cuerpo de texto
    textoOscuro: "#6B7280",        // Gris — texto secundario/metadatos
    textoEnOscuro: "#FFFFFF",      // Blanco — texto sobre fondos negros

    // Bordes
    borde: "#CCCCCC",              // Gris claro — bordes de tarjetas
    bordeHover: "#888888",         // Gris medio — hover de bordes

    // Gradientes — minimalistas, sin color
    gradientePrimario: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
    gradienteSecundario: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
    gradienteAcento: "linear-gradient(135deg, #E8E8E8 0%, #FFFFFF 100%)",

    // Glass / superficies con profundidad
    fondoGlass: "#1C1C1C",         // Negro carbón — tarjetas oscuras (como el panel Team)

    // Sombras
    sombra: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    sombraMedia: "0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06)",
    sombraGrande: "0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)",
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
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

export const RecursosHumanos: React.FC = () => {
  const { colores } = brandingConfig;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      titulo: 'Asesor en Recursos Humanos',
      descripcion: 'IA especializada en gestión de personal y políticas laborales',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/rh/rh1.png',
    },
    {
      id: 2,
      titulo: 'Asesor en Seguridad en el Trabajo',
      descripcion: 'Cumplimiento normativo y prevención de riesgos laborales',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/rh/rh2.png',
    },
    {
      id: 3,
      titulo: 'Empleados Digitales',
      descripcion: 'Agentes IA que piensan, actúan y evolucionan con tu empresa',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/rh/rh3.png',
    },
    {
      id: 4,
      titulo: 'Reclutamiento Inteligente',
      descripcion: 'Selección automatizada de talento con IA',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/rh/rh4.png',
    },
    {
      id: 5,
      titulo: 'Evaluación de Desempeño',
      descripcion: 'Análisis continuo y métricas de productividad',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/rh/rh5.png',
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: colores.textoClaro, marginBottom: '8px' }}>
          Recursos Humanos
        </h2>
        <p style={{ color: colores.textoMedio, fontSize: '16px' }}>
          Gestión inteligente de personal y capital humano
        </p>
      </div>

      {/* Grid de tarjetas verticales */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '16px',
              border: hoveredCard === card.id 
                ? `2px solid ${colores.primario}`
                : `1px solid ${colores.borde}`,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredCard === card.id ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === card.id 
                ? `0 16px 32px rgba(3, 140, 174, 0.25), 0 0 0 1px ${colores.primario}20`
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
              maxWidth: '240px',
            }}
          >
            {/* Área de media - VERTICAL */}
            <div style={{
              width: '100%',
              height: '280px',
              position: 'relative',
              backgroundColor: colores.fondoTerciario,
              overflow: 'hidden',
            }}>
              {card.mediaType === 'video' ? (
                <video 
                  autoPlay 
                  muted 
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === card.id ? 'scale(1.08)' : 'scale(1)',
                    filter: hoveredCard === card.id ? 'brightness(1.1)' : 'brightness(1)',
                  }}
                  onError={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div style="
                          display: flex; 
                          align-items: center; 
                          justify-content: center; 
                          height: 100%; 
                          color: ${colores.textoMedio};
                          background: linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}), 
                                      linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario});
                          background-size: 20px 20px;
                          background-position: 0 0, 10px 10px;
                        ">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                          </svg>
                        </div>
                      `;
                    }
                  }}
                >
                  <source src={card.mediaSrc} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={card.mediaSrc}
                  alt={card.titulo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease, filter 0.3s ease',
                    transform: hoveredCard === card.id ? 'scale(1.08)' : 'scale(1)',
                    filter: hoveredCard === card.id ? 'brightness(1.1)' : 'brightness(1)',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div style="
                          display: flex; 
                          align-items: center; 
                          justify-content: center; 
                          height: 100%; 
                          color: ${colores.textoMedio};
                          background: linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}), 
                                      linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario});
                          background-size: 20px 20px;
                          background-position: 0 0, 10px 10px;
                        ">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              )}

              {/* Overlay con descripción en hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(3, 140, 174, 0.95) 0%, rgba(3, 140, 174, 0.7) 40%, transparent 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '16px',
                opacity: hoveredCard === card.id ? 1 : 0,
                transition: 'opacity 0.3s ease',
                backdropFilter: 'blur(4px)',
              }}>
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '11px',
                  margin: 0,
                  lineHeight: '1.4',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {card.descripcion}
                </p>
              </div>
            </div>

            {/* Título abajo - COMPACTO */}
            <div style={{ 
              padding: '12px',
              backgroundColor: hoveredCard === card.id ? colores.fondoTerciario : 'transparent',
              transition: 'background-color 0.3s ease',
              minHeight: '55px',
            }}>
              <h4 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: hoveredCard === card.id ? colores.primario : colores.textoClaro,
                margin: 0,
                lineHeight: '1.3',
                transition: 'color 0.3s ease',
              }}>
                {card.titulo}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

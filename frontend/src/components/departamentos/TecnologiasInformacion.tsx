import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

export const TecnologiasInformacion: React.FC = () => {
  const { colores } = brandingConfig;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      titulo: 'Infraestructura',
      descripcion: 'Servidores, redes y cloud computing',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/tecInfo/infraestructura.png',
    },
    {
      id: 2,
      titulo: 'Soporte Técnico',
      descripcion: 'Mesa de ayuda y atención a usuarios',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/tecInfo/soporte.png',
    },
    {
      id: 3,
      titulo: 'Desarrollo',
      descripcion: 'Aplicaciones y sistemas internos',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/tecInfo/desarrollo.png',
    },
    {
      id: 4,
      titulo: 'Seguridad',
      descripcion: 'Ciberseguridad y protección de datos',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/tecInfo/seguridad.png',
    },
    {
      id: 5,
      titulo: 'Base de Datos',
      descripcion: 'Administración y backup de información',
      mediaType: 'image',
      mediaSrc: '../../../public/assets/tecInfo/basedatos.png',
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: colores.textoClaro, marginBottom: '8px' }}>
          Tecnologías de la Información
        </h2>
        <p style={{ color: colores.textoMedio, fontSize: '16px' }}>
          Infraestructura y soporte técnico
        </p>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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
              transform: hoveredCard === card.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === card.id 
                ? `0 20px 40px rgba(3, 140, 174, 0.3), 0 0 0 1px ${colores.primario}20`
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
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
                    transform: hoveredCard === card.id ? 'scale(1.1)' : 'scale(1)',
                    filter: hoveredCard === card.id ? 'brightness(1.1)' : 'brightness(1)',
                  }}
                  onError={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: ${colores.textoMedio}; background: linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}), linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}); background-size: 20px 20px; background-position: 0 0, 10px 10px;">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
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
                    transform: hoveredCard === card.id ? 'scale(1.1)' : 'scale(1)',
                    filter: hoveredCard === card.id ? 'brightness(1.1)' : 'brightness(1)',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: ${colores.textoMedio}; background: linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}), linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}); background-size: 20px 20px; background-position: 0 0, 10px 10px;">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                      `;
                    }
                  }}
                />
              )}

              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(3, 140, 174, 0.95) 0%, rgba(3, 140, 174, 0.7) 40%, transparent 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                opacity: hoveredCard === card.id ? 1 : 0,
                transition: 'opacity 0.3s ease',
                backdropFilter: 'blur(4px)',
              }}>
                <p style={{
                  color: '#FFFFFF',
                  fontSize: '13px',
                  margin: 0,
                  lineHeight: '1.5',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {card.descripcion}
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '14px',
              backgroundColor: hoveredCard === card.id ? colores.fondoTerciario : 'transparent',
              transition: 'background-color 0.3s ease',
            }}>
              <h4 style={{
                fontSize: '14px',
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

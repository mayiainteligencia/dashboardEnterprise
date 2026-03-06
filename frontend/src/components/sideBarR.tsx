import React, { useState } from 'react';
import { 
  Bot,
  UserSearch,
  BookOpen,
  X,
  Minimize2,
} from 'lucide-react';

import { brandingConfig } from '../config/branding';
import {ReclutamientoList} from './modules/ReclutamientoList';
import { CapacitacionStatus } from './modules/CapacitacionStatus';
import { AsistenteIAChat } from './modules/AsistenteIAChat';

interface SidebarRProps {
  onClose?: () => void;
}

interface Section {
  id: string;
  nombre: string;
  icono: React.ComponentType<{ size?: number }>;
}

const { colores } = brandingConfig;

const sections: Section[] = [
  { id: 'asistente-ia', nombre: 'Asistente IA', icono: Bot },
  { id: 'reclutamiento', nombre: 'Reclutamiento Selección', icono: UserSearch },
  { id: 'capacitacion', nombre: 'Capacitación', icono: BookOpen },
];

export const SidebarR: React.FC<SidebarRProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'asistente-ia':
        return <AsistenteIAChat />;
      case 'reclutamiento':
        return <ReclutamientoList />;
      case 'capacitacion':
        return <CapacitacionStatus />;
      default:
        return null;
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setActiveSection(null);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Sidebar derecho */}
      <div 
        style={{ 
          width: '80px',
          height: '100vh',
          backgroundColor: colores.fondoSecundario,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          gap: '16px',
          borderLeft: `1px solid ${colores.borde}`,
        }}
      >
        {sections.map((section) => {
          const Icon = section.icono;
          const isHovered = hoveredSection === section.id;
          
          return (
            <div
              key={section.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <button
                onClick={() => handleSectionClick(section.id)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: isHovered 
                    ? '0 8px 24px rgba(0,0,0,0.4)' 
                    : '0 4px 12px rgba(0,0,0,0.2)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon size={24} color={colores.fondoPrincipal} />
              </button>

              {/* Tooltip al hacer hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    right: '70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: colores.fondoPrincipal,
                    color: colores.textoClaro,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: `1px solid ${colores.borde}`,
                    zIndex: 1000,
                    pointerEvents: 'none',
                  }}
                >
                  {section.nombre}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderLeft: `6px solid ${colores.fondoPrincipal}`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel tipo chat flotante */}
      {activeSection && (
        <div
          style={{
            position: 'fixed',
            right: '100px',
            zIndex: 9999,
            width: isMinimized ? '350px' : '400px',
            bottom: '20px',
            top: isMinimized ? 'auto' : '20px',
            height: isMinimized ? '60px' : 'auto',
            maxHeight: isMinimized ? '60px' : 'calc(100vh - 40px)',
            backgroundColor: colores.fondoSecundario,
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${colores.borde}`,
            transition: 'all 0.3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header del chat */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
                borderBottom: `1px solid ${colores.borde}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {(() => {
                  const section = sections.find(s => s.id === activeSection);
                  if (!section) return null;
                  const Icon = section.icono;
                  return (
                    <>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color={colores.fondoPrincipal} />
                      </div>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#FFFFFF' 
                      }}>
                        {section.nombre}
                      </span>
                    </>
                  );
                })()}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleMinimize}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  <Minimize2 size={16} color="#FFFFFF" />
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  <X size={16} color="#FFFFFF" />
                </button>
              </div>
            </div>

            {/* Área de contenido del chat - SIEMPRE renderizado pero oculto */}
            <div
              style={{
                flex: 1,
                padding: '16px',
                overflow: 'auto',
                color: colores.textoEnOscuro,
                display: isMinimized ? 'none' : 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {renderSectionContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
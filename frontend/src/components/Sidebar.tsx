import React from 'react';
import { 
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Cpu,
  Building2,
  Shield,
  GraduationCap,
  Code2,
} from 'lucide-react';
import { brandingConfig } from '../config/branding';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', nombre: 'Dashboard General', icono: LayoutDashboard },
  { id: 'rh', nombre: 'Recursos Humanos', icono: Users },
  { id: 'finanzas', nombre: 'Finanzas y Contabilidad', icono: DollarSign },
  { id: 'operaciones', nombre: 'Operaciones', icono: Package },
  { id: 'ventas', nombre: 'Ventas y Marketing', icono: TrendingUp },
  { id: 'ti', nombre: 'Tecnologías de la Información', icono: Cpu },
  { id: 'administracion', nombre: 'Administración', icono: Building2 },
];

const extraSections = [
  { id: 'ciberseguridad', nombre: 'CiberSeguridad', icono: Shield },
  { id: 'playground', nombre: 'Playground', icono: Code2 },
  { id: 'academia', nombre: 'Academia', icono: GraduationCap },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { empresa, colores } = brandingConfig;

  return (
    <div 
      style={{ 
        width: '240px',
        height: '100vh',
        backgroundColor: colores.fondoSecundario,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 0%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <img 
              src="/assets/mabeLogoM.png" 
              alt={empresa.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '4px',
              }}
              onError={(e) => {
                // Fallback al SVG si la imagen no carga
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('width', '24');
                  svg.setAttribute('height', '24');
                  svg.setAttribute('viewBox', '0 0 24 24');
                  svg.setAttribute('fill', 'none');
                  
                  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  path.setAttribute('d', 'M7 7L17 17M7 17L17 7');
                  path.setAttribute('stroke', 'white');
                  path.setAttribute('stroke-width', '2.5');
                  path.setAttribute('stroke-linecap', 'round');
                  
                  svg.appendChild(path);
                  container.appendChild(svg);
                }
              }}
            />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: colores.textoClaro }}>
            {empresa.nombre}
          </span>
        </div>
      </div>

      {/* Label DEPARTAMENTOS */}
      <div style={{ padding: '0 16px 8px 16px' }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          color: colores.textoOscuro 
        }}>
          DEPARTAMENTOS
        </span>
      </div>

      {/* Menú Principal */}
      <nav style={{ flex: 1, padding: '0 12px', overflow: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icono;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '4px',
                backgroundColor: isActive ? colores.primario : 'transparent',
                color: isActive ? '#FFFFFF' : colores.textoMedio,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = colores.fondoTerciario;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colores.fondoTerciario,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
                {item.nombre}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer buttons - Secciones Extra */}
      <div style={{ padding: '12px', borderTop: `1px solid ${colores.borde}`, flexShrink: 0 }}>
        {extraSections.map((section) => {
          const Icon = section.icono;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                backgroundColor: isActive ? colores.primario : colores.fondoTerciario,
                color: isActive ? '#FFFFFF' : colores.textoMedio,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = colores.fondoPrincipal;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = colores.fondoTerciario;
                }
              }}
            >
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colores.fondoPrincipal,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', flex: 1, textAlign: 'left' }}>
                {section.nombre}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
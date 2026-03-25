import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, TrendingUp, Shield, Code2, GraduationCap, ChevronRight } from 'lucide-react';
import { brandingConfig } from '../config/branding';

/**
 * ResponsiveLayout — wrapper que hace toda la app responsive.
 * NO modifica Sidebar, Header, Dashboard, ni Analiticos.
 * Los envuelve y añade:
 *   - Menú hamburguesa en móvil/tablet
 *   - Sidebar como drawer lateral
 *   - Dashboard y Analíticos se muestran en scroll vertical en móvil
 */

interface ResponsiveLayoutProps {
  /** Sección activa que controla qué contenido se muestra */
  activeSection: string;
  onSectionChange: (section: string) => void;
  /** Slot para el Header original */
  header: React.ReactNode;
  /** Slot para el Sidebar original (solo se muestra en desktop) */
  sidebar: React.ReactNode;
  /** Slot para el SidebarR original (solo se muestra en desktop) */
  sidebarR?: React.ReactNode;
  /** Slot para el contenido principal */
  children: React.ReactNode;
}

const menuItems = [
  { id: 'dashboard',      nombre: 'Dashboard General', icono: LayoutDashboard },
  { id: 'analiticos',     nombre: 'Analíticos',         icono: TrendingUp      },
  { id: 'ciberseguridad', nombre: 'CiberSeguridad',     icono: Shield          },
  { id: 'playground',     nombre: 'Playground',         icono: Code2           },
  { id: 'academia',       nombre: 'Academia',            icono: GraduationCap   },
];

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  activeSection,
  onSectionChange,
  header,
  sidebar,
  sidebarR,
  children,
}) => {
  const { colores, empresa } = brandingConfig;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Cierra el drawer al cambiar sección
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setDrawerOpen(false);
  };

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const activeItem = menuItems.find(m => m.id === activeSection);

  /* ─────────────────────────── DESKTOP (≥1024px) ─────────────────────────── */
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: colores.fondoPrincipal }}>
        {/* Sidebar izquierdo original */}
        {sidebar}

        {/* Zona central: header + contenido */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {header}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </div>
        </div>

        {/* Sidebar derecho original */}
        {sidebarR}
      </div>
    );
  }

  /* ─────────────────────────── MOBILE / TABLET (<1024px) ─────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: colores.fondoPrincipal }}>

      {/* ── Top bar móvil ── */}
      <div style={{
        height: '60px',
        backgroundColor: colores.fondoSecundario,
        borderBottom: `1px solid ${colores.borde}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 500,
        flexShrink: 0,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: colores.fondoTerciario, border: `1px solid ${colores.borde}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Menu size={20} color={colores.textoClaro} />
        </button>

        {/* Logo / nombre empresa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/assets/logosEmpresas/guanajuato.png"
            alt={empresa.nombre}
            style={{ height: '32px', objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontSize: '15px', fontWeight: '700', color: colores.textoClaro }}>
            {empresa.nombre}
          </span>
        </div>

        {/* Sección activa pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '999px',
          background: `${colores.primario}20`, border: `1px solid ${colores.primario}40`,
        }}>
          {activeItem && <activeItem.icono size={13} color={colores.primario} />}
          <span style={{ fontSize: '12px', fontWeight: '700', color: colores.primario }}>
            {activeItem?.nombre ?? 'Dashboard'}
          </span>
        </div>
      </div>

      {/* ── Header original (versión compacta debajo del top bar) ── */}
      <div style={{
        overflow: 'hidden',
        maxHeight: '72px',  // misma altura que el header original
      }}>
        {/* Ocultamos el header en móvil para no duplicar logo/nav
            Si quieres mostrarlo descomenta la línea de abajo */}
        {/* {header} */}
      </div>

      {/* ── Contenido principal scrolleable ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Envuelve el contenido en un scaler para pantallas pequeñas */}
        <div style={{
          minWidth: 0,
          width: '100%',
          // En móvil el contenido puede tener columnas muy anchas,
          // permitimos scroll horizontal interno por sección
        }}>
          {children}
        </div>
      </div>

      {/* ── Bottom nav bar (acceso rápido) ── */}
      <nav style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: colores.fondoSecundario,
        borderTop: `1px solid ${colores.borde}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 4px',
        zIndex: 400,
        flexShrink: 0,
      }}>
        {menuItems.slice(0, 5).map(item => {
          const Icon = item.icono;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 10px', borderRadius: '12px',
                backgroundColor: isActive ? `${colores.primario}20` : 'transparent',
                transition: 'all 0.2s',
                minWidth: '52px',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: isActive ? colores.primario : colores.fondoTerciario,
                transition: 'all 0.2s',
              }}>
                <Icon size={16} color={isActive ? '#fff' : colores.textoMedio} />
              </div>
              <span style={{
                fontSize: '9px', fontWeight: isActive ? '700' : '500',
                color: isActive ? colores.primario : colores.textoOscuro,
                lineHeight: 1,
                textAlign: 'center',
                maxWidth: '52px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.nombre}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Drawer lateral (hamburger menu) ── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 900,
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(3px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'fixed', left: 0, top: 0, bottom: 0,
            width: '280px', zIndex: 1000,
            backgroundColor: colores.fondoSecundario,
            borderRight: `1px solid ${colores.borde}`,
            display: 'flex', flexDirection: 'column',
            animation: 'slideInLeft 0.25s ease',
            boxShadow: '8px 0 40px rgba(0,0,0,0.4)',
          }}>
            {/* Header del drawer */}
            <div style={{
              padding: '20px 20px 16px',
              borderBottom: `1px solid ${colores.borde}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img
                    src="/assets/logosEmpresas/guanajuato.png"
                    alt={empresa.nombre}
                    style={{ width: '100%', objectFit: 'contain', padding: '4px' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: colores.textoClaro }}>
                    {empresa.nombre}
                  </div>
                  <div style={{ fontSize: '11px', color: colores.textoMedio }}>Panel de Control</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: colores.fondoTerciario, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} color={colores.textoMedio} />
              </button>
            </div>

            {/* Label */}
            <div style={{ padding: '16px 20px 8px' }}>
              <span style={{
                fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: colores.textoOscuro,
              }}>
                Navegación
              </span>
            </div>

            {/* Items */}
            <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
              {menuItems.map(item => {
                const Icon = item.icono;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: '12px', padding: '12px 14px', borderRadius: '12px',
                      marginBottom: '4px', border: 'none', cursor: 'pointer',
                      backgroundColor: isActive ? colores.primario : 'transparent',
                      color: isActive ? '#fff' : colores.textoMedio,
                      transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colores.fondoTerciario,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={isActive ? '#fff' : colores.textoMedio} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: isActive ? '700' : '500', flex: 1 }}>
                      {item.nombre}
                    </span>
                    {isActive && <ChevronRight size={16} color="rgba(255,255,255,0.7)" />}
                  </button>
                );
              })}
            </nav>

            {/* Footer del drawer */}
            <div style={{
              padding: '16px 20px',
              borderTop: `1px solid ${colores.borde}`,
              fontSize: '11px', color: colores.textoOscuro, textAlign: 'center',
            }}>
              Hub Digital · {empresa.nombre}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
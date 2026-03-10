import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MoreVertical, MapPin } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface MapaCalorModuleProps {
  onNavigate?: (section: string) => void;
}

const estados = [
  { id: 'MEX', nombre: 'Estado de México', casos: 3840, pct: 100, trend: '+28%', rank: 1 },
  { id: 'VER', nombre: 'Veracruz', casos: 3120, pct: 81, trend: '+34%', rank: 2 },
  { id: 'CDMX', nombre: 'Ciudad de México', casos: 2890, pct: 75, trend: '+18%', rank: 3 },
  { id: 'JAL', nombre: 'Jalisco', casos: 2410, pct: 63, trend: '+22%', rank: 4 },
  { id: 'PUE', nombre: 'Puebla', casos: 2180, pct: 57, trend: '+19%', rank: 5 },
  { id: 'NL', nombre: 'Nuevo León', casos: 1890, pct: 49, trend: '+15%', rank: 6 },
  { id: 'GTO', nombre: 'Guanajuato', casos: 1540, pct: 40, trend: '+11%', rank: 7 },
  { id: 'OAX', nombre: 'Oaxaca', casos: 980, pct: 26, trend: '+9%', rank: 8 },
];

const filtros = ['Todos', 'Norte', 'Centro', 'Bajío', 'Occidente', 'Sur'];

const heatColor = (pct: number) => {
  if (pct >= 75) return '#EF4444';
  if (pct >= 50) return '#F59E0B';
  if (pct >= 25) return '#10B981';
  return '#0EA5E9';
};

export const MapaCalorModule: React.FC<MapaCalorModuleProps> = ({ onNavigate }) => {
  const { colores } = brandingConfig;
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <div style={{
      backgroundColor: colores.fondoSecundario,
      borderRadius: '24px',
      border: `1px solid ${colores.borde}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <MapPin size={18} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              Mapa de Calor Epidemiológico
            </h3>
            <p style={{ fontSize: '10px', color: colores.textoMedio, margin: 0 }}>
              Concentración de casos · México ·{' '}
              <span style={{ color: '#EC4899', fontWeight: 600 }}>20,611 casos totales</span>
            </p>
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio, padding: '4px' }}
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px',
              backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`,
              borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              minWidth: '200px', zIndex: 1000, overflow: 'hidden',
            }}>
              <button
                onClick={() => { onNavigate?.('analiticos'); setShowMenu(false); }}
                style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: colores.textoClaro, fontSize: '14px' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Ver mapa completo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {filtros.map(f => (
          <button
            key={f}
            onClick={() => setFiltroActivo(f)}
            style={{
              padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '10px', fontWeight: '600', transition: 'all 0.2s',
              backgroundColor: filtroActivo === f ? '#8B5CF6' : colores.fondoTerciario,
              color: filtroActivo === f ? '#fff' : colores.textoMedio,
            }}
          >{f}</button>
        ))}
      </div>

      {/* Layout horizontal: Mapa PNG izquierda | Top 5 + stats derecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

        {/* Columna izquierda: Mapa PNG */}
        <div style={{
          backgroundColor: colores.fondoTerciario,
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* Imagen PNG del mapa de México — sustituye con la ruta real de tu asset */}
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src="/assets/mapaMex.png"
              alt="Mapa de México dividido por estados"
              onClick={() => onNavigate?.('analiticos')}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'contain',
                cursor: 'pointer',
                borderRadius: '8px',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {/* Badge "Ver detalle" */}
            <div style={{
              position: 'absolute', bottom: '6px', right: '6px',
              backgroundColor: 'rgba(139,92,246,0.85)', borderRadius: '8px',
              padding: '3px 8px', fontSize: '9px', color: 'white', fontWeight: 600,
              backdropFilter: 'blur(4px)', cursor: 'pointer',
            }}
              onClick={() => onNavigate?.('analiticos')}
            >
              Ver detalle →
            </div>
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <span style={{ fontSize: '8px', color: colores.textoMedio }}>Bajo</span>
            {['#0EA5E9', '#10B981', '#F59E0B', '#EF4444'].map(c => (
              <div key={c} style={{ width: '24px', height: '6px', backgroundColor: c, borderRadius: '2px' }} />
            ))}
            <span style={{ fontSize: '8px', color: colores.textoMedio }}>Alto</span>
          </div>
        </div>

        {/* Columna derecha: Top 5 + contadores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Top 5 */}
          <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '12px', flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoClaro, margin: '0 0 8px 0' }}>Top 5 Estados</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {estados.slice(0, 5).map(({ rank, nombre, pct, trend }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: colores.textoMedio, width: '12px', flexShrink: 0 }}>{rank}</span>
                  <span style={{ fontSize: '10px', color: colores.textoClaro, flex: 1, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombre}</span>
                  <div style={{ width: '50px', height: '5px', borderRadius: '3px', backgroundColor: `${colores.borde}66`, overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', backgroundColor: heatColor(pct) }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: '700', width: '32px', textAlign: 'right', flexShrink: 0 }}>{trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contadores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { num: '9,600+', label: 'Sucursales', color: '#8B5CF6' },
              { num: '156', label: 'SKUs críticos', color: '#EF4444' },
            ].map(({ num, label, color }) => (
              <div key={label} style={{
                backgroundColor: colores.fondoTerciario, borderRadius: '12px',
                padding: '10px', textAlign: 'center', border: `1px solid ${color}22`,
              }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color, margin: 0 }}>{num}</p>
                <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '3px 0 0 0' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{
          width: '100%', padding: '11px 16px', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver Mapa Completo <ArrowRight size={15} />
      </button>
    </div>
  );
};
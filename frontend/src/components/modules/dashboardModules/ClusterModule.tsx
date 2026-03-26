import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MoreVertical } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface ClustersSegmentacionProps {
  onNavigate?: (section: string) => void;
}

const clusters = [
  { id: 1, nombre: 'Respiratoria Aguda', sub: 'Brote activo en 12 estados', casos: 8420, skus: 28, trend: '+28%', nivel: 'Crítico', color: '#EF4444', x: 72, y: 25, size: 38 },
  { id: 2, nombre: 'Pediátrica', sub: 'Alta correlación escolar', casos: 2980, skus: 18, trend: '+22%', nivel: 'Crítico', color: '#F97316', x: 30, y: 20, size: 28 },
  { id: 3, nombre: 'Viral Estacional', sub: 'Aumento anormal región norte', casos: 3870, skus: 22, trend: '+19%', nivel: 'Alto', color: '#F59E0B', x: 55, y: 60, size: 32 },
  { id: 4, nombre: 'Gastrointestinal', sub: 'Pico estacional detectado', casos: 5103, skus: 15, trend: '+14%', nivel: 'Alto', color: '#EAB308', x: 20, y: 55, size: 30 },
  { id: 5, nombre: 'Crónica Recurrente', sub: 'Estable, monitoreo preventivo', casos: 1580, skus: 32, trend: '+3%', nivel: 'Medio', color: '#10B981', x: 45, y: 80, size: 22 },
  { id: 6, nombre: 'Alérgica', sub: 'Tendencia descendente temporal', casos: 2241, skus: 12, trend: '-6%', nivel: 'Bajo', color: '#0EA5E9', x: 75, y: 72, size: 24 },
];

const nivelColor: Record<string, string> = { Crítico: '#EF4444', Alto: '#F59E0B', Medio: '#10B981', Bajo: '#0EA5E9' };
const filtros = ['Por Enfermedad', 'Por Región', 'Por Temporalidad', 'Por Perfil Paciente'];

const BubbleChart: React.FC<{ selected: number | null; onSelect: (id: number) => void }> = ({ selected, onSelect }) => (
  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '140px' }}>
    {[20, 40, 60, 80].map(v => (
      <React.Fragment key={v}>
        <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      </React.Fragment>
    ))}
    <text x="50" y="99" textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.3)">Intensidad demanda %</text>
    <text x="2" y="50" textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.3)" transform="rotate(-90 2 50)">Riesgo desabasto %</text>
    {clusters.map(c => {
      const isSelected = selected === c.id;
      return (
        <g key={c.id} onClick={() => onSelect(c.id)} style={{ cursor: 'pointer' }}>
          <circle cx={c.x} cy={c.y} r={c.size / 5}
            fill={`${c.color}${isSelected ? 'dd' : '66'}`}
            stroke={isSelected ? c.color : `${c.color}88`}
            strokeWidth={isSelected ? 1.2 : 0.5}
            style={{ transition: 'all 0.25s ease' }}
          />
          {isSelected && (
            <circle cx={c.x} cy={c.y} r={c.size / 5 + 2}
              fill="none" stroke={c.color} strokeWidth="0.5" opacity="0.4"
              style={{ animation: 'ping 1.5s ease-out infinite' }}
            />
          )}
          <text x={c.x} y={c.y + 1.2} textAnchor="middle" fontSize="2.4" fontWeight="700" fill="white" style={{ pointerEvents: 'none' }}>
            {c.nombre.split(' ')[0]}
          </text>
        </g>
      );
    })}
  </svg>
);

export const ClustersSegmentacion: React.FC<ClustersSegmentacionProps> = ({ onNavigate }) => {
  const { colores } = brandingConfig;
  const [filtroActivo, setFiltroActivo] = useState('Por Enfermedad');
  const [clusterSeleccionado, setClusterSeleccionado] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const clusterDetalle = clusterSeleccionado ? clusters.find(c => c.id === clusterSeleccionado) ?? null : null;

  return (
    <div style={{
      backgroundColor: colores.fondoSecundario, borderRadius: '24px',
      border: `1px solid ${colores.borde}`, padding: isMobile ? '16px' : '20px',
      display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '18px' }}>🔬</span>
          </div>
          <div>
            <h3 style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Clusters de Segmentación IA</h3>
            <p style={{ fontSize: '10px', color: colores.textoMedio, margin: 0 }}>Agrupación inteligente por patrones · <span style={{ color: '#06B6D4', fontWeight: 600 }}>6 clusters activos</span></p>
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio, padding: '4px' }}>
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', minWidth: '200px', zIndex: 1000, overflow: 'hidden' }}>
              <button onClick={() => { onNavigate?.('analiticos'); setShowMenu(false); }}
                style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: colores.textoClaro, fontSize: '14px' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >Ver análisis completo</button>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltroActivo(f)}
            style={{
              padding: '4px 9px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '9px', fontWeight: '600', transition: 'all 0.2s',
              backgroundColor: filtroActivo === f ? '#06B6D4' : colores.fondoTerciario,
              color: filtroActivo === f ? '#fff' : colores.textoMedio,
            }}
          >{f}</button>
        ))}
      </div>

      {/* En móvil: bubble chart + lista en columna. En desktop: igual que antes */}
      <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '12px', overflow: 'hidden' }}>
        <p style={{ fontSize: '10px', color: colores.textoMedio, margin: '0 0 8px 0' }}>Intensidad demanda vs Riesgo de desabasto · tamaño = volumen casos</p>
        <BubbleChart selected={clusterSeleccionado} onSelect={id => setClusterSeleccionado(prev => prev === id ? null : id)} />
        {!clusterSeleccionado && (
          <p style={{ fontSize: '9px', color: colores.textoMedio, textAlign: 'center', margin: '4px 0 0 0' }}>Haz clic en una burbuja para ver el detalle del cluster</p>
        )}
        {clusterDetalle && (
          <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: colores.fondoSecundario, borderRadius: '10px', border: `1px solid ${clusterDetalle.color}44` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: colores.textoClaro, margin: 0 }}>{clusterDetalle.nombre}</p>
                <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0 0' }}>{clusterDetalle.sub}</p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nivelColor[clusterDetalle.nivel], backgroundColor: `${nivelColor[clusterDetalle.nivel]}15`, padding: '3px 8px', borderRadius: '8px' }}>
                {clusterDetalle.nivel}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <span style={{ fontSize: '10px', color: colores.textoMedio }}><strong style={{ color: colores.textoClaro }}>{clusterDetalle.casos.toLocaleString()}</strong> casos</span>
              <span style={{ fontSize: '10px', color: colores.textoMedio }}><strong style={{ color: colores.textoClaro }}>{clusterDetalle.skus}</strong> SKUs</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: clusterDetalle.trend.startsWith('-') ? '#10B981' : '#EF4444' }}>{clusterDetalle.trend}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista clusters */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: '600', color: colores.textoMedio, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Segmentos ordenados por riesgo</p>
        {/* En móvil: 2 columnas para la lista, en desktop: 1 columna */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
          gap: '6px',
        }}>
          {clusters.map(c => (
            <button key={c.id} onClick={() => setClusterSeleccionado(prev => prev === c.id ? null : c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 11px',
                backgroundColor: clusterSeleccionado === c.id ? `${c.color}15` : colores.fondoTerciario,
                borderRadius: '10px',
                border: `1px solid ${clusterSeleccionado === c.id ? c.color + '44' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color, flexShrink: 0, boxShadow: `0 0 6px ${c.color}88` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: colores.textoClaro, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nombre}</p>
                {!isMobile && <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '1px 0 0 0' }}>{c.casos.toLocaleString()} casos · {c.skus} SKUs</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: c.trend.startsWith('-') ? '#10B981' : '#EF4444' }}>{c.trend}</span>
                <span style={{ fontSize: '8px', fontWeight: '700', color: nivelColor[c.nivel], backgroundColor: `${nivelColor[c.nivel]}15`, padding: '1px 5px', borderRadius: '5px' }}>{c.nivel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver Análisis Completo de Clusters <ArrowRight size={15} />
      </button>

      <style>{`@keyframes ping { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }`}</style>
    </div>
  );
};
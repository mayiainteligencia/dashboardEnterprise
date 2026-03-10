import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, MoreVertical, X } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface DashboardEjecutivoProps {
  onNavigate?: (section: string) => void;
}

// Mini sparkline inline
const Spark: React.FC<{ data: number[]; color: string; h?: number }> = ({ data, color, h = 28 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${h - ((v - min) / range) * (h - 4)}`).join(' ');
  const fill = `0,${h} ${pts} 100,${h}`;
  return (
    <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: `${h}px` }}>
      <polygon points={fill} fill={`${color}18`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Mini donut
const Donut: React.FC<{ pct: number; color: string; size?: number }> = ({ pct, color, size = 44 }) => {
  const r = 16, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
      <circle cx="20" cy="20" r={r} fill="none" stroke={`${color}22`} strokeWidth="5" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x="20" y="24" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
};

export const DashboardEjecutivo: React.FC<DashboardEjecutivoProps> = ({ onNavigate }) => {
  const { colores } = brandingConfig;
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const ventasSpark = [98, 112, 105, 119, 128, 121, 135, 129, 142, 138, 145, 148];
  const inventarioSpark = [88, 90, 86, 91, 93, 89, 92, 94, 91, 93, 92, 92.6];
  const demandaSpark = [80, 85, 88, 84, 90, 93, 96, 99, 103, 107, 110, 112.8];

  const kpisPrincipales = [
    { label: 'Ventas Nacionales', valor: '$148.3M', sub: '+8.4% vs mes anterior', color: '#10B981', up: true, spark: ventasSpark },
    { label: 'Inventario Disponible', valor: '92.6%', sub: '2.1% cobertura promedio', color: '#0EA5E9', up: true, spark: inventarioSpark },
    { label: 'Demanda Proyectada', valor: '+12.8%', sub: 'Próximos 30 días', color: '#8B5CF6', up: true, spark: demandaSpark },
  ];

  const riesgos = [
    { label: 'Riesgo Desabasto', valor: 7.4, color: '#F59E0B' },
    { label: 'SKUs Críticos', valor: 3.2, color: '#EF4444' },
  ];

  const contadores = [
    { emoji: '🏪', num: '1,842', label: 'Sucursales activas' },
    { emoji: '📦', num: '24,390', label: 'SKUs monitoreados' },
    { emoji: '🔔', num: '38', label: 'Alertas activas hoy' },
  ];

  return (
    <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '24px', border: `1px solid ${colores.borde}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px' }}>📊</span>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Dashboard Ejecutivo</h3>
              <p style={{ fontSize: '10px', color: colores.textoMedio, margin: 0 }}>Indicadores nacionales · <span style={{ color: '#10B981' }}>Actualizado 11:16 a.m.</span> · Nivel Corporativo</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#10B98115', border: '1px solid #10B98130', borderRadius: '20px', padding: '4px 10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700' }}>LIVE</span>
          </div>
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio, padding: '4px' }}>
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', minWidth: '200px', zIndex: 1000, overflow: 'hidden' }}>
                {[
                  { label: 'Ver Dashboard Ejecutivo', action: () => { onNavigate?.('analiticos'); setShowMenu(false); } },
                  { label: 'Más Información', action: () => { setShowInfo(true); setShowMenu(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: colores.textoClaro, fontSize: '14px', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >{item.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs principales — 3 columnas con sparkline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {kpisPrincipales.map(({ label, valor, sub, color, up, spark }) => (
          <div key={label} style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '12px', border: `1px solid ${color}22`, overflow: 'hidden' }}>
            <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color, margin: '0 0 2px 0', lineHeight: 1 }}>{valor}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              {up ? <TrendingUp size={10} color="#10B981" /> : <TrendingDown size={10} color="#EF4444" />}
              <p style={{ fontSize: '9px', color: colores.textoMedio, margin: 0 }}>{sub}</p>
            </div>
            <Spark data={spark} color={color} h={24} />
          </div>
        ))}
      </div>

      {/* Fila: Riesgo (donuts) + Contadores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

        {/* Donuts de riesgo */}
        <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: colores.textoMedio, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Indicadores de Riesgo</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {riesgos.map(({ label, valor, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Donut pct={valor} color={color} size={44} />
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0 0' }}>
                    {valor < 5 ? 'Nivel controlado' : 'Requiere atención'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contadores operativos */}
        <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: colores.textoMedio, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Operaciones</p>
          {contadores.map(({ emoji, num, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: colores.fondoSecundario, borderRadius: '10px' }}>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: colores.textoClaro, margin: 0, lineHeight: 1 }}>{num}</p>
                <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0 0' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver Dashboard Ejecutivo Completo <ArrowRight size={15} />
      </button>

      {/* Modal Info */}
      {showInfo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setShowInfo(false)}>
          <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Dashboard Ejecutivo</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}><X size={22} /></button>
            </div>
            <p style={{ fontSize: '13px', color: colores.textoMedio, lineHeight: 1.6, marginBottom: '16px' }}>
              Vista consolidada de indicadores nacionales en tiempo real para toma de decisiones a nivel corporativo.
            </p>
            <button onClick={() => setShowInfo(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Entendido</button>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};
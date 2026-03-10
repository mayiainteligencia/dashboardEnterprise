import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, Zap, Clock, CheckCircle, TrendingUp, Users, Target, MoreVertical } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

// ─── Types & Data ─────────────────────────────────────────────────────────────

type CampaignStatus = 'activa' | 'programada' | 'completada';

interface Campaign {
  id: number;
  nombre: string;
  modelo: string;
  estado: CampaignStatus;
  presupuesto: number;
  gastado: number;
  alcance: number;
  conversiones: number;
  roi: number;
  color: string;
  canales: string[];
  fechaFin: string;
}

const campañas: Campaign[] = [
  { id: 1, nombre: 'Hayabusa Legend',     modelo: 'Hayabusa',       estado: 'activa',     presupuesto: 280000, gastado: 187400, alcance: 1240000, conversiones: 342, roi: 3.8, color: '#C0392B', canales: ['Meta', 'YouTube', 'Display'], fechaFin: '15 Abr' },
  { id: 2, nombre: 'GSX-R King of Track', modelo: 'GSX-R1000R',     estado: 'activa',     presupuesto: 320000, gastado: 210000, alcance: 980000,  conversiones: 289, roi: 4.2, color: '#003399', canales: ['Google', 'YouTube', 'TikTok'], fechaFin: '22 Abr' },
  { id: 3, nombre: 'V-Strom Adventure',   modelo: 'V-Strom 1050XT', estado: 'programada', presupuesto: 190000, gastado: 0,      alcance: 0,       conversiones: 0,   roi: 0,   color: '#1D6A40', canales: ['Meta', 'Google', 'Outdoor'],  fechaFin: '01 May' },
  { id: 4, nombre: 'SV650 Urban Rider',   modelo: 'SV650',          estado: 'completada', presupuesto: 150000, gastado: 148200, alcance: 2100000, conversiones: 614, roi: 5.1, color: '#6B7280', canales: ['Meta', 'TikTok'],             fechaFin: '28 Feb' },
];

const weeklyData = [42, 68, 55, 91, 73, 88, 64, 110, 95, 128, 104, 142];

const statusCfg: Record<CampaignStatus, { label: string; color: string; bg: string; Icon: React.FC<{ size: number }> }> = {
  activa:     { label: 'Activa',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  Icon: ({ size }) => <Zap size={size} /> },
  programada: { label: 'Programada', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', Icon: ({ size }) => <Clock size={size} /> },
  completada: { label: 'Completada', color: '#6B7280', bg: 'rgba(107,114,128,0.12)',Icon: ({ size }) => <CheckCircle size={size} /> },
};

const fmt  = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;
const fmtP = (n: number) => n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`;

// ─── Animated counter ─────────────────────────────────────────────────────────
const AnimCounter: React.FC<{ to: number; format: (n: number) => string; color: string }> = ({ to, format, color }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now(), dur = 1000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <span style={{ fontSize: '20px', fontWeight: '700', color, letterSpacing: '-0.5px', lineHeight: 1 }}>{format(v)}</span>;
};

// ─── Spark bars ───────────────────────────────────────────────────────────────
const SparkBars: React.FC<{ data: number[]; color: string; animated: boolean }> = ({ data, color, animated }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '28px', width: '100%' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: animated ? `${(v / max) * 100}%` : '4px',
          borderRadius: '2px 2px 0 0',
          background: i === data.length - 1 ? color : `${color}55`,
          transition: `height 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 28}ms`,
        }} />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const CampañasInteligentes: React.FC = () => {
  const { colores } = brandingConfig;
  const [mounted, setMounted]     = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showMenu, setShowMenu]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showMenu]);

  const activas      = campañas.filter(c => c.estado === 'activa');
  const totalAlcance = activas.reduce((s, c) => s + c.alcance, 0);
  const totalConv    = campañas.filter(c => c.roi > 0).reduce((s, c) => s + c.conversiones, 0);
  const avgRoi       = campañas.filter(c => c.roi > 0).reduce((s, c) => s + c.roi, 0) / campañas.filter(c => c.roi > 0).length;

  return (
    <div style={{
      backgroundColor: colores.fondoSecundario,
      borderRadius: '24px',
      border: `1px solid ${colores.borde}`,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* Ambient orb — sutil, como en HeroCard */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: `radial-gradient(circle, ${colores.primario}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* ── Header — igual que SucursalInteligenteModule ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Megaphone size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              Campañas Inteligentes
            </h3>
            <p style={{ fontSize: '11px', color: colores.textoMedio, margin: 0 }}>
              {activas.length} activas · {campañas.length} totales
            </p>
          </div>
        </div>

        {/* Live dot + menú */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ position: 'relative', width: '8px', height: '8px' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#10B981', animation: 'cPing 1.8s ease-out infinite',
              }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>Live</span>
          </div>

          <div style={{ position: 'relative' }} ref={menuRef}>
            <button onClick={() => setShowMenu(s => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio, display: 'flex' }}>
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`,
                borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                minWidth: '180px', zIndex: 1000, overflow: 'hidden',
              }}>
                {['Ver reporte completo', 'Exportar datos', 'Nueva campaña'].map((opt, i) => (
                  <button key={i} style={{
                    width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                    textAlign: 'left', cursor: 'pointer', color: colores.textoClaro, fontSize: '14px', transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = colores.fondoTerciario}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
        {[
          { label: 'Alcance total', to: totalAlcance, format: fmt, color: colores.primario, Icon: Users },
          { label: 'Conversiones',  to: totalConv,    format: fmt, color: '#10B981',        Icon: Target },
          { label: 'ROI promedio',  to: Math.round(avgRoi * 10), format: (n: number) => `×${(n / 10).toFixed(1)}`, color: colores.acento, Icon: TrendingUp },
        ].map((k, i) => (
          <div key={i} style={{
            backgroundColor: colores.fondoTerciario,
            borderRadius: '10px', padding: '8px 6px', textAlign: 'center',
            border: `1px solid ${colores.borde}`,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
          }}>
            <k.Icon size={12} color={k.color} />
            <div style={{ marginTop: '2px' }}>
              {mounted
                ? <AnimCounter to={k.to} format={k.format} color={k.color} />
                : <span style={{ fontSize: '20px', fontWeight: '700', color: k.color }}>—</span>}
            </div>
            <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {k.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Sparkline ── */}
      <div style={{
        backgroundColor: colores.fondoTerciario, borderRadius: '10px',
        padding: '8px 12px', border: `1px solid ${colores.borde}`, marginBottom: '10px',
        opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 0.25s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>Conversiones · 12 semanas</p>
          <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700' }}>↑ +23%</span>
        </div>
        <SparkBars data={weeklyData} color={colores.primario} animated={mounted} />
      </div>

      {/* ── Campaign list — hover translateX como en AlertasEmpresa ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
        {campañas.map((c, idx) => {
          const { label, color, bg, Icon } = statusCfg[c.estado];
          const pct    = c.presupuesto > 0 ? (c.gastado / c.presupuesto) * 100 : 0;
          const isOpen = selectedId === c.id;

          return (
            <div key={c.id} style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s ease ${0.3 + idx * 0.07}s, transform 0.4s ease ${0.3 + idx * 0.07}s`,
            }}>
              <div
                onClick={() => setSelectedId(isOpen ? null : c.id)}
                style={{
                  background: isOpen
                    ? `linear-gradient(135deg, ${c.color}15 0%, ${c.color}05 100%)`
                    : `linear-gradient(135deg, ${c.color}10 0%, ${c.color}02 100%)`,
                  borderLeft: `4px solid ${c.color}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${c.color}30`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro, margin: '0 0 1px' }}>{c.nombre}</p>
                    <p style={{ fontSize: '10px', color: colores.textoMedio, margin: 0 }}>{c.modelo} · Cierre {c.fechaFin}</p>
                  </div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    padding: '2px 6px', borderRadius: '7px',
                    fontSize: '9px', fontWeight: '700', color, background: bg,
                  }}>
                    <Icon size={8} /> {label}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '3px', borderRadius: '2px', background: `${colores.fondoTerciario}`, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    width: mounted ? `${Math.min(pct, 100)}%` : '0%',
                    background: `linear-gradient(90deg, ${c.color}, ${c.color}bb)`,
                    transition: 'width 1s ease 0.5s',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                  <span style={{ fontSize: '9px', color: colores.textoOscuro }}>{fmtP(c.gastado)} gastado</span>
                  <span style={{ fontSize: '9px', color: colores.textoOscuro }}>{fmtP(c.presupuesto)} total</span>
                </div>
              </div>

              {/* Expandable detail */}
              <div style={{
                maxHeight: isOpen ? '80px' : '0', overflow: 'hidden',
                transition: 'max-height 0.32s cubic-bezier(0.4,0,0.2,1)',
              }}>
                <div style={{
                  padding: '10px 14px', margin: '6px 0 0',
                  background: `${c.color}08`, borderRadius: '10px', border: `1px solid ${c.color}22`,
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px',
                }}>
                  {[
                    { label: 'Alcance',       value: fmt(c.alcance) },
                    { label: 'Conversiones',  value: fmt(c.conversiones) },
                    { label: 'ROI',           value: c.roi > 0 ? `×${c.roi}` : '—' },
                    { label: 'Canales',       value: `${c.canales.length}` },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '14px', fontWeight: '800', color: c.color, margin: 0 }}>{m.value}</p>
                      <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer CTA — igual que todos los demás módulos ── */}
      <button style={{
        width: '100%', marginTop: '10px', padding: '10px',
        borderRadius: '10px', border: `1px solid ${colores.borde}`,
        background: 'transparent', color: colores.primario,
        fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${colores.primario}10`; (e.currentTarget as HTMLElement).style.borderColor = colores.primario; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = colores.borde; }}
      >
        Ver todas las campañas
      </button>

      <style>{`
        @keyframes cPing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { BarChart2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface ModeloDemanda {
  id: number;
  nombre: string;
  color: string;
  demandaActual: number;
  demandaPredicha: number;
  stockActual: number;
  tendencia: number;
  confianza: number;
  historial: number[];
  alerta: boolean;
}

const modelos: ModeloDemanda[] = [
  { id: 1, nombre: 'GSX-R1000R',     color: '#003399', demandaActual: 87,  demandaPredicha: 112, stockActual: 34,  tendencia: 28.7, confianza: 94, historial: [54,61,58,72,68,81,87,112], alerta: true  },
  { id: 2, nombre: 'Hayabusa',       color: '#C0392B', demandaActual: 63,  demandaPredicha: 58,  stockActual: 41,  tendencia: -7.9, confianza: 89, historial: [70,75,68,71,65,67,63,58],  alerta: false },
  { id: 3, nombre: 'V-Strom 1050XT', color: '#1D6A40', demandaActual: 142, demandaPredicha: 189, stockActual: 28,  tendencia: 33.1, confianza: 91, historial: [88,95,104,118,127,135,142,189], alerta: true },
  { id: 4, nombre: 'SV650',          color: '#6B7280', demandaActual: 210, demandaPredicha: 198, stockActual: 157, tendencia: -5.7, confianza: 96, historial: [195,203,218,225,211,208,210,198], alerta: false },
];

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
const Spark: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const W = 48; const H = 20; // Reducido para ahorrar espacio
  const min = Math.min(...data); const max = Math.max(...data); const r = max - min || 1;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - 2 - ((v - min) / r) * (H - 4)).toFixed(1)}`);
  const [lx, ly] = pts[pts.length - 1].split(',');
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(' ')} ${W},${H}`} fill={`url(#sg${color.replace('#','')})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2" fill={color} />
    </svg>
  );
};

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter: React.FC<{ to: number; color: string; size?: number; suffix?: string }> = ({ to, color, size = 16, suffix = '' }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const s = performance.now(), dur = 800;
    const tick = (now: number) => {
      const p = Math.min((now - s) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <span style={{ fontSize: size, fontWeight: '700', color, letterSpacing: '-0.3px', lineHeight: 1 }}>{v}{suffix}</span>;
};

// ─── Donut ring (más compacto) ───────────────────────────────────────────────
const Donut: React.FC<{ value: number; color: string; animated: boolean; size?: number }> = ({ value, color, animated, size = 40 }) => {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${animated ? (value / 100) * c : 0} ${c}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '9px', fontWeight: '700', color }}>{value}%</span>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AnalisisDemanda: React.FC = () => {
  const { colores } = brandingConfig;
  const [mounted, setMounted]       = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const alertas      = modelos.filter(m => m.alerta).length;
  const totalDemanda = modelos.reduce((s, m) => s + m.demandaPredicha, 0);
  const avgConfianza = Math.round(modelos.reduce((s, m) => s + m.confianza, 0) / modelos.length);

  return (
    <div style={{
      backgroundColor: colores.fondoSecundario,
      borderRadius: '24px',
      border: `1px solid ${colores.borde}`,
      padding: '12px 14px', // Padding más compacto
      display: 'flex', 
      flexDirection: 'column',
      height: '100%', 
      width: '100%',
      position: 'relative', 
      overflow: 'hidden',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* Ambient orb - más sutil */}
      <div style={{
        position: 'absolute', bottom: '-40px', left: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: `radial-gradient(circle, ${colores.acento}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: `linear-gradient(135deg, ${colores.acento} 0%, ${colores.acentoOscuro} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={16} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              Análisis Predictivo
            </h3>
            <p style={{ fontSize: '9px', color: colores.textoMedio, margin: 0 }}>
              IA activa · 2 min
            </p>
          </div>
        </div>

        {/* Alert badge */}
        {alertas > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            padding: '2px 6px', borderRadius: '6px',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
          }}>
            <AlertTriangle size={8} color="#F59E0B" />
            <span style={{ fontSize: '9px', fontWeight: '700', color: '#D97706' }}>{alertas}</span>
          </div>
        )}
      </div>

      {/* ── KPI row compacto ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        {/* Donut IA */}
        <div style={{
          backgroundColor: colores.fondoTerciario, borderRadius: '8px', padding: '6px',
          border: `1px solid ${colores.borde}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease',
          minWidth: '60px',
        }}>
          <Donut value={avgConfianza} color={colores.acento} animated={mounted} size={36} />
          <p style={{ fontSize: '7px', color: colores.textoMedio, margin: 0, textTransform: 'uppercase', letterSpacing: '0.2px' }}>Precisión</p>
        </div>

        {/* Right grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          {[
            { label: 'Demanda', to: totalDemanda, suffix: '', color: colores.primario },
            { label: 'Alertas', to: alertas, suffix: '',     color: '#F59E0B' },
          ].map((k, i) => (
            <div key={i} style={{
              backgroundColor: colores.fondoTerciario, borderRadius: '8px', padding: '4px',
              border: `1px solid ${colores.borde}`, textAlign: 'center',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(4px)',
              transition: `all 0.4s ease ${0.1 + i * 0.1}s`,
            }}>
              {mounted && <Counter to={k.to} color={k.color} size={13} suffix={k.suffix} />}
              <p style={{ fontSize: '7px', color: colores.textoMedio, margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.2px' }}>{k.label}</p>
            </div>
          ))}
          <div style={{
            gridColumn: '1/-1',
            backgroundColor: colores.fondoTerciario, borderRadius: '8px', padding: '4px 6px',
            border: `1px solid ${colores.borde}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 0.3s',
          }}>
            <p style={{ fontSize: '8px', color: colores.textoMedio, margin: 0 }}>Crecimiento</p>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#10B981' }}>+40.3%</span>
          </div>
        </div>
      </div>

      {/* ── Model list compacto con scroll controlado ── */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px', 
        overflowY: 'auto',
        minHeight: 0,
        paddingRight: '2px',
        marginBottom: '6px'
      }}>
        {modelos.map((m, idx) => {
          const isOpen  = selectedId === m.id;
          const TIcon   = m.tendencia > 0 ? TrendingUp : TrendingDown;
          const tColor  = m.tendencia > 0 ? '#10B981' : colores.acento;

          return (
            <div key={m.id} style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(4px)',
              transition: `all 0.3s ease ${0.15 + idx * 0.05}s`,
            }}>
              <div
                onClick={() => setSelectedId(isOpen ? null : m.id)}
                style={{
                  background: `linear-gradient(135deg, ${m.color}08 0%, ${m.color}02 100%)`,
                  borderLeft: `3px solid ${m.color}`,
                  borderRadius: '8px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(2px)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${m.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: colores.textoClaro, margin: 0 }}>{m.nombre}</p>
                    {m.alerta && <AlertTriangle size={6} color="#F59E0B" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: m.color }}>{m.demandaPredicha}</span>
                    <span style={{ fontSize: '7px', color: colores.textoMedio }}>pred</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                      <TIcon size={7} color={tColor} />
                      <span style={{ fontSize: '7px', color: tColor, fontWeight: '600' }}>{Math.abs(m.tendencia)}%</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline */}
                <Spark data={m.historial} color={m.color} />
              </div>

              {/* Detail expandible */}
              <div style={{ 
                maxHeight: isOpen ? '50px' : '0', 
                overflow: 'hidden', 
                transition: 'max-height 0.25s cubic-bezier(0.4,0,0.2,1)' 
              }}>
                <div style={{
                  padding: '5px 8px', margin: '2px 0 0',
                  background: `${m.color}05`, borderRadius: '6px', border: `1px solid ${m.color}15`,
                  display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px',
                }}>
                  {[
                    { label: 'Stock',  value: `${m.stockActual}` },
                    { label: 'Conf', value: `${m.confianza}%` },
                    { label: 'Actual',value: `${m.demandaActual}` },
                  ].map((x, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: m.color, margin: 0 }}>{x.value}</p>
                      <p style={{ fontSize: '6px', color: colores.textoMedio, margin: '0', textTransform: 'uppercase', letterSpacing: '0.2px' }}>{x.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer CTA compacto ── */}
      <button style={{
        width: '100%', 
        marginTop: '2px', 
        padding: '6px',
        borderRadius: '8px', 
        border: `1px solid ${colores.borde}`,
        background: 'transparent', 
        color: colores.acento,
        fontSize: '10px', 
        fontWeight: '600', 
        cursor: 'pointer', 
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = `${colores.acento}08`; e.currentTarget.style.borderColor = colores.acento; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colores.borde; }}
      >
        Ver reporte
      </button>
    </div>
  );
};
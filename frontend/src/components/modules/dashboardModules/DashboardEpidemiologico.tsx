import React, { useState } from 'react';
import {
  AlertTriangle, TrendingUp, TrendingDown, MapPin, Activity,
  ArrowUpRight, ChevronRight, Thermometer, Wind, Droplets,
  Pill, Calendar, History,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, LineChart, Line, Legend,
} from 'recharts';

type Periodo = '7d' | '30d' | '90d';
type NivelRiesgo = 'critico' | 'alto' | 'medio' | 'bajo';

interface EstadoData {
  nombre: string; abrev: string; casos: number; casosHistorico: number;
  tendencia: number; nivel: NivelRiesgo; enfermedadPrincipal: string;
}
interface EnfermedadData {
  nombre: string; casos: number; casosHistorico: number; cambio: number;
  icono: React.ReactNode; color: string;
}

const estadosPorPeriodo: Record<Periodo, EstadoData[]> = {
  '7d': [
    { nombre: 'Veracruz',         abrev: 'VER', casos: 1842, casosHistorico: 1375, tendencia: +34, nivel: 'critico', enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Estado de México', abrev: 'MEX', casos: 1560, casosHistorico: 1280, tendencia: +22, nivel: 'critico', enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Jalisco',          abrev: 'JAL', casos: 1203, casosHistorico: 1019, tendencia: +18, nivel: 'alto',    enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'CDMX',             abrev: 'CMX', casos:  987, casosHistorico:  889, tendencia: +11, nivel: 'alto',    enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Puebla',           abrev: 'PUE', casos:  743, casosHistorico:  694, tendencia:  +7, nivel: 'medio',   enfermedadPrincipal: 'Alérgica' },
    { nombre: 'Nuevo León',       abrev: 'NLE', casos:  612, casosHistorico:  588, tendencia:  +4, nivel: 'medio',   enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'Oaxaca',           abrev: 'OAX', casos:  389, casosHistorico:  401, tendencia:  -3, nivel: 'bajo',    enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Yucatán',          abrev: 'YUC', casos:  214, casosHistorico:  233, tendencia:  -8, nivel: 'bajo',    enfermedadPrincipal: 'Alérgica' },
  ],
  '30d': [
    { nombre: 'Veracruz',         abrev: 'VER', casos: 7240,  casosHistorico: 5480,  tendencia: +32, nivel: 'critico', enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Estado de México', abrev: 'MEX', casos: 6120,  casosHistorico: 4980,  tendencia: +23, nivel: 'critico', enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Jalisco',          abrev: 'JAL', casos: 4830,  casosHistorico: 4120,  tendencia: +17, nivel: 'alto',    enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'CDMX',             abrev: 'CMX', casos: 3940,  casosHistorico: 3680,  tendencia:  +7, nivel: 'alto',    enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Puebla',           abrev: 'PUE', casos: 2970,  casosHistorico: 2780,  tendencia:  +7, nivel: 'medio',   enfermedadPrincipal: 'Alérgica' },
    { nombre: 'Nuevo León',       abrev: 'NLE', casos: 2450,  casosHistorico: 2340,  tendencia:  +5, nivel: 'medio',   enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'Oaxaca',           abrev: 'OAX', casos: 1560,  casosHistorico: 1640,  tendencia:  -5, nivel: 'bajo',    enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Yucatán',          abrev: 'YUC', casos:  856,  casosHistorico:  932,  tendencia:  -8, nivel: 'bajo',    enfermedadPrincipal: 'Alérgica' },
  ],
  '90d': [
    { nombre: 'Veracruz',         abrev: 'VER', casos: 21340, casosHistorico: 15600, tendencia: +37, nivel: 'critico', enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Estado de México', abrev: 'MEX', casos: 18720, casosHistorico: 14890, tendencia: +26, nivel: 'critico', enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Jalisco',          abrev: 'JAL', casos: 14560, casosHistorico: 12430, tendencia: +17, nivel: 'alto',    enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'CDMX',             abrev: 'CMX', casos: 11830, casosHistorico: 10980, tendencia:  +8, nivel: 'alto',    enfermedadPrincipal: 'Respiratoria' },
    { nombre: 'Puebla',           abrev: 'PUE', casos:  8910, casosHistorico:  8340, tendencia:  +7, nivel: 'medio',   enfermedadPrincipal: 'Alérgica' },
    { nombre: 'Nuevo León',       abrev: 'NLE', casos:  7350, casosHistorico:  7020, tendencia:  +5, nivel: 'medio',   enfermedadPrincipal: 'Viral estacional' },
    { nombre: 'Oaxaca',           abrev: 'OAX', casos:  4680, casosHistorico:  4920, tendencia:  -5, nivel: 'bajo',    enfermedadPrincipal: 'Gastrointestinal' },
    { nombre: 'Yucatán',          abrev: 'YUC', casos:  2570, casosHistorico:  2796, tendencia:  -8, nivel: 'bajo',    enfermedadPrincipal: 'Alérgica' },
  ],
};

const enfermedadesPorPeriodo: Record<Periodo, EnfermedadData[]> = {
  '7d': [
    { nombre: 'Respiratoria',     casos: 8420,   casosHistorico: 6578,  cambio: +28, icono: <Wind size={16} />,        color: '#EF4444' },
    { nombre: 'Gastrointestinal', casos: 5103,   casosHistorico: 4476,  cambio: +14, icono: <Droplets size={16} />,    color: '#F59E0B' },
    { nombre: 'Viral estacional', casos: 3870,   casosHistorico: 3252,  cambio: +19, icono: <Thermometer size={16} />, color: '#8B5CF6' },
    { nombre: 'Alérgica',         casos: 2241,   casosHistorico: 2384,  cambio:  -6, icono: <Activity size={16} />,    color: '#10B981' },
    { nombre: 'Crónica',          casos: 1580,   casosHistorico: 1533,  cambio:  +3, icono: <Pill size={16} />,        color: '#008CAE' },
  ],
  '30d': [
    { nombre: 'Respiratoria',     casos: 33680,  casosHistorico: 26312, cambio: +28, icono: <Wind size={16} />,        color: '#EF4444' },
    { nombre: 'Gastrointestinal', casos: 20412,  casosHistorico: 17904, cambio: +14, icono: <Droplets size={16} />,    color: '#F59E0B' },
    { nombre: 'Viral estacional', casos: 15480,  casosHistorico: 13008, cambio: +19, icono: <Thermometer size={16} />, color: '#8B5CF6' },
    { nombre: 'Alérgica',         casos:  8964,  casosHistorico:  9536, cambio:  -6, icono: <Activity size={16} />,    color: '#10B981' },
    { nombre: 'Crónica',          casos:  6320,  casosHistorico:  6132, cambio:  +3, icono: <Pill size={16} />,        color: '#008CAE' },
  ],
  '90d': [
    { nombre: 'Respiratoria',     casos: 101040, casosHistorico: 78936, cambio: +28, icono: <Wind size={16} />,        color: '#EF4444' },
    { nombre: 'Gastrointestinal', casos:  61236, casosHistorico: 53712, cambio: +14, icono: <Droplets size={16} />,    color: '#F59E0B' },
    { nombre: 'Viral estacional', casos:  46440, casosHistorico: 39024, cambio: +19, icono: <Thermometer size={16} />, color: '#8B5CF6' },
    { nombre: 'Alérgica',         casos:  26892, casosHistorico: 28608, cambio:  -6, icono: <Activity size={16} />,    color: '#10B981' },
    { nombre: 'Crónica',          casos:  18960, casosHistorico: 18396, cambio:  +3, icono: <Pill size={16} />,        color: '#008CAE' },
  ],
};

const historicaSemanal = [
  { semana: 'S-8', actual: 4200, historico: 3800 },
  { semana: 'S-7', actual: 4800, historico: 4100 },
  { semana: 'S-6', actual: 5200, historico: 4300 },
  { semana: 'S-5', actual: 6100, historico: 4600 },
  { semana: 'S-4', actual: 6800, historico: 4900 },
  { semana: 'S-3', actual: 7400, historico: 5100 },
  { semana: 'S-2', actual: 8100, historico: 5300 },
  { semana: 'S-1', actual: 8420, historico: 5500 },
];

const nivelConfig: Record<NivelRiesgo, { color: string; bg: string; label: string }> = {
  critico: { color: '#EF4444', bg: '#EF444418', label: 'Crítico' },
  alto:    { color: '#F59E0B', bg: '#F59E0B18', label: 'Alto'    },
  medio:   { color: '#008CAE', bg: '#008CAE18', label: 'Medio'   },
  bajo:    { color: '#10B981', bg: '#10B98118', label: 'Bajo'    },
};

const TooltipHistorico = ({ active, payload, label }: any) => {
  const { colores } = brandingConfig;
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '10px', padding: '10px 14px', fontSize: '11px' }}>
      <div style={{ fontWeight: '800', color: colores.textoClaro, marginBottom: '6px' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, marginBottom: '2px' }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></div>
      ))}
    </div>
  );
};

const HeatMapGrid: React.FC<{ estados: EstadoData[]; seleccionado: string | null; onSelect: (a: string) => void; mostrarHistorico: boolean }> = ({ estados, seleccionado, onSelect, mostrarHistorico }) => {
  const { colores } = brandingConfig;
  const maxCasos = Math.max(...estados.map(e => e.casos));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
      {estados.map(e => {
        const intensidad = e.casos / maxCasos;
        const cfg = nivelConfig[e.nivel];
        const isSelected = seleccionado === e.abrev;
        const difHistorico = Math.round(((e.casos - e.casosHistorico) / e.casosHistorico) * 100);
        return (
          <div
            key={e.abrev}
            onClick={() => onSelect(isSelected ? '' : e.abrev)}
            style={{ borderRadius: '14px', padding: '12px', background: isSelected ? cfg.color : cfg.bg, border: `2px solid ${isSelected ? cfg.color : cfg.color + '40'}`, cursor: 'pointer', transition: 'all 0.25s ease', transform: isSelected ? 'scale(1.04)' : 'scale(1)', boxShadow: isSelected ? `0 6px 20px ${cfg.color}40` : 'none', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={el => { if (!isSelected) el.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={el => { if (!isSelected) el.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: `${intensidad * 100}%`, width: '4px', background: cfg.color, borderRadius: '0 4px 4px 0', opacity: 0.7 }} />
            <div style={{ fontSize: '11px', fontWeight: '800', color: isSelected ? '#fff' : cfg.color }}>{e.abrev}</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: isSelected ? '#fff' : colores.textoClaro, marginTop: '4px' }}>{e.casos.toLocaleString()}</div>
            <div style={{ fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.8)' : colores.textoMedio }}>casos</div>
            {mostrarHistorico && (
              <div style={{ fontSize: '10px', fontWeight: '700', color: isSelected ? 'rgba(255,255,255,0.9)' : difHistorico > 0 ? '#EF4444' : '#10B981', marginTop: '3px' }}>
                vs hist: {difHistorico > 0 ? '+' : ''}{difHistorico}%
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px', fontSize: '11px', fontWeight: '700', color: isSelected ? 'rgba(255,255,255,0.9)' : e.tendencia > 0 ? '#EF4444' : '#10B981' }}>
              {e.tendencia > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {e.tendencia > 0 ? '+' : ''}{e.tendencia}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DashboardEpidemiologico: React.FC = () => {
  const { colores } = brandingConfig;
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('7d');
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [vistaGrafica, setVistaGrafica] = useState<'barras' | 'lineas'>('barras');

  const estadosActuales = estadosPorPeriodo[periodo];
  const enfermedadesActuales = enfermedadesPorPeriodo[periodo];
  const detalleEstado = estadoSeleccionado ? estadosActuales.find(e => e.abrev === estadoSeleccionado) : null;
  const totalCasos = estadosActuales.reduce((s, e) => s + e.casos, 0);
  const totalHistorico = estadosActuales.reduce((s, e) => s + e.casosHistorico, 0);
  const estadosCriticos = estadosActuales.filter(e => e.nivel === 'critico').length;
  const difGlobal = Math.round(((totalCasos - totalHistorico) / totalHistorico) * 100);
  const periodos: { id: Periodo; label: string }[] = [{ id: '7d', label: '7 días' }, { id: '30d', label: '30 días' }, { id: '90d', label: '90 días' }];
  const datosComparativa = enfermedadesActuales.map(e => ({ nombre: e.nombre.slice(0, 8), actual: e.casos, historico: e.casosHistorico }));

  return (
    <div style={{ background: colores.fondoSecundario, borderRadius: '24px', padding: '28px', border: `1px solid ${colores.borde}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444', animation: 'pulseEpi2 2s infinite' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: colores.textoClaro, margin: 0, letterSpacing: '-0.3px' }}>Vigilancia Epidemiológica</h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>Concentración de casos por estado · Datos en tiempo real</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setMostrarHistorico(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: mostrarHistorico ? '#008CAE20' : colores.fondoTerciario, color: mostrarHistorico ? '#008CAE' : colores.textoMedio }}
          >
            <History size={13} /> vs Histórico
          </button>
          <div style={{ display: 'flex', background: colores.fondoTerciario, borderRadius: '10px', padding: '3px', border: `1px solid ${colores.borde}` }}>
            {periodos.map(p => (
              <button key={p.id} onClick={() => setPeriodo(p.id)} style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: periodo === p.id ? colores.primario : 'transparent', color: periodo === p.id ? '#fff' : colores.textoMedio }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[
          { val: totalCasos.toLocaleString(),                                            label: 'casos totales',       color: '#EF4444' },
          { val: estadosCriticos.toString(),                                             label: 'estados críticos',    color: '#F59E0B' },
          { val: `${difGlobal > 0 ? '+' : ''}${difGlobal}%`,                            label: 'vs período anterior', color: difGlobal > 0 ? '#EF4444' : '#10B981' },
        ].map((k, i) => (
          <div key={i} style={{ padding: '8px 16px', borderRadius: '14px', background: `${k.color}15`, border: `1px solid ${k.color}30`, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: k.color }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: colores.textoMedio }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: colores.textoMedio, fontWeight: '600' }}>Nivel:</span>
            {Object.entries(nivelConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: v.color }} />
                <span style={{ fontSize: '11px', color: colores.textoMedio }}>{v.label}</span>
              </div>
            ))}
            {mostrarHistorico && <span style={{ fontSize: '11px', color: colores.primario, fontWeight: '700', marginLeft: '8px' }}>· Comparando vs histórico</span>}
          </div>

          <HeatMapGrid estados={estadosActuales} seleccionado={estadoSeleccionado} onSelect={setEstadoSeleccionado} mostrarHistorico={mostrarHistorico} />

          {detalleEstado && (
            <div style={{ background: colores.fondoTerciario, borderRadius: '16px', padding: '16px', border: `1px solid ${nivelConfig[detalleEstado.nivel].color}40`, animation: 'fadeInEpi2 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={nivelConfig[detalleEstado.nivel].color} />
                  <span style={{ fontSize: '15px', fontWeight: '800', color: colores.textoClaro }}>{detalleEstado.nombre}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: nivelConfig[detalleEstado.nivel].color, background: nivelConfig[detalleEstado.nivel].bg, padding: '2px 8px', borderRadius: '6px' }}>{nivelConfig[detalleEstado.nivel].label}</span>
                </div>
                {mostrarHistorico && <div style={{ fontSize: '12px', fontWeight: '700', color: detalleEstado.casos > detalleEstado.casosHistorico ? '#EF4444' : '#10B981' }}>Hist: {detalleEstado.casosHistorico.toLocaleString()} casos</div>}
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: colores.textoMedio }}>
                Padecimiento principal: <strong style={{ color: colores.textoClaro }}>{detalleEstado.enfermedadPrincipal}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ background: colores.fondoTerciario, borderRadius: '18px', padding: '18px', border: `1px solid ${colores.borde}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Top Padecimientos</span>
            <Activity size={16} color={colores.primario} />
          </div>
          {enfermedadesActuales.map((enf, i) => {
            const pct = Math.round((enf.casos / enfermedadesActuales[0].casos) * 100);
            const pctHist = Math.round((enf.casosHistorico / enfermedadesActuales[0].casos) * 100);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${enf.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: enf.color, flexShrink: 0 }}>{enf.icono}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro }}>{enf.nombre}</div>
                      <div style={{ fontSize: '10px', color: colores.textoMedio }}>{enf.casos.toLocaleString()} casos</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '700', color: enf.cambio > 0 ? '#EF4444' : '#10B981' }}>
                    {enf.cambio > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {enf.cambio > 0 ? '+' : ''}{enf.cambio}%
                  </div>
                </div>
                <div style={{ position: 'relative', height: '6px', borderRadius: '4px', background: `${enf.color}15`, overflow: 'hidden' }}>
                  {mostrarHistorico && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pctHist}%`, background: `${enf.color}40`, borderRadius: '4px' }} />}
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: enf.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                </div>
                {mostrarHistorico && <div style={{ fontSize: '9px', color: colores.textoOscuro }}>Hist: {enf.casosHistorico.toLocaleString()}</div>}
              </div>
            );
          })}
          <button style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', border: `1px solid ${colores.borde}`, background: 'transparent', color: colores.primario, fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${colores.primario}10`; e.currentTarget.style.borderColor = colores.primario; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colores.borde; }}>
            Ver reporte completo <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Gráfica comparativa */}
      <div style={{ background: colores.fondoTerciario, borderRadius: '18px', padding: '18px', border: `1px solid ${colores.borde}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color={colores.primario} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Comparación vs Promedio Histórico · Respiratoria</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['barras', 'lineas'] as const).map(v => (
              <button key={v} onClick={() => setVistaGrafica(v)} style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: vistaGrafica === v ? colores.primario : colores.fondoSecundario, color: vistaGrafica === v ? '#fff' : colores.textoMedio }}>
                {v === 'barras' ? 'Barras' : 'Líneas'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {vistaGrafica === 'barras' ? (
              <BarChart data={datosComparativa} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={4}>
                <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipHistorico />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="actual"    name="Período actual"      fill="#EF4444"                  radius={[4,4,0,0]} />
                <Bar dataKey="historico" name="Promedio histórico"   fill={`${colores.primario}60`}  radius={[4,4,0,0]} />
              </BarChart>
            ) : (
              <LineChart data={historicaSemanal} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="semana" tick={{ fontSize: 10, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipHistorico />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={5500} stroke={colores.primario} strokeDasharray="4 4" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="actual"    name="Período actual"    stroke="#EF4444"         strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="historico" name="Promedio histórico" stroke={colores.primario} strokeWidth={2}   strokeDasharray="5 5" dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerta brote */}
      <div style={{ background: '#EF444408', border: '1px solid #EF444425', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EF444420', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AlertTriangle size={18} color="#EF4444" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Brote detectado · Zona norte de Veracruz</div>
          <div style={{ fontSize: '12px', color: colores.textoMedio, marginTop: '2px' }}>
            Incremento atípico +34% vs histórico en casos respiratorios. Se recomienda incrementar stock de antigripales y antibióticos.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Ver detalle <ArrowUpRight size={14} />
        </div>
      </div>

      <style>{`
        @keyframes pulseEpi2 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
        @keyframes fadeInEpi2 { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
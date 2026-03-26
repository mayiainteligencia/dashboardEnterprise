import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  ShieldCheck,
  BarChart2,
  Award,
  RefreshCw,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
} from 'recharts';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type Periodo = '7d' | '30d' | '90d';

interface KPI {
  id: string;
  titulo: string;
  descripcion: string;
  valor: number;
  unidad: string;
  meta: number;
  cambio: number;
  icono: React.ReactNode;
  color: string;
  historial: { label: string; v: number }[];
  formato: 'porcentaje' | 'dias' | 'numero';
  inversion?: boolean; // true = menor es mejor
}

// ── Datos dummy ────────────────────────────────────────────────────────────────

const generarHistorial = (base: number, len: number, spread = 0.08) =>
  Array.from({ length: len }, (_, i) => ({
    label: `S${i + 1}`,
    v: parseFloat((base * (1 + (Math.random() - 0.5) * spread + i * 0.003)).toFixed(1)),
  }));

const kpisData: Record<Periodo, KPI[]> = {
  '7d': [
    {
      id: 'desabasto', titulo: 'Reducción de Desabasto', descripcion: 'vs período anterior',
      valor: 18.4, unidad: '%', meta: 25, cambio: +4.2,
      icono: <ShieldCheck size={20} />, color: '#10B981',
      historial: generarHistorial(18, 7), formato: 'porcentaje',
    },
    {
      id: 'disponibilidad', titulo: 'Disponibilidad de Productos Críticos', descripcion: 'cobertura nacional',
      valor: 94.2, unidad: '%', meta: 98, cambio: +1.8,
      icono: <Target size={20} />, color: '#008CAE',
      historial: generarHistorial(94, 7, 0.02), formato: 'porcentaje',
    },
    {
      id: 'ventas_perdidas', titulo: 'Ventas Perdidas por Desabasto', descripcion: 'reducción acumulada',
      valor: 7.3, unidad: '%', meta: 5, cambio: -2.1,
      icono: <TrendingDown size={20} />, color: '#EF4444',
      historial: generarHistorial(7.3, 7), formato: 'porcentaje', inversion: true,
    },
    {
      id: 'precision', titulo: 'Precisión del Pronóstico', descripcion: 'exactitud del modelo IA',
      valor: 87.6, unidad: '%', meta: 92, cambio: +3.4,
      icono: <BarChart2 size={20} />, color: '#8B5CF6',
      historial: generarHistorial(87, 7, 0.015), formato: 'porcentaje',
    },
    {
      id: 'anticipacion', titulo: 'Tiempo de Anticipación de Alertas', descripcion: 'antes del quiebre',
      valor: 4.8, unidad: 'días', meta: 7, cambio: +0.6,
      icono: <Clock size={20} />, color: '#F59E0B',
      historial: generarHistorial(4.8, 7, 0.06), formato: 'dias',
    },
    {
      id: 'rotacion', titulo: 'Mejora en Rotación de Inventario', descripcion: 'eficiencia de stock',
      valor: 12.1, unidad: '%', meta: 20, cambio: +2.3,
      icono: <RefreshCw size={20} />, color: '#F27405',
      historial: generarHistorial(12, 7), formato: 'porcentaje',
    },
    {
      id: 'servicio', titulo: 'Nivel de Servicio al Paciente', descripcion: 'satisfacción operativa',
      valor: 91.4, unidad: '%', meta: 96, cambio: +1.2,
      icono: <Award size={20} />, color: '#EC4899',
      historial: generarHistorial(91, 7, 0.01), formato: 'porcentaje',
    },
    {
      id: 'sobreinventario', titulo: 'Reducción Sobreinventario', descripcion: 'productos redistribuidos',
      valor: 22.7, unidad: '%', meta: 30, cambio: +5.8,
      icono: <TrendingUp size={20} />, color: '#06B6D4',
      historial: generarHistorial(22, 7), formato: 'porcentaje',
    },
  ],
  '30d': [
    {
      id: 'desabasto', titulo: 'Reducción de Desabasto', descripcion: 'vs período anterior',
      valor: 21.8, unidad: '%', meta: 25, cambio: +6.1,
      icono: <ShieldCheck size={20} />, color: '#10B981',
      historial: generarHistorial(21, 12), formato: 'porcentaje',
    },
    {
      id: 'disponibilidad', titulo: 'Disponibilidad de Productos Críticos', descripcion: 'cobertura nacional',
      valor: 96.1, unidad: '%', meta: 98, cambio: +2.4,
      icono: <Target size={20} />, color: '#008CAE',
      historial: generarHistorial(96, 12, 0.02), formato: 'porcentaje',
    },
    {
      id: 'ventas_perdidas', titulo: 'Ventas Perdidas por Desabasto', descripcion: 'reducción acumulada',
      valor: 5.8, unidad: '%', meta: 5, cambio: -3.2,
      icono: <TrendingDown size={20} />, color: '#EF4444',
      historial: generarHistorial(5.8, 12), formato: 'porcentaje', inversion: true,
    },
    {
      id: 'precision', titulo: 'Precisión del Pronóstico', descripcion: 'exactitud del modelo IA',
      valor: 89.3, unidad: '%', meta: 92, cambio: +4.1,
      icono: <BarChart2 size={20} />, color: '#8B5CF6',
      historial: generarHistorial(89, 12, 0.015), formato: 'porcentaje',
    },
    {
      id: 'anticipacion', titulo: 'Tiempo de Anticipación de Alertas', descripcion: 'antes del quiebre',
      valor: 5.6, unidad: 'días', meta: 7, cambio: +1.1,
      icono: <Clock size={20} />, color: '#F59E0B',
      historial: generarHistorial(5.6, 12, 0.06), formato: 'dias',
    },
    {
      id: 'rotacion', titulo: 'Mejora en Rotación de Inventario', descripcion: 'eficiencia de stock',
      valor: 15.4, unidad: '%', meta: 20, cambio: +4.2,
      icono: <RefreshCw size={20} />, color: '#F27405',
      historial: generarHistorial(15, 12), formato: 'porcentaje',
    },
    {
      id: 'servicio', titulo: 'Nivel de Servicio al Paciente', descripcion: 'satisfacción operativa',
      valor: 93.2, unidad: '%', meta: 96, cambio: +2.1,
      icono: <Award size={20} />, color: '#EC4899',
      historial: generarHistorial(93, 12, 0.01), formato: 'porcentaje',
    },
    {
      id: 'sobreinventario', titulo: 'Reducción Sobreinventario', descripcion: 'productos redistribuidos',
      valor: 26.3, unidad: '%', meta: 30, cambio: +7.4,
      icono: <TrendingUp size={20} />, color: '#06B6D4',
      historial: generarHistorial(26, 12), formato: 'porcentaje',
    },
  ],
  '90d': [
    {
      id: 'desabasto', titulo: 'Reducción de Desabasto', descripcion: 'vs período anterior',
      valor: 23.5, unidad: '%', meta: 25, cambio: +8.9,
      icono: <ShieldCheck size={20} />, color: '#10B981',
      historial: generarHistorial(23, 16), formato: 'porcentaje',
    },
    {
      id: 'disponibilidad', titulo: 'Disponibilidad de Productos Críticos', descripcion: 'cobertura nacional',
      valor: 97.4, unidad: '%', meta: 98, cambio: +3.8,
      icono: <Target size={20} />, color: '#008CAE',
      historial: generarHistorial(97, 16, 0.02), formato: 'porcentaje',
    },
    {
      id: 'ventas_perdidas', titulo: 'Ventas Perdidas por Desabasto', descripcion: 'reducción acumulada',
      valor: 4.2, unidad: '%', meta: 5, cambio: -4.8,
      icono: <TrendingDown size={20} />, color: '#EF4444',
      historial: generarHistorial(4.2, 16), formato: 'porcentaje', inversion: true,
    },
    {
      id: 'precision', titulo: 'Precisión del Pronóstico', descripcion: 'exactitud del modelo IA',
      valor: 91.2, unidad: '%', meta: 92, cambio: +5.6,
      icono: <BarChart2 size={20} />, color: '#8B5CF6',
      historial: generarHistorial(91, 16, 0.015), formato: 'porcentaje',
    },
    {
      id: 'anticipacion', titulo: 'Tiempo de Anticipación de Alertas', descripcion: 'antes del quiebre',
      valor: 6.4, unidad: 'días', meta: 7, cambio: +1.8,
      icono: <Clock size={20} />, color: '#F59E0B',
      historial: generarHistorial(6.4, 16, 0.06), formato: 'dias',
    },
    {
      id: 'rotacion', titulo: 'Mejora en Rotación de Inventario', descripcion: 'eficiencia de stock',
      valor: 18.2, unidad: '%', meta: 20, cambio: +6.1,
      icono: <RefreshCw size={20} />, color: '#F27405',
      historial: generarHistorial(18, 16), formato: 'porcentaje',
    },
    {
      id: 'servicio', titulo: 'Nivel de Servicio al Paciente', descripcion: 'satisfacción operativa',
      valor: 95.1, unidad: '%', meta: 96, cambio: +3.4,
      icono: <Award size={20} />, color: '#EC4899',
      historial: generarHistorial(95, 16, 0.01), formato: 'porcentaje',
    },
    {
      id: 'sobreinventario', titulo: 'Reducción Sobreinventario', descripcion: 'productos redistribuidos',
      valor: 28.9, unidad: '%', meta: 30, cambio: +9.2,
      icono: <TrendingUp size={20} />, color: '#06B6D4',
      historial: generarHistorial(28, 16), formato: 'porcentaje',
    },
  ],
};

// ── Sub-componente: KPI Card ───────────────────────────────────────────────────

const KpiCard: React.FC<{ kpi: KPI; onClick: () => void; selected: boolean }> = ({ kpi, onClick, selected }) => {
  const { colores } = brandingConfig;
  const [hovered, setHovered] = useState(false);

  const progreso = Math.min((kpi.valor / kpi.meta) * 100, 100);
  const metaAlcanzada = kpi.inversion ? kpi.valor <= kpi.meta : kpi.valor >= kpi.meta;
  const cambioPositivo = kpi.inversion ? kpi.cambio < 0 : kpi.cambio > 0;

  const radialData = [{ value: progreso, fill: kpi.color }];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${kpi.color}18 0%, ${kpi.color}08 100%)`
          : colores.fondoTerciario,
        borderRadius: '18px',
        padding: '18px',
        border: selected
          ? `2px solid ${kpi.color}50`
          : `1px solid ${hovered ? kpi.color + '40' : colores.borde}`,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: hovered && !selected ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: selected
          ? `0 6px 20px ${kpi.color}20`
          : hovered ? `0 4px 14px ${kpi.color}15` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Fila superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `${kpi.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: kpi.color,
          }}
        >
          {kpi.icono}
        </div>
        {metaAlcanzada && (
          <span
            style={{
              fontSize: '9px', fontWeight: '800', color: '#10B981',
              background: '#10B98115', padding: '2px 6px', borderRadius: '6px',
              letterSpacing: '0.3px',
            }}
          >
            META
          </span>
        )}
      </div>

      {/* Radial + valor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '52px', height: '52px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="65%"
              outerRadius="100%"
              data={[{ value: 100, fill: `${kpi.color}15` }, ...radialData]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={4} background={false} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: colores.textoClaro, lineHeight: 1, letterSpacing: '-0.5px' }}>
            {kpi.valor}{kpi.unidad === '%' ? '%' : ''}
            {kpi.formato === 'dias' && <span style={{ fontSize: '12px', fontWeight: '600', color: colores.textoMedio }}> días</span>}
          </div>
          <div style={{ fontSize: '10px', color: colores.textoMedio, marginTop: '2px' }}>
            Meta: {kpi.meta}{kpi.unidad}
          </div>
        </div>
      </div>

      {/* Título */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro, marginBottom: '4px', lineHeight: '1.3' }}>
        {kpi.titulo}
      </div>

      {/* Cambio */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            fontSize: '11px', fontWeight: '700',
            color: cambioPositivo ? '#10B981' : '#EF4444',
          }}
        >
          {cambioPositivo ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {kpi.cambio > 0 ? '+' : ''}{kpi.cambio}{kpi.unidad}
        </div>
        <span style={{ fontSize: '10px', color: colores.textoMedio }}>{kpi.descripcion}</span>
      </div>
    </div>
  );
};

// ── Componente principal ───────────────────────────────────────────────────────

export const PanelKPIs: React.FC = () => {
  const { colores } = brandingConfig;
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const [selectedKpi, setSelectedKpi] = useState<string>('disponibilidad');
  const [animKey, setAnimKey] = useState(0);

  const kpis = kpisData[periodo];
  const kpiSeleccionado = kpis.find(k => k.id === selectedKpi) || kpis[0];

  useEffect(() => {
    setAnimKey(p => p + 1);
  }, [periodo]);

  const periodos: { id: Periodo; label: string }[] = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '90d', label: '90 días' },
  ];

  const metasAlcanzadas = kpis.filter(k => k.inversion ? k.valor <= k.meta : k.valor >= k.meta).length;

  return (
    <div
      style={{
        background: colores.fondoSecundario,
        borderRadius: '24px',
        padding: '28px',
        border: `1px solid ${colores.borde}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: colores.exito, boxShadow: `0 0 8px ${colores.exito}`,
                animation: 'pulseKpi 2s infinite',
              }}
            />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: colores.textoClaro, margin: 0, letterSpacing: '-0.3px' }}>
              Panel de KPIs de Negocio
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>
            Indicadores de impacto · {metasAlcanzadas} de {kpis.length} metas alcanzadas
          </p>
        </div>

        {/* Selector de periodo */}
        <div
          style={{
            display: 'flex',
            background: colores.fondoTerciario,
            borderRadius: '12px',
            padding: '4px',
            border: `1px solid ${colores.borde}`,
          }}
        >
          {periodos.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: periodo === p.id ? colores.primario : 'transparent',
                color: periodo === p.id ? '#fff' : colores.textoMedio,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de progreso general */}
      <div
        style={{
          background: colores.fondoTerciario,
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${colores.borde}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro }}>
              Progreso global hacia metas
            </span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: colores.primario }}>
              {Math.round((metasAlcanzadas / kpis.length) * 100)}%
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '8px', background: `${colores.borde}`, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(metasAlcanzadas / kpis.length) * 100}%`,
                background: `linear-gradient(90deg, ${colores.primario} 0%, ${colores.exito} 100%)`,
                borderRadius: '8px',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: colores.primario, lineHeight: 1 }}>
            {metasAlcanzadas}/{kpis.length}
          </div>
          <div style={{ fontSize: '10px', color: colores.textoMedio }}>metas</div>
        </div>
      </div>

      {/* Grid de KPI cards */}
      <div
        key={animKey}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          animation: 'fadeInKpi 0.4s ease',
        }}
      >
        {kpis.map(kpi => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            selected={selectedKpi === kpi.id}
            onClick={() => setSelectedKpi(kpi.id)}
          />
        ))}
      </div>

      {/* Panel de detalle del KPI seleccionado */}
      {kpiSeleccionado && (
        <div
          key={selectedKpi + periodo}
          style={{
            background: colores.fondoTerciario,
            borderRadius: '18px',
            padding: '20px 24px',
            border: `1px solid ${kpiSeleccionado.color}30`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            animation: 'fadeInKpi 0.3s ease',
          }}
        >
          {/* Info detalle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '11px',
                  background: `${kpiSeleccionado.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: kpiSeleccionado.color,
                }}
              >
                {kpiSeleccionado.icono}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: colores.textoClaro }}>
                  {kpiSeleccionado.titulo}
                </div>
                <div style={{ fontSize: '11px', color: colores.textoMedio }}>
                  Período: {periodos.find(p => p.id === periodo)?.label}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Valor actual', valor: `${kpiSeleccionado.valor}${kpiSeleccionado.unidad}`, color: kpiSeleccionado.color },
                { label: 'Meta', valor: `${kpiSeleccionado.meta}${kpiSeleccionado.unidad}`, color: colores.textoMedio },
                { label: 'Cambio período', valor: `${kpiSeleccionado.cambio > 0 ? '+' : ''}${kpiSeleccionado.cambio}${kpiSeleccionado.unidad}`, color: (kpiSeleccionado.inversion ? kpiSeleccionado.cambio < 0 : kpiSeleccionado.cambio > 0) ? '#10B981' : '#EF4444' },
                { label: 'Brecha meta', valor: `${(kpiSeleccionado.meta - kpiSeleccionado.valor).toFixed(1)}${kpiSeleccionado.unidad}`, color: colores.advertencia },
              ].map((row, i) => (
                <div key={i} style={{ background: colores.fondoSecundario, borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', color: colores.textoMedio, marginBottom: '3px' }}>{row.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: row.color }}>{row.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfica de historial */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: colores.textoMedio, marginBottom: '8px' }}>
              Tendencia histórica
            </div>
            <div style={{ height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiSeleccionado.historial} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`grad_${kpiSeleccionado.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={kpiSeleccionado.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={kpiSeleccionado.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '8px', fontSize: '11px' }}    
                    formatter={(val: number | undefined) => [`${val ?? 0}${kpiSeleccionado.unidad}`, kpiSeleccionado.titulo]}    />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={kpiSeleccionado.color}
                    strokeWidth={2}
                    fill={`url(#grad_${kpiSeleccionado.id})`}
                    dot={false}
                    activeDot={{ r: 4, fill: kpiSeleccionado.color }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseKpi {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes fadeInKpi {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
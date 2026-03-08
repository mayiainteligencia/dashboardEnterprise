import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Activity,
  ArrowUpRight,
  ChevronRight,
  Thermometer,
  Wind,
  Droplets,
  Pill,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type NivelRiesgo = 'critico' | 'alto' | 'medio' | 'bajo';

interface EstadoData {
  nombre: string;
  abrev: string;
  casos: number;
  tendencia: number; // % cambio
  nivel: NivelRiesgo;
  enfermedadPrincipal: string;
}

interface EnfermedadData {
  nombre: string;
  casos: number;
  cambio: number;
  icono: React.ReactNode;
  color: string;
}

// ── Datos dummy ────────────────────────────────────────────────────────────────

const estadosData: EstadoData[] = [
  { nombre: 'Veracruz',         abrev: 'VER', casos: 1842, tendencia: +34, nivel: 'critico',  enfermedadPrincipal: 'Respiratoria' },
  { nombre: 'Estado de México', abrev: 'MEX', casos: 1560, tendencia: +22, nivel: 'critico',  enfermedadPrincipal: 'Gastrointestinal' },
  { nombre: 'Jalisco',          abrev: 'JAL', casos: 1203, tendencia: +18, nivel: 'alto',     enfermedadPrincipal: 'Viral estacional' },
  { nombre: 'CDMX',             abrev: 'CMX', casos:  987, tendencia: +11, nivel: 'alto',     enfermedadPrincipal: 'Respiratoria' },
  { nombre: 'Puebla',           abrev: 'PUE', casos:  743, tendencia:  +7, nivel: 'medio',    enfermedadPrincipal: 'Alérgica' },
  { nombre: 'Nuevo León',       abrev: 'NLE', casos:  612, tendencia:  +4, nivel: 'medio',    enfermedadPrincipal: 'Viral estacional' },
  { nombre: 'Oaxaca',           abrev: 'OAX', casos:  389, tendencia:  -3, nivel: 'bajo',     enfermedadPrincipal: 'Gastrointestinal' },
  { nombre: 'Yucatán',          abrev: 'YUC', casos:  214, tendencia:  -8, nivel: 'bajo',     enfermedadPrincipal: 'Alérgica' },
];

const enfermedadesData: EnfermedadData[] = [
  { nombre: 'Respiratoria',      casos: 8420, cambio: +28, icono: <Wind size={16} />,        color: '#EF4444' },
  { nombre: 'Gastrointestinal',  casos: 5103, cambio: +14, icono: <Droplets size={16} />,    color: '#F59E0B' },
  { nombre: 'Viral estacional',  casos: 3870, cambio: +19, icono: <Thermometer size={16} />, color: '#8B5CF6' },
  { nombre: 'Alérgica',          casos: 2241, cambio:  -6, icono: <Activity size={16} />,    color: '#10B981' },
  { nombre: 'Crónica recurrente',casos: 1580, cambio:  +3, icono: <Pill size={16} />,        color: '#008CAE' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const nivelConfig: Record<NivelRiesgo, { color: string; bg: string; label: string }> = {
  critico: { color: '#EF4444', bg: '#EF444418', label: 'Crítico'  },
  alto:    { color: '#F59E0B', bg: '#F59E0B18', label: 'Alto'     },
  medio:   { color: '#008CAE', bg: '#008CAE18', label: 'Medio'    },
  bajo:    { color: '#10B981', bg: '#10B98118', label: 'Bajo'     },
};

// ── Mapa de calor simplificado (grilla de celdas por estado) ──────────────────

const HeatMapGrid: React.FC<{ estados: EstadoData[]; seleccionado: string | null; onSelect: (a: string) => void }> = ({
  estados, seleccionado, onSelect,
}) => {
  const { colores } = brandingConfig;

  // Normalizar intensidad 0–1
  const maxCasos = Math.max(...estados.map((e) => e.casos));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}
    >
      {estados.map((e) => {
        const intensidad = e.casos / maxCasos;
        const cfg = nivelConfig[e.nivel];
        const isSelected = seleccionado === e.abrev;

        return (
          <div
            key={e.abrev}
            onClick={() => onSelect(isSelected ? '' : e.abrev)}
            style={{
              borderRadius: '14px',
              padding: '12px',
              background: isSelected ? cfg.color : cfg.bg,
              border: `2px solid ${isSelected ? cfg.color : cfg.color + '40'}`,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              transform: isSelected ? 'scale(1.04)' : 'scale(1)',
              boxShadow: isSelected ? `0 6px 20px ${cfg.color}40` : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(el) => { if (!isSelected) el.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(el) => { if (!isSelected) el.currentTarget.style.transform = 'scale(1)'; }}
          >
            {/* Barra de intensidad al fondo */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: `${intensidad * 100}%`,
                width: '4px',
                background: cfg.color,
                borderRadius: '0 4px 4px 0',
                opacity: 0.7,
              }}
            />

            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: isSelected ? '#fff' : cfg.color,
                letterSpacing: '0.5px',
              }}
            >
              {e.abrev}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: isSelected ? '#fff' : brandingConfig.colores.textoClaro,
                marginTop: '4px',
              }}
            >
              {e.casos.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: isSelected ? 'rgba(255,255,255,0.8)' : brandingConfig.colores.textoMedio,
                marginTop: '2px',
              }}
            >
              casos
            </div>

            {/* Tendencia */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                marginTop: '6px',
                fontSize: '11px',
                fontWeight: '700',
                color: isSelected
                  ? 'rgba(255,255,255,0.9)'
                  : e.tendencia > 0
                  ? '#EF4444'
                  : '#10B981',
              }}
            >
              {e.tendencia > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {e.tendencia > 0 ? '+' : ''}{e.tendencia}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Componente principal ───────────────────────────────────────────────────────

export const DashboardEpidemiologico: React.FC = () => {
  const { colores } = brandingConfig;
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(null);

  const detalleEstado = estadoSeleccionado
    ? estadosData.find((e) => e.abrev === estadoSeleccionado)
    : null;

  const totalCasos = estadosData.reduce((s, e) => s + e.casos, 0);
  const estadosCriticos = estadosData.filter((e) => e.nivel === 'critico').length;

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
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#EF4444',
                boxShadow: '0 0 8px #EF4444',
                animation: 'pulseEpi 2s infinite',
              }}
            />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: colores.textoClaro,
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              Vigilancia Epidemiológica
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>
            Concentración de casos por estado · Datos en tiempo real
          </p>
        </div>

        {/* Resumen rápido */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '14px',
              background: '#EF444418',
              border: '1px solid #EF444430',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#EF4444' }}>
              {totalCasos.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: colores.textoMedio }}>casos totales</div>
          </div>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '14px',
              background: '#F59E0B18',
              border: '1px solid #F59E0B30',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#F59E0B' }}>
              {estadosCriticos}
            </div>
            <div style={{ fontSize: '10px', color: colores.textoMedio }}>estados críticos</div>
          </div>
        </div>
      </div>

      {/* ── Layout: mapa + sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px' }}>

        {/* Mapa de calor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Leyenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: colores.textoMedio, fontWeight: '600' }}>
              Nivel de alerta:
            </span>
            {Object.entries(nivelConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    background: v.color,
                  }}
                />
                <span style={{ fontSize: '11px', color: colores.textoMedio }}>{v.label}</span>
              </div>
            ))}
          </div>

          <HeatMapGrid
            estados={estadosData}
            seleccionado={estadoSeleccionado}
            onSelect={setEstadoSeleccionado}
          />

          {/* Detalle del estado seleccionado */}
          {detalleEstado && (
            <div
              style={{
                background: colores.fondoTerciario,
                borderRadius: '16px',
                padding: '16px',
                border: `1px solid ${nivelConfig[detalleEstado.nivel].color}40`,
                animation: 'fadeInEpi 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color={nivelConfig[detalleEstado.nivel].color} />
                  <span style={{ fontSize: '15px', fontWeight: '800', color: colores.textoClaro }}>
                    {detalleEstado.nombre}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: nivelConfig[detalleEstado.nivel].color,
                      background: nivelConfig[detalleEstado.nivel].bg,
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {nivelConfig[detalleEstado.nivel].label}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: colores.textoMedio }}>
                  Padecimiento principal: <strong style={{ color: colores.textoClaro }}>{detalleEstado.enfermedadPrincipal}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: top enfermedades */}
        <div
          style={{
            background: colores.fondoTerciario,
            borderRadius: '18px',
            padding: '18px',
            border: `1px solid ${colores.borde}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>
              Top Padecimientos
            </span>
            <Activity size={16} color={colores.primario} />
          </div>

          {enfermedadesData.map((enf, i) => {
            const pct = Math.round((enf.casos / enfermedadesData[0].casos) * 100);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: `${enf.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: enf.color,
                        flexShrink: 0,
                      }}
                    >
                      {enf.icono}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro }}>
                        {enf.nombre}
                      </div>
                      <div style={{ fontSize: '10px', color: colores.textoMedio }}>
                        {enf.casos.toLocaleString()} casos
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: enf.cambio > 0 ? '#EF4444' : '#10B981',
                    }}
                  >
                    {enf.cambio > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {enf.cambio > 0 ? '+' : ''}{enf.cambio}%
                  </div>
                </div>

                {/* Barra de progreso */}
                <div
                  style={{
                    height: '4px',
                    borderRadius: '4px',
                    background: `${enf.color}20`,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: enf.color,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <button
            style={{
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '12px',
              border: `1px solid ${colores.borde}`,
              background: 'transparent',
              color: colores.primario,
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${colores.primario}12`;
              e.currentTarget.style.borderColor = colores.primario;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = colores.borde;
            }}
          >
            Ver reporte completo
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Alertas de brote ── */}
      <div
        style={{
          background: '#EF444408',
          border: '1px solid #EF444425',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#EF444420',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={18} color="#EF4444" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>
            Brote detectado · Zona norte de Veracruz
          </div>
          <div style={{ fontSize: '12px', color: colores.textoMedio, marginTop: '2px' }}>
            Incremento atípico de casos respiratorios +34% en los últimos 7 días. Se recomienda incrementar stock de antigripales y antibióticos.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Ver detalle <ArrowUpRight size={14} />
        </div>
      </div>

      <style>{`
        @keyframes pulseEpi {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes fadeInEpi {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
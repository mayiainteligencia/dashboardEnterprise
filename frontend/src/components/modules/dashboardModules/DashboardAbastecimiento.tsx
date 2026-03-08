import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowRightLeft,
  Package,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Zap,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type NivelRiesgo = 'critico' | 'alto' | 'medio' | 'ok';

interface ProductoRiesgo {
  sku: string;
  nombre: string;
  categoria: string;
  stockActual: number;   // días de cobertura
  demandaEsperada: number; // % incremento esperado
  nivel: NivelRiesgo;
  sucursalesAfectadas: number;
}

interface Recomendacion {
  id: string;
  tipo: 'transferencia' | 'reposicion' | 'urgente';
  producto: string;
  de: string;
  hacia: string;
  unidades: number;
  impacto: string;
}

interface RegionSemaforo {
  nombre: string;
  abrev: string;
  cobertura: number; // %
  nivel: NivelRiesgo;
  productos: number; // productos en riesgo
}

// ── Datos dummy ────────────────────────────────────────────────────────────────

const productosRiesgo: ProductoRiesgo[] = [
  { sku: 'ANT-001', nombre: 'Amoxicilina 500mg c/15',     categoria: 'Antibióticos',   stockActual: 3,  demandaEsperada: +42, nivel: 'critico', sucursalesAfectadas: 38 },
  { sku: 'ANT-002', nombre: 'Azitromicina 500mg c/6',     categoria: 'Antibióticos',   stockActual: 5,  demandaEsperada: +31, nivel: 'critico', sucursalesAfectadas: 24 },
  { sku: 'ANL-003', nombre: 'Ibuprofeno 400mg c/20',      categoria: 'Analgésicos',    stockActual: 7,  demandaEsperada: +18, nivel: 'alto',    sucursalesAfectadas: 17 },
  { sku: 'VIT-004', nombre: 'Vitamina C 1g efervescente', categoria: 'Vitaminas',      stockActual: 9,  demandaEsperada: +22, nivel: 'alto',    sucursalesAfectadas: 12 },
  { sku: 'GAS-005', nombre: 'Omeprazol 20mg c/14',        categoria: 'Gastro',         stockActual: 12, demandaEsperada:  +9, nivel: 'medio',   sucursalesAfectadas:  8 },
  { sku: 'DIA-006', nombre: 'Metformina 850mg c/30',      categoria: 'Diabetes',       stockActual: 18, demandaEsperada:  +4, nivel: 'ok',      sucursalesAfectadas:  2 },
];

const recomendaciones: Recomendacion[] = [
  { id: '1', tipo: 'urgente',      producto: 'Amoxicilina 500mg',     de: 'CEDIS Monterrey', hacia: 'Región Veracruz',  unidades: 4800, impacto: 'Cubre 38 suc. por 7 días' },
  { id: '2', tipo: 'transferencia',producto: 'Azitromicina 500mg',    de: 'Región Bajío',    hacia: 'Región Centro',    unidades: 2400, impacto: 'Reduce riesgo en 24 suc.' },
  { id: '3', tipo: 'transferencia',producto: 'Ibuprofeno 400mg',      de: 'CEDIS CDMX',      hacia: 'Región Norte',     unidades: 3200, impacto: 'Previene quiebre 17 suc.' },
  { id: '4', tipo: 'reposicion',   producto: 'Vitamina C 1g',         de: 'Proveedor Alfa',  hacia: 'Nacional',         unidades: 6000, impacto: 'Cubre temporada alta' },
];

const regionesSemaforo: RegionSemaforo[] = [
  { nombre: 'Región Norte',   abrev: 'NOR', cobertura: 34, nivel: 'critico', productos: 12 },
  { nombre: 'Región Centro',  abrev: 'CEN', cobertura: 51, nivel: 'alto',    productos:  8 },
  { nombre: 'Región Sur',     abrev: 'SUR', cobertura: 58, nivel: 'alto',    productos:  6 },
  { nombre: 'Región Bajío',   abrev: 'BAJ', cobertura: 74, nivel: 'medio',   productos:  3 },
  { nombre: 'Región Pacífico',abrev: 'PAC', cobertura: 82, nivel: 'ok',      productos:  1 },
  { nombre: 'Región CDMX',    abrev: 'CMX', cobertura: 88, nivel: 'ok',      productos:  0 },
];

// ── Config visual por nivel ────────────────────────────────────────────────────

const nivelCfg: Record<NivelRiesgo, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  critico: { color: '#EF4444', bg: '#EF444415', label: 'Crítico', icon: <AlertTriangle size={12} /> },
  alto:    { color: '#F59E0B', bg: '#F59E0B15', label: 'Alto',    icon: <Clock size={12} />         },
  medio:   { color: '#008CAE', bg: '#008CAE15', label: 'Medio',   icon: <TrendingUp size={12} />    },
  ok:      { color: '#10B981', bg: '#10B98115', label: 'OK',      icon: <CheckCircle size={12} />   },
};

const tipoCfg: Record<Recomendacion['tipo'], { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  urgente:       { color: '#EF4444', bg: '#EF444415', label: '🚨 Urgente',       icon: <Zap size={14} />          },
  transferencia: { color: '#008CAE', bg: '#008CAE15', label: '↔ Transferencia',  icon: <ArrowRightLeft size={14} /> },
  reposicion:    { color: '#10B981', bg: '#10B98115', label: '📦 Reposición',    icon: <Package size={14} />      },
};

// ── Componente principal ───────────────────────────────────────────────────────

export const DashboardAbastecimiento: React.FC = () => {
  const { colores } = brandingConfig;
  const [tabActivo, setTabActivo] = useState<'productos' | 'recomendaciones'>('productos');
  const [recsAceptadas, setRecsAceptadas] = useState<string[]>([]);

  const aceptarRec = (id: string) =>
    setRecsAceptadas((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);

  const criticos = productosRiesgo.filter((p) => p.nivel === 'critico').length;
  const altos    = productosRiesgo.filter((p) => p.nivel === 'alto').length;
  const sucAfectadas = productosRiesgo.reduce((s, p) => s + p.sucursalesAfectadas, 0);

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
                background: '#F59E0B',
                boxShadow: '0 0 8px #F59E0B',
                animation: 'pulseAbast 2s infinite',
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
              Abastecimiento Predictivo
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>
            Riesgos de desabasto · Recomendaciones automáticas de IA
          </p>
        </div>

        {/* KPIs rápidos */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { val: criticos,      label: 'críticos',   color: '#EF4444' },
            { val: altos,         label: 'en alerta',  color: '#F59E0B' },
            { val: sucAfectadas,  label: 'suc. en riesgo', color: '#008CAE' },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                padding: '8px 14px',
                borderRadius: '14px',
                background: `${k.color}15`,
                border: `1px solid ${k.color}30`,
                textAlign: 'center',
                minWidth: '64px',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: '800', color: k.color }}>{k.val}</div>
              <div style={{ fontSize: '10px', color: colores.textoMedio }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Layout principal: tabs + semáforo regional ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px' }}>

        {/* Columna izquierda: tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Tab selector */}
          <div
            style={{
              display: 'flex',
              background: colores.fondoTerciario,
              borderRadius: '12px',
              padding: '4px',
              border: `1px solid ${colores.borde}`,
              width: 'fit-content',
            }}
          >
            {(['productos', 'recomendaciones'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActivo(tab)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tabActivo === tab ? colores.primario : 'transparent',
                  color: tabActivo === tab ? '#fff' : colores.textoMedio,
                }}
              >
                {tab === 'productos' ? '📦 Productos en riesgo' : '💡 Recomendaciones IA'}
              </button>
            ))}
          </div>

          {/* Tab: Productos en riesgo */}
          {tabActivo === 'productos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {productosRiesgo.map((p) => {
                const cfg = nivelCfg[p.nivel];
                return (
                  <div
                    key={p.sku}
                    style={{
                      background: colores.fondoTerciario,
                      borderRadius: '14px',
                      padding: '14px 16px',
                      border: `1px solid ${cfg.color}30`,
                      borderLeft: `4px solid ${cfg.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Icono nivel */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: cfg.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cfg.color,
                        flexShrink: 0,
                      }}
                    >
                      <Package size={18} />
                    </div>

                    {/* Info producto */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colores.textoClaro }}>
                          {p.nombre}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: cfg.color,
                            background: cfg.bg,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={{ fontSize: '11px', color: colores.textoMedio }}>
                          SKU: <strong style={{ color: colores.textoClaro }}>{p.sku}</strong>
                        </span>
                        <span style={{ fontSize: '11px', color: colores.textoMedio }}>
                          Cat: <strong style={{ color: colores.textoClaro }}>{p.categoria}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            color: p.stockActual <= 5 ? '#EF4444' : p.stockActual <= 10 ? '#F59E0B' : colores.exito,
                          }}
                        >
                          {p.stockActual}d
                        </div>
                        <div style={{ fontSize: '10px', color: colores.textoMedio }}>cobertura</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <TrendingUp size={13} />
                          +{p.demandaEsperada}%
                        </div>
                        <div style={{ fontSize: '10px', color: colores.textoMedio }}>demanda</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: colores.textoClaro }}>
                          {p.sucursalesAfectadas}
                        </div>
                        <div style={{ fontSize: '10px', color: colores.textoMedio }}>sucursales</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: Recomendaciones IA */}
          {tabActivo === 'recomendaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recomendaciones.map((r) => {
                const cfg = tipoCfg[r.tipo];
                const aceptada = recsAceptadas.includes(r.id);
                return (
                  <div
                    key={r.id}
                    style={{
                      background: aceptada ? `${colores.exito}10` : colores.fondoTerciario,
                      borderRadius: '16px',
                      padding: '16px',
                      border: `1px solid ${aceptada ? colores.exito + '40' : cfg.color + '30'}`,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: aceptada ? colores.exito : cfg.color,
                            background: aceptada ? `${colores.exito}15` : cfg.bg,
                            padding: '3px 10px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          {aceptada ? <CheckCircle size={12} /> : cfg.icon}
                          {aceptada ? '✓ Aceptada' : cfg.label}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colores.textoClaro }}>
                          {r.producto}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: colores.primario }}>
                        {r.unidades.toLocaleString()} uds
                      </span>
                    </div>

                    {/* Ruta */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: colores.fondoSecundario,
                        borderRadius: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <MapPin size={13} color={colores.textoMedio} />
                      <span style={{ fontSize: '12px', color: colores.textoClaro, fontWeight: '600' }}>{r.de}</span>
                      <ArrowRightLeft size={13} color={colores.primario} />
                      <span style={{ fontSize: '12px', color: colores.textoClaro, fontWeight: '600' }}>{r.hacia}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: colores.textoMedio }}>
                        💡 {r.impacto}
                      </span>
                      <button
                        onClick={() => aceptarRec(r.id)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: aceptada
                            ? `${colores.exito}20`
                            : colores.primario,
                          color: aceptada ? colores.exito : '#fff',
                        }}
                      >
                        {aceptada ? '✓ Aceptada' : 'Aceptar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna derecha: Semáforo regional */}
        <div
          style={{
            background: colores.fondoTerciario,
            borderRadius: '18px',
            padding: '18px',
            border: `1px solid ${colores.borde}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>
              Semáforo Regional
            </span>
            <Truck size={16} color={colores.primario} />
          </div>

          {regionesSemaforo.map((r) => {
            const cfg = nivelCfg[r.nivel];
            return (
              <div key={r.abrev} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: cfg.color,
                        boxShadow: r.nivel === 'critico' ? `0 0 6px ${cfg.color}` : 'none',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro }}>
                      {r.nombre}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: cfg.color }}>
                    {r.cobertura}%
                  </span>
                </div>

                {/* Barra */}
                <div
                  style={{
                    height: '5px',
                    borderRadius: '5px',
                    background: `${cfg.color}20`,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${r.cobertura}%`,
                      background: cfg.color,
                      borderRadius: '5px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>

                {r.productos > 0 && (
                  <span style={{ fontSize: '10px', color: cfg.color }}>
                    {r.productos} producto{r.productos > 1 ? 's' : ''} en riesgo
                  </span>
                )}
              </div>
            );
          })}

          {/* CTA */}
          <button
            style={{
              marginTop: '8px',
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
            Ver plan de abasto <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Alerta de acción recomendada ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colores.primario}12 0%, ${colores.acento}08 100%)`,
          border: `1px solid ${colores.primario}25`,
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
            background: `${colores.primario}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={18} color={colores.primario} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>
            Acción recomendada · Antibióticos pediátricos · Región Centro
          </div>
          <div style={{ fontSize: '12px', color: colores.textoMedio, marginTop: '2px' }}>
            Riesgo alto de desabasto en los próximos 5 días. Demanda esperada supera inventario disponible en 18 sucursales.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: colores.primario,
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Activar reabasto <ArrowUpRight size={14} />
        </div>
      </div>

      <style>{`
        @keyframes pulseAbast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};
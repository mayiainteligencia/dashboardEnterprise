import React, { useState } from 'react';
import {
  BarChart2, Activity, Package, Map, Target,
  Layers, ChevronRight, Zap, TrendingUp,
  AlertTriangle, CheckCircle,
} from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { DashboardEjecutivo }      from '../modules/dashboardModules/DashboardEjecutivo';
import { DashboardEpidemiologico } from '../modules/dashboardModules/DashboardEpidemiologico';
import { DashboardAbastecimiento } from '../modules/dashboardModules/DashboardAbastecimiento';
import { MapaCalorEstados }        from '../modules/dashboardModules/MapaCalorEstados';
import { PanelKPIs }               from '../modules/dashboardModules/PanelKPIs';
import { ClustersSegmentacion }    from '../modules/dashboardModules/ClustersSegmentacion';

type ModuloId =
  | 'ejecutivo'
  | 'epidemiologico'
  | 'abastecimiento'
  | 'mapa'
  | 'kpis'
  | 'clusters';

interface ModuloConfig {
  id:       ModuloId;
  label:    string;
  sublabel: string;
  icono:    React.ReactElement;
  color:    string;
  alertas?: number;
  estado:   'activo' | 'alerta' | 'ok';
}

const modulos: ModuloConfig[] = [
  { id: 'ejecutivo',      label: 'Resumen Ejecutivo',          sublabel: 'KPIs globales · Ventas · Inventario',      icono: <BarChart2 size={20} />, color: '#008CAE', estado: 'ok'     },
  { id: 'epidemiologico', label: 'Vigilancia Epidemiológica',  sublabel: 'Brotes · Casos · Tendencias',              icono: <Activity  size={20} />, color: '#EF4444', estado: 'alerta', alertas: 2 },
  { id: 'abastecimiento', label: 'Abastecimiento Predictivo',  sublabel: 'Riesgo · Inventario ocioso · IA',          icono: <Package   size={20} />, color: '#F59E0B', estado: 'alerta', alertas: 4 },
  { id: 'mapa',           label: 'Mapa de Calor Nacional',     sublabel: 'Concentración por estado',                 icono: <Map       size={20} />, color: '#8B5CF6', estado: 'activo'  },
  { id: 'kpis',           label: 'Panel de KPIs',              sublabel: 'Objetivos · Metas · Progreso',             icono: <Target    size={20} />, color: '#10B981', estado: 'ok'     },
  { id: 'clusters',       label: 'Clusters de Segmentación',   sublabel: 'Enfermedad · Región · Perfil · Tiempo',   icono: <Layers    size={20} />, color: '#8B5CF6', estado: 'activo'  },
];

const renderModulo = (id: ModuloId) => {
  switch (id) {
    case 'ejecutivo':      return <DashboardEjecutivo />;
    case 'epidemiologico': return <DashboardEpidemiologico />;
    case 'abastecimiento': return <DashboardAbastecimiento />;
    case 'mapa':           return <MapaCalorEstados />;
    case 'kpis':           return <PanelKPIs />;
    case 'clusters':       return <ClustersSegmentacion />;
  }
};

export const Analiticos: React.FC = () => {
  const { colores } = brandingConfig;
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('ejecutivo');
  const moduloActual  = modulos.find(m => m.id === moduloActivo)!;
  const totalAlertas  = modulos.reduce((s, m) => s + (m.alertas ?? 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: colores.fondoPrincipal }}>

      {/* ── Header ── */}
      <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${colores.primario} 0%, #005f78 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}>
              Centro Analítico IA
            </h2>
            {totalAlertas > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#EF444415', border: '1px solid #EF444430', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', fontWeight: '800', color: '#EF4444', animation: 'pulseAlert 3s infinite' }}>
                <AlertTriangle size={11} /> {totalAlertas} alertas activas
              </div>
            )}
          </div>
          <p style={{ fontSize: '13px', color: colores.textoMedio, margin: 0 }}>
            Plataforma de inteligencia epidemiológica y operativa · Farmacias Similares
          </p>
        </div>

        {/* Indicadores globales */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Módulos activos',  val: `${modulos.length}/6`, color: colores.primario },
            { label: 'Alertas críticas', val: String(totalAlertas),  color: '#EF4444'        },
            { label: 'Datos en vivo',    val: 'ON',                  color: '#10B981'        },
          ].map((k, i) => (
            <div key={i} style={{ padding: '8px 14px', borderRadius: '12px', textAlign: 'center', background: `${k.color}10`, border: `1px solid ${k.color}25` }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: k.color }}>{k.val}</div>
              <div style={{ fontSize: '10px', color: colores.textoMedio }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cards selectoras ── */}
      <div style={{ padding: '20px 32px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {modulos.map(m => {
          const isActive = moduloActivo === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setModuloActivo(m.id)}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: '18px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.25s ease',
                background: isActive ? `linear-gradient(135deg, ${m.color} 0%, ${m.color}bb 100%)` : colores.fondoSecundario,
                border: isActive ? `1px solid transparent` : `1px solid ${colores.borde}`,
                boxShadow: isActive ? `0 8px 24px ${m.color}40` : '0 1px 4px rgba(0,0,0,0.06)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${m.color}25`; e.currentTarget.style.borderColor = `${m.color}50`; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = colores.borde; } }}
            >
              {/* Badge alertas */}
              {(m.alertas ?? 0) > 0 && !isActive && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.alertas}
                </div>
              )}
              {m.estado === 'ok' && !isActive && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#10B981' }}>
                  <CheckCircle size={14} />
                </div>
              )}

              {/* Icono */}
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isActive ? 'rgba(255,255,255,0.25)' : `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#fff' : m.color, marginBottom: '10px' }}>
                {m.icono}
              </div>

              {/* Labels */}
              <div style={{ fontSize: '12px', fontWeight: '800', lineHeight: '1.3', color: isActive ? '#fff' : colores.textoClaro, marginBottom: '3px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '10px', lineHeight: '1.3', color: isActive ? 'rgba(255,255,255,0.75)' : colores.textoMedio }}>
                {m.sublabel}
              </div>

              {isActive && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
                  <TrendingUp size={10} /> Viendo ahora <ChevronRight size={10} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{ padding: '0 32px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colores.textoMedio }}>
        <span style={{ color: colores.textoOscuro }}>Analíticos</span>
        <ChevronRight size={12} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: moduloActual.color, fontWeight: '700' }}>
          {React.cloneElement(moduloActual.icono as React.ReactElement<{ size?: number }>, { size: 12 })}
          {moduloActual.label}
        </span>
        {(moduloActual.alertas ?? 0) > 0 && (
          <>
            <ChevronRight size={12} />
            <span style={{ color: '#EF4444', fontWeight: '700' }}>{moduloActual.alertas} alertas</span>
          </>
        )}
      </div>

      {/* ── Módulo activo ── */}
      <div key={moduloActivo} style={{ padding: '0 32px 32px', animation: 'fadeInModulo 0.3s ease' }}>
        {renderModulo(moduloActivo)}
      </div>

      <style>{`
        @keyframes fadeInModulo {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseAlert {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
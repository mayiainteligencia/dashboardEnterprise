import React, { useState } from 'react';
import { BarChart2, Activity, Package, ChevronRight } from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { DashboardEjecutivo } from '../modules/dashboardModules/DashboardEjecutivo';
import { DashboardEpidemiologico } from '../modules/dashboardModules/Dashboardepidemiologico';
import { DashboardAbastecimiento } from '../modules/dashboardModules/DashboardAbastecimiento';

type VistaActiva = 'ejecutivo' | 'epidemiologico' | 'abastecimiento';

const vistas = [
  {
    id: 'ejecutivo' as VistaActiva,
    titulo: 'Dashboard Ejecutivo',
    descripcion: 'KPIs nacionales, ventas, inventario y demanda proyectada',
    icono: BarChart2,
    color: '#008CAE',
  },
  {
    id: 'epidemiologico' as VistaActiva,
    titulo: 'Vigilancia Epidemiológica',
    descripcion: 'Concentración de casos por estado, brotes y padecimientos',
    icono: Activity,
    color: '#EF4444',
  },
  {
    id: 'abastecimiento' as VistaActiva,
    titulo: 'Abastecimiento Predictivo',
    descripcion: 'Riesgos de desabasto, semáforo regional y recomendaciones IA',
    icono: Package,
    color: '#F59E0B',
  },
];

export const Analiticos: React.FC = () => {
  const { colores } = brandingConfig;
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('ejecutivo');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Header de sección ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2
            style={{
              fontSize: '30px',
              fontWeight: '800',
              color: colores.textoClaro,
              margin: '0 0 6px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Analíticos
          </h2>
          <p style={{ color: colores.textoMedio, fontSize: '14px', margin: 0 }}>
            Inteligencia predictiva · Farmacias Similares
          </p>
        </div>

        {/* Indicador activo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: `${colores.primario}10`,
            border: `1px solid ${colores.primario}30`,
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: colores.exito,
              boxShadow: `0 0 6px ${colores.exito}`,
              animation: 'pulseAnal 2s infinite',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: '700', color: colores.primario }}>
            Datos en tiempo real
          </span>
        </div>
      </div>

      {/* ── Selector de vista (3 cards horizontales) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {vistas.map((v) => {
          const Icon = v.icono;
          const isActive = vistaActiva === v.id;

          return (
            <button
              key={v.id}
              onClick={() => setVistaActiva(v.id)}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${v.color} 0%, ${v.color}CC 100%)`
                  : colores.fondoSecundario,
                border: isActive ? 'none' : `1px solid ${colores.borde}`,
                borderRadius: '18px',
                padding: '20px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                boxShadow: isActive
                  ? `0 8px 24px ${v.color}35`
                  : '0 2px 8px rgba(0,0,0,0.04)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = v.color + '60';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${v.color}15`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colores.borde;
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }
              }}
            >
              {/* Decoración fondo */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '11px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : `${v.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#fff' : v.color,
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={20} />
                </div>
                <ChevronRight
                  size={16}
                  color={isActive ? 'rgba(255,255,255,0.7)' : colores.textoOscuro}
                />
              </div>

              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  color: isActive ? '#fff' : colores.textoClaro,
                  marginBottom: '6px',
                  letterSpacing: '-0.2px',
                }}
              >
                {v.titulo}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: isActive ? 'rgba(255,255,255,0.75)' : colores.textoMedio,
                  lineHeight: '1.4',
                }}
              >
                {v.descripcion}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Contenido de la vista activa ── */}
      <div style={{ animation: 'fadeInAnal 0.3s ease' }} key={vistaActiva}>
        {vistaActiva === 'ejecutivo'      && <DashboardEjecutivo />}
        {vistaActiva === 'epidemiologico' && <DashboardEpidemiologico />}
        {vistaActiva === 'abastecimiento' && <DashboardAbastecimiento />}
      </div>

      <style>{`
        @keyframes pulseAnal {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes fadeInAnal {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
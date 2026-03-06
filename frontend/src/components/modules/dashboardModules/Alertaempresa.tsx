import React from 'react';
import { AlertTriangle, Shield, Clock, TrendingDown, CheckCircle, X } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface Alerta {
  id: string;
  tipo: 'critico' | 'advertencia' | 'info' | 'exito';
  titulo: string;
  mensaje: string;
  tiempo: string;
  departamento: string;
}

export const AlertasEmpresa: React.FC = () => {
  const { colores } = brandingConfig;

  const alertas: Alerta[] = [
    {
      id: '1',
      tipo: 'critico',
      titulo: 'GuardIA: Incidente de Seguridad',
      mensaje: '2 personas sin equipo de protección en área de producción',
      tiempo: 'Hace 5 min',
      departamento: 'Seguridad',
    },
    {
      id: '2',
      tipo: 'advertencia',
      titulo: 'Operaciones: Mantenimiento Preventivo',
      mensaje: 'Línea 4 requiere mantenimiento programado',
      tiempo: 'Hace 1 hora',
      departamento: 'Operaciones',
    },
    {
      id: '3',
      tipo: 'info',
      titulo: 'RRHH: Capacitación Pendiente',
      mensaje: '12 empleados sin completar curso obligatorio',
      tiempo: 'Hace 2 horas',
      departamento: 'RH',
    },
    {
      id: '4',
      tipo: 'advertencia',
      titulo: 'TI: Actualización Requerida',
      mensaje: 'Sistema de respaldos necesita actualización',
      tiempo: 'Hace 3 horas',
      departamento: 'TI',
    },
  ];

  const getAlertConfig = (tipo: Alerta['tipo']) => {
    switch (tipo) {
      case 'critico':
        return {
          color: colores.peligro,
          icon: AlertTriangle,
          bg: `${colores.peligro}15`,
        };
      case 'advertencia':
        return {
          color: colores.advertencia,
          icon: Clock,
          bg: `${colores.advertencia}15`,
        };
      case 'info':
        return {
          color: colores.primario,
          icon: Shield,
          bg: `${colores.primario}15`,
        };
      case 'exito':
        return {
          color: colores.exito,
          icon: CheckCircle,
          bg: `${colores.exito}15`,
        };
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colores.fondoSecundario}dd 0%, ${colores.fondoTerciario}dd 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${colores.borde}40`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {/* Indicador pulsante */}
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: colores.peligro,
              animation: 'pulse 2s infinite',
              boxShadow: `0 0 12px ${colores.peligro}`,
            }}
          />
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: colores.textoClaro,
              margin: 0,
            }}
          >
            Alertas de la Empresa
          </h3>
        </div>
        <p
          style={{
            fontSize: '12px',
            color: colores.textoMedio,
            margin: 0,
            paddingLeft: '18px',
          }}
        >
          Requieren atención inmediata
        </p>
      </div>

      {/* Lista de alertas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
        {alertas.map((alerta) => {
          const config = getAlertConfig(alerta.tipo);
          const Icon = config.icon;

          return (
            <div
              key={alerta.id}
              style={{
                background: config.bg,
                borderLeft: `4px solid ${config.color}`,
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${config.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Icono */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${config.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={config.color} />
                </div>

                {/* Contenido */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: '700',
                        color: colores.textoClaro,
                        lineHeight: '1.3',
                      }}
                    >
                      {alerta.titulo}
                    </h4>
                  </div>

                  <p
                    style={{
                      margin: '4px 0',
                      fontSize: '12px',
                      color: colores.textoMedio,
                      lineHeight: '1.4',
                    }}
                  >
                    {alerta.mensaje}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: colores.textoOscuro,
                      }}
                    >
                      {alerta.tiempo}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: config.color,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: `${config.color}20`,
                      }}
                    >
                      {alerta.departamento}
                    </span>
                  </div>
                </div>

                {/* Botón cerrar (opcional) */}
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.5';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <X size={14} color={colores.textoMedio} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '12px',
          borderRadius: '12px',
          border: `1px solid ${colores.borde}`,
          background: 'transparent',
          color: colores.primario,
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${colores.primario}10`;
          e.currentTarget.style.borderColor = colores.primario;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = colores.borde;
        }}
      >
        Ver todas las alertas
      </button>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.6;
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );
};
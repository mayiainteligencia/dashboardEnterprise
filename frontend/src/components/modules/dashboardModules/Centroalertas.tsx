import React from 'react';
import { AlertTriangle, Shield, Clock, Camera, X } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  icon: React.ElementType;
  message: string;
  time: string;
}

export const CentroAlertas: React.FC = () => {
  const { colores } = brandingConfig;

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      icon: AlertTriangle,
      message: 'Empleado 23 muestra signos de burnout',
      time: 'Hace 15 min',
    },
    {
      id: '2',
      type: 'warning',
      icon: Shield,
      message: 'Contraseña débil detectada en cuenta admin',
      time: 'Hace 1 hora',
    },
    {
      id: '3',
      type: 'warning',
      icon: Clock,
      message: 'Curso obligatorio de ciberseguridad no completado',
      time: 'Hace 2 horas',
    },
    {
      id: '4',
      type: 'info',
      icon: Camera,
      message: 'Cámara 2 sin conexión desde esta mañana',
      time: 'Hace 3 horas',
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return colores.peligro;
      case 'warning':
        return colores.advertencia;
      default:
        return colores.primario;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'critical':
        return `${colores.peligro}15`;
      case 'warning':
        return `${colores.advertencia}15`;
      default:
        return `${colores.primario}15`;
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
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colores.peligro,
              animation: 'pulse 2s infinite',
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
            Centro de Alertas
          </h3>
        </div>
        <p
          style={{
            fontSize: '13px',
            color: colores.textoMedio,
            margin: 0,
          }}
        >
          Notificaciones recientes que requieren atención
        </p>
      </div>

      {/* Lista de Alertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              style={{
                background: getAlertBg(alert.type),
                borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.background = getAlertBg(alert.type).replace('15', '25');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.background = getAlertBg(alert.type);
              }}
            >
              {/* Icono */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: getAlertColor(alert.type) + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={getAlertColor(alert.type)} />
              </div>

              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colores.textoClaro,
                    margin: '0 0 4px 0',
                    lineHeight: '1.4',
                  }}
                >
                  {alert.message}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: colores.textoMedio,
                    margin: 0,
                  }}
                >
                  {alert.time}
                </p>
              </div>

              {/* Botón cerrar */}
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.5';
                }}
              >
                <X size={16} color={colores.textoMedio} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Ver todas */}
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
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};
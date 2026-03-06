import React from 'react';
import { brandingConfig } from '../../../config/branding';
import type { Alerta } from '../../../types/dashboard';
import { getAlertaConfig } from '../../../config/alertasConfig';

interface AlertasModuleProps {
  alertas: Alerta[];
}

export const AlertasModule: React.FC<AlertasModuleProps> = ({ alertas }) => {
  const { colores } = brandingConfig;

  return (
    <div
      style={{
        backgroundColor: colores.fondoSecundario,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${colores.borde}`,
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: colores.textoClaro,
          marginBottom: '16px',
        }}
      >
        Alertas Activas
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alertas.map((alerta) => {
          const config = getAlertaConfig(alerta.tipo);
          const IconComponent = config.icon;

          return (
            <div
              key={alerta.id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}30`,
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: config.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={20} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: config.color,
                        backgroundColor: `${config.color}20`,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {config.label}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: colores.textoMedio,
                      }}
                    >
                      {alerta.timestamp}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colores.textoClaro,
                      marginBottom: '4px',
                    }}
                  >
                    {alerta.titulo}
                  </h4>

                  <p
                    style={{
                      fontSize: '13px',
                      color: colores.textoMedio,
                      lineHeight: '1.4',
                    }}
                  >
                    {alerta.mensaje}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
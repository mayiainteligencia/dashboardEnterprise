import React from 'react';
import { TrendingUp } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface ChartData {
  label: string;
  value: number;
  percentage: number;
}

export const ModernBarChart: React.FC = () => {
  const { colores } = brandingConfig;

  const data: ChartData[] = [
    { label: 'Other student', value: 1302, percentage: 90 },
    { label: 'Active', value: 628, percentage: 44 },
  ];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colores.fondoSecundario}dd 0%, ${colores.fondoTerciario}dd 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${colores.borde}40`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `${colores.fondoTerciario}80`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={20} color={colores.textoClaro} />
          </div>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '500',
              color: colores.textoClaro,
              margin: 0,
            }}
          >
            Students
          </h3>
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: colores.textoMedio,
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          View all
        </button>
      </div>

      {/* Main value */}
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: colores.textoClaro,
            lineHeight: '1',
            letterSpacing: '-1px',
          }}
        >
          16,892
        </div>
        <div
          style={{
            fontSize: '13px',
            color: colores.textoMedio,
            marginTop: '4px',
          }}
        >
          All condition of university
        </div>
      </div>

      {/* Chart */}
      <div style={{ marginTop: '32px', position: 'relative', height: '200px' }}>
        {/* Background grid lines */}
        {[0, 33, 66, 100].map((percent) => (
          <div
            key={percent}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${percent}%`,
              height: '1px',
              background: `${colores.borde}20`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '100%',
            gap: '40px',
            paddingTop: '20px',
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${item.percentage}%`,
                  background: index === 0 
                    ? `linear-gradient(180deg, ${colores.primario}40 0%, ${colores.primario}80 100%)`
                    : `linear-gradient(180deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
                  borderRadius: '12px 12px 0 0',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scaleY(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scaleY(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                {/* Striped pattern */}
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        ${colores.primario}20 10px,
                        ${colores.primario}20 20px
                      )`,
                    }}
                  />
                )}

                {/* Glow effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: '13px',
                  color: colores.textoClaro,
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colores.textoClaro,
                }}
              >
                {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Percentage labels */}
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: colores.textoMedio,
          }}
        >
          <div>100%</div>
          <div>66%</div>
          <div>33%</div>
          <div>0%</div>
        </div>
      </div>
    </div>
  );
};
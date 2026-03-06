import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

export const PerformanceChart: React.FC = () => {
  const { colores } = brandingConfig;
  const [chartData, setChartData] = useState([40, 65, 45, 80, 60, 90, 70, 85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData];
        newData.shift();
        newData.push(Math.floor(Math.random() * 40) + 60);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...chartData);
  const chartHeight = 200;

  return (
    <div
      style={{
        backgroundColor: colores.fondoSecundario,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${colores.borde}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: colores.textoClaro,
              marginBottom: '4px',
            }}
          >
            Rendimiento en Tiempo Real
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: colores.textoMedio,
            }}
          >
            Actualización cada 2 segundos
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
          }}
        >
          <TrendingUp size={16} color="#10B981" />
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#10B981',
            }}
          >
            +{chartData[chartData.length - 1]}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          position: 'relative',
          height: `${chartHeight}px`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '10px 0',
        }}
      >
        {chartData.map((value, index) => {
          const height = (value / maxValue) * chartHeight;
          const isLast = index === chartData.length - 1;

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Value label */}
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: isLast ? colores.primario : colores.textoMedio,
                  opacity: isLast ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                }}
              >
                {value}%
              </div>

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${height}px`,
                  background: isLast
                    ? `linear-gradient(180deg, ${colores.primario} 0%, ${colores.secundario} 100%)`
                    : colores.fondoTerciario,
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.5s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Shine effect on last bar */}
                {isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shine 2s infinite',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid ${colores.borde}`,
        }}
      >
        <span style={{ fontSize: '11px', color: colores.textoMedio }}>-14s</span>
        <span style={{ fontSize: '11px', color: colores.textoMedio }}>-7s</span>
        <span style={{ fontSize: '11px', color: colores.primario, fontWeight: '600' }}>
          Ahora
        </span>
      </div>

      <style>
        {`
          @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
};
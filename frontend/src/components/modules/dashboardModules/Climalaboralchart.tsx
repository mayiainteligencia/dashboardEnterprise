import React from 'react';
import { Heart } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

export const ClimaLaboralChart: React.FC = () => {
  const { colores } = brandingConfig;

  // Datos: últimos 7 días, % de empleados con bienestar positivo
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const bienestar = [78, 75, 82, 79, 85, 88, 82];

  const maxValue = 100;
  const chartHeight = 160;

  // Calcular promedio
  const promedio = Math.round(bienestar.reduce((a, b) => a + b, 0) / bienestar.length);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Heart size={18} color={colores.primario} fill={`${colores.primario}40`} />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colores.textoClaro,
                margin: 0,
              }}
            >
              Clima Laboral
            </h3>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: colores.textoMedio,
              margin: 0,
            }}
          >
            Estado emocional de los últimos 7 días
          </p>
        </div>

        {/* Badge de promedio */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: `${colores.exito}20`,
            border: `1px solid ${colores.exito}40`,
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: colores.exito,
              lineHeight: '1',
            }}
          >
            {promedio}%
          </div>
          <div
            style={{
              fontSize: '10px',
              color: colores.exito,
              marginTop: '2px',
            }}
          >
            Promedio
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '12px' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${percent}%`,
              height: '1px',
              background: `${colores.borde}30`,
            }}
          />
        ))}

        {/* SVG para la línea */}
        <svg
          width="100%"
          height={chartHeight}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Área bajo la línea con gradiente */}
          <defs>
            <linearGradient id="areaGradientClima" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colores.exito} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colores.exito} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polygon
            points={`0,${chartHeight} ${bienestar
              .map((value, index) => {
                const x = (index / (bienestar.length - 1)) * 100;
                const y = chartHeight - (value / maxValue) * chartHeight;
                return `${x}%,${y}`;
              })
              .join(' ')} 100%,${chartHeight}`}
            fill="url(#areaGradientClima)"
          />

          {/* Línea principal */}
          <polyline
            points={bienestar
              .map((value, index) => {
                const x = (index / (bienestar.length - 1)) * 100;
                const y = chartHeight - (value / maxValue) * chartHeight;
                return `${x}%,${y}`;
              })
              .join(' ')}
            fill="none"
            stroke={colores.exito}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos en la línea */}
          {bienestar.map((value, index) => {
            const x = (index / (bienestar.length - 1)) * 100;
            const y = chartHeight - (value / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill={colores.exito}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Leyenda de días */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '10px',
          borderTop: `1px solid ${colores.borde}40`,
          marginBottom: '16px',
        }}
      >
        {dias.map((dia, index) => (
          <span
            key={dia}
            style={{
              fontSize: '11px',
              color: index === dias.length - 1 ? colores.exito : colores.textoMedio,
              fontWeight: index === dias.length - 1 ? '600' : '400',
            }}
          >
            {dia}
          </span>
        ))}
      </div>

      {/* Indicadores de estado */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}
      >
        <div
          style={{
            padding: '10px',
            borderRadius: '10px',
            background: `${colores.exito}15`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '700', color: colores.exito }}>72%</div>
          <div style={{ fontSize: '10px', color: colores.textoMedio, marginTop: '2px' }}>
            Satisfecho
          </div>
        </div>

        <div
          style={{
            padding: '10px',
            borderRadius: '10px',
            background: `${colores.advertencia}15`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '700', color: colores.advertencia }}>18%</div>
          <div style={{ fontSize: '10px', color: colores.textoMedio, marginTop: '2px' }}>
            Neutral
          </div>
        </div>

        <div
          style={{
            padding: '10px',
            borderRadius: '10px',
            background: `${colores.peligro}15`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '700', color: colores.peligro }}>10%</div>
          <div style={{ fontSize: '10px', color: colores.textoMedio, marginTop: '2px' }}>
            Bajo
          </div>
        </div>
      </div>
    </div>
  );
};
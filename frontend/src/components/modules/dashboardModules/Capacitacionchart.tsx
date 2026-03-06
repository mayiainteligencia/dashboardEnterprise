import React from 'react';
import { TrendingUp } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

export const CapacitacionChart: React.FC = () => {
  const { colores } = brandingConfig;

  // Datos: semanas y porcentaje de cursos completados
  const semanas = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];
  const completados = [45, 52, 58, 65, 73, 82];
  const objetivo = 85;

  const maxValue = 100;
  const chartHeight = 180;

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
          marginBottom: '24px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: colores.textoClaro,
              margin: '0 0 4px 0',
            }}
          >
            Progreso de Capacitación
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: colores.textoMedio,
              margin: 0,
            }}
          >
            Cursos completados vs objetivo
          </p>
        </div>

        {/* Indicador de tendencia */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: `${colores.exito}20`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <TrendingUp size={16} color={colores.exito} />
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colores.exito,
            }}
          >
            +82%
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '16px' }}>
        {/* Línea de objetivo */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(objetivo / maxValue) * 100}%`,
            height: '1px',
            background: colores.advertencia,
            opacity: 0.5,
            borderTop: `2px dashed ${colores.advertencia}`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: '8px',
              top: '-20px',
              fontSize: '11px',
              color: colores.advertencia,
              fontWeight: '600',
            }}
          >
            Objetivo {objetivo}%
          </span>
        </div>

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
          {/* Área bajo la línea */}
          <defs>
            <linearGradient id="areaGradientCapacitacion" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colores.primario} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polygon
            points={`0,${chartHeight} ${completados
              .map((value, index) => {
                const x = (index / (completados.length - 1)) * 100;
                const y = chartHeight - (value / maxValue) * chartHeight;
                return `${x}%,${y}`;
              })
              .join(' ')} 100%,${chartHeight}`}
            fill="url(#areaGradientCapacitacion)"
          />

          {/* Línea principal */}
          <polyline
            points={completados
              .map((value, index) => {
                const x = (index / (completados.length - 1)) * 100;
                const y = chartHeight - (value / maxValue) * chartHeight;
                return `${x}%,${y}`;
              })
              .join(' ')}
            fill="none"
            stroke={colores.primario}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos en la línea */}
          {completados.map((value, index) => {
            const x = (index / (completados.length - 1)) * 100;
            const y = chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="5"
                  fill={colores.primario}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Valor sobre el punto */}
                <text
                  x={`${x}%`}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={colores.textoClaro}
                >
                  {value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda de semanas */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: `1px solid ${colores.borde}40`,
        }}
      >
        {semanas.map((semana, index) => (
          <span
            key={semana}
            style={{
              fontSize: '11px',
              color: index === semanas.length - 1 ? colores.primario : colores.textoMedio,
              fontWeight: index === semanas.length - 1 ? '600' : '400',
            }}
          >
            {semana}
          </span>
        ))}
      </div>

      {/* Estadísticas rápidas */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colores.primario }}>82%</div>
          <div style={{ fontSize: '11px', color: colores.textoMedio }}>Actual</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colores.advertencia }}>85%</div>
          <div style={{ fontSize: '11px', color: colores.textoMedio }}>Objetivo</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colores.exito }}>+37%</div>
          <div style={{ fontSize: '11px', color: colores.textoMedio }}>Avance</div>
        </div>
      </div>
    </div>
  );
};
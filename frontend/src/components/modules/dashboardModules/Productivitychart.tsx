import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

export const ProductivityChart: React.FC = () => {
  const { colores } = brandingConfig;
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const sinIAData = [65, 68, 70, 72, 71, 73, 74, 75, 76, 78, 77, 79];
  const conIAData = [65, 70, 78, 85, 92, 98, 105, 112, 118, 125, 130, 138];

  const maxValue = 150;
  const incremento = Math.round(((conIAData[conIAData.length - 1] - sinIAData[sinIAData.length - 1]) / sinIAData[sinIAData.length - 1]) * 100);

  // Punto destacado (último mes)
  const highlightIndex = conIAData.length - 1;
  const highlightValue = conIAData[highlightIndex];

  return (
    <div
      ref={chartRef}
      style={{
        background: `linear-gradient(135deg, ${colores.fondoSecundario}dd 0%, ${colores.fondoTerciario}dd 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '28px',
        border: `1px solid ${colores.borde}40`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow decorativo de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-15%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${colores.primario}15 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header con controles */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colores.primario}20 0%, ${colores.acento}20 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={22} color={colores.primario} strokeWidth={2.5} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colores.textoClaro,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Impacto de IA en Productividad
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: colores.textoMedio,
                  margin: '4px 0 0 0',
                }}
              >
                Comparativa de rendimiento mensual
              </p>
            </div>
          </div>

          {/* Selector de período */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: colores.fondoTerciario,
              padding: '4px',
              borderRadius: '12px',
              border: `1px solid ${colores.borde}`,
            }}
          >
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedPeriod === period ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)` : 'transparent',
                  color: selectedPeriod === period ? 'white' : colores.textoMedio,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {period === 'monthly' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        {/* Badge de incremento destacado */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '10px',
            background: `${colores.exito}15`,
            border: `1px solid ${colores.exito}30`,
          }}
        >
          <Sparkles size={16} color={colores.exito} />
          <span
            style={{
              fontSize: '15px',
              fontWeight: '700',
              color: colores.exito,
            }}
          >
            +{incremento}% mejora
          </span>
        </div>
      </div>

      {/* Área de gráfica */}
      <div style={{ position: 'relative', height: '320px', marginBottom: '24px' }}>
        {/* Grid horizontal */}
        {[0, 50, 100, 150].map((value, idx) => (
          <div
            key={value}
            style={{
              position: 'absolute',
              left: '50px',
              right: 0,
              bottom: `${(value / maxValue) * 100}%`,
              height: '1px',
              background: idx === 0 ? 'transparent' : `${colores.borde}30`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '-50px',
                fontSize: '11px',
                color: colores.textoOscuro,
                fontWeight: '500',
                width: '40px',
                textAlign: 'right',
              }}
            >
              {value}%
            </span>
          </div>
        ))}

        {/* SVG Chart */}
        <svg
          width="100%"
          height="320"
          style={{ position: 'absolute', top: 0, left: '50px' }}
          viewBox="0 0 1000 320"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente para línea Con IA */}
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="1" />
              <stop offset="100%" stopColor={colores.acento} stopOpacity="1" />
            </linearGradient>

            {/* Gradiente para área bajo línea */}
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colores.primario} stopOpacity="0.02" />
            </linearGradient>

            {/* Filtro glow */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Gradiente para punto destacado */}
            <radialGradient id="highlightGlow">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colores.primario} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Área bajo curva Con IA */}
          <path
            d={`
              M 0,320
              ${conIAData.map((value, index) => {
                const x = (index / (meses.length - 1)) * 1000;
                const y = 320 - (value / maxValue) * 320;
                return `L ${x},${y}`;
              }).join(' ')}
              L 1000,320
              Z
            `}
            fill="url(#areaGradient)"
          />

          {/* Línea Sin IA (punteada) */}
          <path
            d={sinIAData.map((value, index) => {
              const x = (index / (meses.length - 1)) * 1000;
              const y = 320 - (value / maxValue) * 320;
              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')}
            stroke={colores.textoOscuro}
            strokeWidth="2"
            strokeDasharray="6,4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Línea Con IA (gradiente brillante) */}
          <path
            d={conIAData.map((value, index) => {
              const x = (index / (meses.length - 1)) * 1000;
              const y = 320 - (value / maxValue) * 320;
              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')}
            stroke="url(#lineGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Puntos en Sin IA */}
          {sinIAData.map((value, index) => {
            const x = (index / (meses.length - 1)) * 1000;
            const y = 320 - (value / maxValue) * 320;
            return (
              <circle
                key={`sin-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill={colores.fondoSecundario}
                stroke={colores.textoOscuro}
                strokeWidth="2"
              />
            );
          })}

          {/* Puntos en Con IA */}
          {conIAData.map((value, index) => {
            const x = (index / (meses.length - 1)) * 1000;
            const y = 320 - (value / maxValue) * 320;
            const isHighlight = index === highlightIndex;

            return (
              <g key={`con-${index}`}>
                {isHighlight && (
                  <>
                    {/* Círculo pulsante grande */}
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="url(#highlightGlow)"
                    >
                      <animate
                        attributeName="r"
                        values="16;24;16"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0;0.6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}
                
                {/* Punto principal */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlight ? "8" : "6"}
                  fill={colores.primario}
                  stroke="white"
                  strokeWidth={isHighlight ? "3" : "2"}
                  filter={isHighlight ? "url(#glow)" : "none"}
                />
              </g>
            );
          })}

          {/* Etiqueta del punto destacado */}
          {(() => {
            const x = (highlightIndex / (meses.length - 1)) * 1000;
            const y = 320 - (highlightValue / maxValue) * 320;
            return (
              <g>
                {/* Tooltip background */}
                <rect
                  x={x - 35}
                  y={y - 45}
                  width="70"
                  height="32"
                  rx="8"
                  fill={colores.primario}
                  filter="url(#glow)"
                />
                {/* Valor */}
                <text
                  x={x}
                  y={y - 24}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="white"
                >
                  {highlightValue}%
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Leyenda de meses */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '50px',
          paddingTop: '16px',
          borderTop: `1px solid ${colores.borde}30`,
          marginBottom: '20px',
        }}
      >
        {meses.map((mes, index) => (
          <span
            key={mes}
            style={{
              fontSize: '11px',
              color: index === highlightIndex ? colores.primario : colores.textoMedio,
              fontWeight: index === highlightIndex ? '700' : '500',
            }}
          >
            {mes}
          </span>
        ))}
      </div>

      {/* Leyendas */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              background: `linear-gradient(90deg, ${colores.primario}, ${colores.acento})`,
              borderRadius: '2px',
              boxShadow: `0 0 8px ${colores.primario}40`,
            }}
          />
          <span style={{ fontSize: '13px', color: colores.textoClaro, fontWeight: '600' }}>
            Con IA
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="40" height="4">
            <line
              x1="0"
              y1="2"
              x2="40"
              y2="2"
              stroke={colores.textoOscuro}
              strokeWidth="2"
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: '13px', color: colores.textoMedio, fontWeight: '500' }}>
            Sin IA
          </span>
        </div>
      </div>
    </div>
  );
};
import React, { useRef, useState, useEffect } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

export const ProductivityChart: React.FC = () => {
  const { colores } = brandingConfig;
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  // En móvil mostramos solo 6 meses para no saturar
  const mesesVisibles = isMobile ? ['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] : meses;
  const sinIAData = [65, 68, 70, 72, 71, 73, 74, 75, 76, 78, 77, 79];
  const conIAData = [65, 70, 78, 85, 92, 98, 105, 112, 118, 125, 130, 138];
  const sinIAMobile = [65, 70, 71, 74, 76, 77];
  const conIAMobile = [65, 78, 92, 105, 118, 130];

  const sinIA = isMobile ? sinIAMobile : sinIAData;
  const conIA = isMobile ? conIAMobile : conIAData;

  const maxValue = 150;
  const incremento = Math.round(((conIAData[conIAData.length - 1] - sinIAData[sinIAData.length - 1]) / sinIAData[sinIAData.length - 1]) * 100);
  const highlightIndex = conIA.length - 1;
  const highlightValue = conIA[highlightIndex];

  const chartHeight = isMobile ? 200 : 320;
  const paddingLeft = isMobile ? 36 : 50;

  return (
    <div
      ref={chartRef}
      style={{
        background: `linear-gradient(135deg, ${colores.fondoSecundario}dd 0%, ${colores.fondoTerciario}dd 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: isMobile ? '16px' : '28px',
        border: `1px solid ${colores.borde}40`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow decorativo */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-15%',
        width: '400px', height: '400px',
        background: `radial-gradient(circle, ${colores.primario}15 0%, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '16px' : '32px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: '10px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${colores.primario}20 0%, ${colores.acento}20 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <TrendingUp size={22} color={colores.primario} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: isMobile ? '15px' : '20px', fontWeight: '700', color: colores.textoClaro, margin: 0, lineHeight: 1 }}>
                Impacto de IA en Productividad
              </h3>
              <p style={{ fontSize: '13px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
                Comparativa de rendimiento mensual
              </p>
            </div>
          </div>

          {/* Selector de período */}
          <div style={{
            display: 'flex', gap: '8px',
            background: colores.fondoTerciario,
            padding: '4px', borderRadius: '12px',
            border: `1px solid ${colores.borde}`,
            flexShrink: 0,
          }}>
            {(['monthly', 'yearly'] as const).map((period) => (
              <button key={period} onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 16px',
                  borderRadius: '8px', border: 'none',
                  background: selectedPeriod === period
                    ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`
                    : 'transparent',
                  color: selectedPeriod === period ? 'white' : colores.textoMedio,
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {period === 'monthly' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '10px',
          background: `${colores.exito}15`, border: `1px solid ${colores.exito}30`,
        }}>
          <Sparkles size={16} color={colores.exito} />
          <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: colores.exito }}>
            +{incremento}% mejora
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '24px' }}>
        {[0, 50, 100, 150].map((value, idx) => (
          <div key={value} style={{
            position: 'absolute', left: `${paddingLeft}px`, right: 0,
            bottom: `${(value / maxValue) * 100}%`, height: '1px',
            background: idx === 0 ? 'transparent' : `${colores.borde}30`,
            display: 'flex', alignItems: 'center',
          }}>
            <span style={{
              position: 'absolute', left: `-${paddingLeft}px`,
              fontSize: isMobile ? '9px' : '11px', color: colores.textoOscuro, fontWeight: '500',
              width: `${paddingLeft - 4}px`, textAlign: 'right',
            }}>
              {value}%
            </span>
          </div>
        ))}

        <svg
          width="100%" height={chartHeight}
          style={{ position: 'absolute', top: 0, left: `${paddingLeft}px` }}
          viewBox={`0 0 1000 ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="1" />
              <stop offset="100%" stopColor={colores.acento} stopOpacity="1" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colores.primario} stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="highlightGlow">
              <stop offset="0%" stopColor={colores.primario} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colores.primario} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Área Con IA */}
          <path
            d={`M 0,${chartHeight} ${conIA.map((v, i) => `L ${(i / (conIA.length - 1)) * 1000},${chartHeight - (v / maxValue) * chartHeight}`).join(' ')} L 1000,${chartHeight} Z`}
            fill="url(#areaGradient)"
          />

          {/* Línea Sin IA */}
          <path
            d={sinIA.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sinIA.length - 1)) * 1000},${chartHeight - (v / maxValue) * chartHeight}`).join(' ')}
            stroke={colores.textoOscuro} strokeWidth="2" strokeDasharray="6,4" fill="none" strokeLinecap="round"
          />

          {/* Línea Con IA */}
          <path
            d={conIA.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (conIA.length - 1)) * 1000},${chartHeight - (v / maxValue) * chartHeight}`).join(' ')}
            stroke="url(#lineGradient)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
          />

          {/* Puntos Sin IA */}
          {sinIA.map((v, i) => {
            const x = (i / (sinIA.length - 1)) * 1000;
            const y = chartHeight - (v / maxValue) * chartHeight;
            return <circle key={`sin-${i}`} cx={x} cy={y} r={isMobile ? 5 : 4} fill={colores.fondoSecundario} stroke={colores.textoOscuro} strokeWidth="2" />;
          })}

          {/* Puntos Con IA */}
          {conIA.map((v, i) => {
            const x = (i / (conIA.length - 1)) * 1000;
            const y = chartHeight - (v / maxValue) * chartHeight;
            const isHL = i === highlightIndex;
            return (
              <g key={`con-${i}`}>
                {isHL && (
                  <circle cx={x} cy={y} r="16" fill="url(#highlightGlow)">
                    <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={x} cy={y} r={isHL ? (isMobile ? 10 : 8) : (isMobile ? 7 : 6)}
                  fill={colores.primario} stroke="white" strokeWidth={isHL ? 3 : 2} filter={isHL ? "url(#glow)" : "none"} />
              </g>
            );
          })}

          {/* Label punto destacado */}
          {(() => {
            const x = (highlightIndex / (conIA.length - 1)) * 1000;
            const y = chartHeight - (highlightValue / maxValue) * chartHeight;
            return (
              <g>
                <rect x={x - 35} y={y - 45} width="70" height="32" rx="8" fill={colores.primario} filter="url(#glow)" />
                <text x={x} y={y - 24} textAnchor="middle" fontSize="16" fontWeight="700" fill="white">{highlightValue}%</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Eje X meses */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingLeft: `${paddingLeft}px`, paddingTop: '16px',
        borderTop: `1px solid ${colores.borde}30`, marginBottom: '20px',
      }}>
        {mesesVisibles.map((mes, index) => (
          <span key={mes} style={{
            fontSize: isMobile ? '9px' : '11px',
            color: index === mesesVisibles.length - 1 ? colores.primario : colores.textoMedio,
            fontWeight: index === mesesVisibles.length - 1 ? '700' : '500',
          }}>
            {mes}
          </span>
        ))}
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '4px', background: `linear-gradient(90deg, ${colores.primario}, ${colores.acento})`, borderRadius: '2px', boxShadow: `0 0 8px ${colores.primario}40` }} />
          <span style={{ fontSize: '13px', color: colores.textoClaro, fontWeight: '600' }}>Con IA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="40" height="4">
            <line x1="0" y1="2" x2="40" y2="2" stroke={colores.textoOscuro} strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '13px', color: colores.textoMedio, fontWeight: '500' }}>Sin IA</span>
        </div>
      </div>
    </div>
  );
};
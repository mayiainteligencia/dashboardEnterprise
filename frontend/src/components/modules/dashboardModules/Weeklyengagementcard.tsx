import React from 'react';
import { brandingConfig } from '../../../config/branding';

interface WeeklyEngagementProps {
  data?: number[][];
}

export const WeeklyEngagementCard: React.FC<WeeklyEngagementProps> = ({ data }) => {
  const { colores } = brandingConfig;

  // Datos de ejemplo: 5 semanas x 7 días
  const defaultData = [
    [0.2, 0.5, 0.8, 0.9, 0.7, 0.4, 0.3], // Semana 1
    [0.4, 0.6, 0.5, 0.8, 0.9, 0.6, 0.2], // Semana 2
    [0.6, 0.7, 0.9, 0.8, 0.7, 0.5, 0.4], // Semana 3
    [0.5, 0.8, 0.6, 0.9, 0.8, 0.7, 0.3], // Semana 4
    [0.3, 0.6, 0.8, 0.7, 0.9, 0.6, 0.5], // Semana 5
  ];

  const engagementData = data || defaultData;
  const days = ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
  const weeks = ['FEB', 'F11', 'FKG', 'FKH', 'FK5'];

  const getColor = (intensity: number) => {
    if (intensity >= 0.8) return colores.primario; // Best
    if (intensity >= 0.6) return '#8B5CF6'; // High
    if (intensity >= 0.4) return '#6366F1'; // Medium
    return `${colores.textoMedio}40`; // Low
  };

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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" fill={colores.textoClaro} />
              <rect x="3" y="13" width="7" height="7" rx="1" fill={colores.textoClaro} opacity="0.5" />
              <rect x="13" y="3" width="7" height="7" rx="1" fill={colores.textoClaro} opacity="0.7" />
              <rect x="13" y="13" width="7" height="7" rx="1" fill={colores.textoClaro} opacity="0.3" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '500',
              color: colores.textoClaro,
              margin: 0,
            }}
          >
            Weekly Engagement
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
            borderRadius: '6px',
          }}
        >
          View all
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
          fontSize: '12px',
          color: colores.textoMedio,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: `${colores.textoMedio}40`,
            }}
          />
          Low
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: '#6366F1',
            }}
          />
          Medium
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: '#8B5CF6',
            }}
          />
          High
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: colores.primario,
            }}
          />
          Best
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Week labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            paddingTop: '20px',
          }}
        >
          {weeks.map((week) => (
            <div
              key={week}
              style={{
                fontSize: '11px',
                color: colores.textoMedio,
                height: '24px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {week}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {/* Day labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '6px',
              marginBottom: '6px',
            }}
          >
            {days.map((day) => (
              <div
                key={day}
                style={{
                  fontSize: '11px',
                  color: colores.textoMedio,
                  textAlign: 'center',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Cells */}
          {engagementData.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '6px',
                marginBottom: '6px',
              }}
            >
              {Array.from({ length: 12 }).map((_, dayIndex) => {
                const intensity = week[dayIndex % 7] || 0;
                return (
                  <div
                    key={dayIndex}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '6px',
                      background: getColor(intensity),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.opacity = '1';
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
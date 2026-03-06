import React from 'react';
import type { LucideProps } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ComponentType<LucideProps>;
  viewAllLink?: string;
  onViewAll?: () => void;
  gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  onViewAll,
  gradient,
}) => {
  const { colores } = brandingConfig;

  const changeColor = changeType === 'positive' ? '#10B981' : '#EF4444';

  return (
    <div
      style={{
        background: gradient || `linear-gradient(135deg, ${colores.fondoSecundario}dd 0%, ${colores.fondoTerciario}dd 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${colores.borde}40`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${colores.primario}30 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
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
            <Icon size={20} color={colores.textoClaro} />
          </div>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '500',
              color: colores.textoClaro,
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              background: 'none',
              border: 'none',
              color: colores.textoMedio,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${colores.fondoTerciario}60`;
              e.currentTarget.style.color = colores.textoClaro;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = colores.textoMedio;
            }}
          >
            View all
          </button>
        )}
      </div>

      {/* Value */}
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
          {value}
        </div>
      </div>

      {/* Subtitle and Change */}
      {(subtitle || change) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {subtitle && (
            <span
              style={{
                fontSize: '13px',
                color: colores.textoMedio,
              }}
            >
              {subtitle}
            </span>
          )}
          {change && (
            <span
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: changeColor,
              }}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
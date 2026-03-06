import React, { useRef, useState } from 'react';
import { MoreVertical, Users, Activity, Calendar, Info } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface MetricCardProps {
  title: string;
  value: number;
  icon: 'users' | 'activity';
  color: string;
  gradient: string;
  onSchedule: () => void;
  onInfo: () => void;
  showMenu: boolean;
  onMenuToggle: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
  subtitle?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  gradient,
  onSchedule,
  onInfo,
  showMenu,
  onMenuToggle,
  menuRef,
  subtitle,
  badge,
}) => {
  const { colores } = brandingConfig;

  const IconComponent = icon === 'users' ? Users : Activity;

  return (
    <div
      style={{
        background: gradient,
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Patrón de fondo decorativo */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(20px)',
        }}
      />

      {/* Header con menú */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
          position: 'relative',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={onMenuToggle}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            <MoreVertical size={18} color="white" />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: colores.fondoSecundario,
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '180px',
                zIndex: 1000,
                border: `1px solid ${colores.borde}`,
              }}
            >
              <button
                onClick={() => {
                  onSchedule();
                  onMenuToggle();
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: colores.textoClaro,
                  fontSize: '14px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colores.fondoTerciario;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                <Calendar size={16} />
                Agendar reunión
              </button>

              <button
                onClick={() => {
                  onInfo();
                  onMenuToggle();
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: colores.textoClaro,
                  fontSize: '14px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colores.fondoTerciario;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                <Info size={16} />
                Información
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Métrica principal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent size={28} color="white" />
        </div>

        <div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '1',
              marginBottom: '4px',
            }}
          >
            {value}
            {icon === 'activity' && '%'}
          </div>
          {badge && (
            <div
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
            >
              {badge}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
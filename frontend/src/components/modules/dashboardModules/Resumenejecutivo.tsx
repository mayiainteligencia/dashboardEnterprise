import React from 'react';
import { Users, BookOpen, Shield, DollarSign, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, change, changeType }) => {
  const { colores } = brandingConfig;

  const getChangeColor = () => {
    if (changeType === 'positive') return colores.exito;
    if (changeType === 'negative') return colores.peligro;
    return colores.textoMedio;
  };

  return (
    <div
      style={{
        background: colores.fondoTerciario,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${colores.borde}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${colores.primario}60`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colores.borde;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: `${colores.primario}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={colores.primario} />
        </div>

        {change && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: getChangeColor(),
            }}
          >
            {changeType === 'positive' && <TrendingUp size={14} />}
            {changeType === 'negative' && <TrendingDown size={14} />}
            {change}
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colores.textoClaro,
            lineHeight: '1',
            marginBottom: '6px',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: colores.textoMedio,
            fontWeight: '500',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const ResumenEjecutivo: React.FC = () => {
  const { colores, metricas } = brandingConfig;

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
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: colores.textoClaro,
            margin: '0 0 4px 0',
          }}
        >
          Resumen Ejecutivo
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: colores.textoMedio,
            margin: 0,
          }}
        >
          Estado general de la empresa
        </p>
      </div>

      {/* Métricas Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          icon={Users}
          label="Empleados Activos"
          value={metricas.empleados}
          change="+8.2%"
          changeType="positive"
        />

        <MetricCard
          icon={BookOpen}
          label="Cursos Completados"
          value="38"
          change="+15.3%"
          changeType="positive"
        />

        <MetricCard
          icon={Shield}
          label="Alertas Seguridad"
          value="2"
          change="-60%"
          changeType="positive"
        />

        <MetricCard
          icon={DollarSign}
          label="Ahorro Detectado IA"
          value="$15,000"
          change="+12.5%"
          changeType="positive"
        />

        <MetricCard
          icon={Heart}
          label="Clima Laboral"
          value="82%"
          change="+5.2%"
          changeType="positive"
        />
      </div>
    </div>
  );
};
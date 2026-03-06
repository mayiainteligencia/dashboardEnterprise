import React from 'react';
import { X } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface InfoModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  iconGradient: string;
  description: string;
  subtitle: string;
  features: string[];
}

export const InfoModal: React.FC<InfoModalProps> = ({
  show,
  onClose,
  title,
  icon: IconComponent,
  iconGradient,
  description,
  subtitle,
  features,
}) => {
  const { colores } = brandingConfig;

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colores.fondoSecundario,
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: colores.textoClaro,
              margin: 0,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colores.textoMedio,
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '16px',
            backgroundColor: colores.fondoTerciario,
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: iconGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <IconComponent size={32} color="white" />
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '14px',
              color: colores.textoClaro,
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            <strong>{description}</strong>
          </p>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '13px',
              color: colores.textoMedio,
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            {subtitle}
          </p>

          {/* Features */}
          <div
            style={{
              borderTop: `1px solid ${colores.borde}`,
              paddingTop: '12px',
              marginTop: '12px',
            }}
          >
            {features.map((feature, index) => (
              <p
                key={index}
                style={{
                  fontSize: '12px',
                  color: colores.textoMedio,
                  marginBottom: index < features.length - 1 ? '8px' : '0',
                }}
              >
                <strong style={{ color: colores.textoClaro }}>✓</strong> {feature}
              </p>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: iconGradient,
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
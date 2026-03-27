import React from 'react';
import { brandingConfig } from '../../../config/branding';

export const WelcomeHeader: React.FC = () => {
  const { empresa, colores } = brandingConfig;

  return (
    <div
      style={{
        marginBottom: '32px',
      }}
    >
      <h1
        style={{
          fontSize: '48px',
          fontWeight: '300',
          color: colores.textoClaro,
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}
      >
        Bienvenido a <span style={{ fontWeight: '600' }}>{empresa.nombre}!</span>
      </h1>
      <p
        style={{
          fontSize: '32px',
          fontWeight: '300',
          color: colores.textoMedio,
          margin: 0,
          letterSpacing: '-0.5px',
        }}
      >
        ¿Qué vamos a monitorear hoy?
      </p>
    </div>
  );
};
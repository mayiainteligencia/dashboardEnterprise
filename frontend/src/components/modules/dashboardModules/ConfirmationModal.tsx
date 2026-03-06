import React from 'react';
import { X, CheckCircle, Calendar, Clock } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import type { AppointmentData } from '../../../types/dashboard';

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  appointment: AppointmentData | null;
  title: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onClose,
  appointment,
  title,
}) => {
  const { colores } = brandingConfig;

  if (!show || !appointment) return null;

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
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono de éxito */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <CheckCircle size={48} color="white" />
        </div>

        {/* Título */}
        <h3
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: colores.textoClaro,
            marginBottom: '8px',
          }}
        >
          ¡Cita Confirmada!
        </h3>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '14px',
            color: colores.textoMedio,
            marginBottom: '24px',
          }}
        >
          Tu reunión con {title} ha sido agendada
        </p>

        {/* Detalles de la cita */}
        <div
          style={{
            backgroundColor: colores.fondoTerciario,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <Calendar size={20} color={colores.primario} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <p
                style={{
                  fontSize: '12px',
                  color: colores.textoMedio,
                  marginBottom: '4px',
                }}
              >
                Fecha
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: colores.textoClaro,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {appointment.date}
              </p>
            </div>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: colores.borde,
              marginBottom: '16px',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={20} color={colores.primario} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <p
                style={{
                  fontSize: '12px',
                  color: colores.textoMedio,
                  marginBottom: '4px',
                }}
              >
                Hora
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: colores.textoClaro,
                  fontWeight: '600',
                }}
              >
                {appointment.time} hrs
              </p>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <p
          style={{
            fontSize: '12px',
            color: colores.textoMedio,
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          Recibirás una notificación 15 minutos antes de tu reunión
        </p>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
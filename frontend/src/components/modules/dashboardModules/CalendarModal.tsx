import React from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import { getDaysInMonth, isDateDisabled, timeSlots } from '../../../utils/calendarUtils';

interface CalendarModalProps {
  show: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTime: string;
  currentMonth: Date;
  onDateSelect: (day: number) => void;
  onTimeSelect: (time: string) => void;
  onMonthChange: (increment: number) => void;
  onConfirm: () => void;
  title: string;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  show,
  onClose,
  selectedDate,
  selectedTime,
  currentMonth,
  onDateSelect,
  onTimeSelect,
  onMonthChange,
  onConfirm,
  title,
}) => {
  const { colores } = brandingConfig;

  if (!show) return null;

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: colores.textoClaro, 
            margin: 0 
          }}>
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

        {/* Navegación del mes */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: colores.fondoTerciario,
          borderRadius: '12px',
        }}>
          <button
            onClick={() => onMonthChange(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colores.textoClaro,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: colores.textoClaro,
            fontSize: '16px',
            fontWeight: '600',
          }}>
            <Calendar size={18} />
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          
          <button
            onClick={() => onMonthChange(1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colores.textoClaro,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendario */}
        <div style={{ marginBottom: '20px' }}>
          {/* Días de la semana */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px',
            marginBottom: '8px',
          }}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: colores.textoMedio,
                  fontWeight: '600',
                  padding: '8px 0',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px',
          }}>
            {Array.from({ length: startingDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const disabled = isDateDisabled(date);
              const isSelected = selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth.getMonth() &&
                selectedDate?.getFullYear() === currentMonth.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => !disabled && onDateSelect(day)}
                  disabled={disabled}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected 
                      ? colores.primario 
                      : disabled 
                      ? colores.fondoTerciario 
                      : colores.fondoSecundario,
                    color: isSelected 
                      ? 'white' 
                      : disabled 
                      ? colores.textoMedio 
                      : colores.textoClaro,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: isSelected ? '600' : '400',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled && !isSelected) {
                      e.currentTarget.style.backgroundColor = colores.fondoTerciario;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled && !isSelected) {
                      e.currentTarget.style.backgroundColor = colores.fondoSecundario;
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selección de hora */}
        {selectedDate && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px',
              color: colores.textoClaro,
              fontSize: '14px',
              fontWeight: '600',
            }}>
              <Clock size={16} />
              Selecciona una hora
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px',
            }}>
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: selectedTime === time 
                      ? colores.primario 
                      : colores.fondoTerciario,
                    color: selectedTime === time 
                      ? 'white' 
                      : colores.textoClaro,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: selectedTime === time ? '600' : '400',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = colores.fondoSecundario;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = colores.fondoTerciario;
                    }
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón confirmar */}
        <button
          onClick={onConfirm}
          disabled={!selectedDate || !selectedTime}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: selectedDate && selectedTime 
              ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)` 
              : colores.fondoTerciario,
            color: selectedDate && selectedTime 
              ? 'white' 
              : colores.textoMedio,
            fontSize: '15px',
            fontWeight: '600',
            cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
            opacity: selectedDate && selectedTime ? 1 : 0.5,
            transition: 'all 0.2s',
          }}
        >
          Confirmar Cita
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type?: 'cotizacion' | 'reunion' | 'otro';
}

export const MiniCalendarCard: React.FC = () => {
  const { colores } = brandingConfig;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Review Mid Test', time: '09:00 AM', attendees: 4, type: 'reunion' },
    { id: '2', title: 'Cotización Ciberseguridad', time: '14:30 PM', attendees: 2, type: 'cotizacion' },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventType, setNewEventType] = useState<'cotizacion' | 'reunion' | 'otro'>('reunion');

  const today = new Date();
  
  const isToday = (day: number) => {
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth();
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleCreateEvent = () => {
    if (newEventTitle && newEventTime) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventType === 'cotizacion' ? `Cotización ${newEventTitle}` : newEventTitle,
        time: newEventTime,
        attendees: 1,
        type: newEventType,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventType('reunion');
      setShowCreateModal(false);
    }
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'cotizacion':
        return colores.acento;
      case 'reunion':
        return colores.primario;
      default:
        return colores.textoMedio;
    }
  };

  return (
    <>
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
        {/* Header con fecha actual */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CalendarIcon size={18} color={colores.primario} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              Calendario
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0, textTransform: 'capitalize' }}>
            Hoy: {today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Navegación del mes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            style={{
              background: 'none',
              border: 'none',
              color: colores.textoClaro,
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <span style={{ fontSize: '14px', fontWeight: '600', color: colores.textoClaro }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            style={{
              background: 'none',
              border: 'none',
              color: colores.textoClaro,
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Días de la semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {days.map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '10px',
                color: colores.textoMedio,
                fontWeight: '600',
                padding: '4px 0',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const todayClass = isToday(day);

            return (
              <div
                key={day}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: todayClass ? '600' : '400',
                  color: todayClass ? 'white' : colores.textoClaro,
                  background: todayClass
                    ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`
                    : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!todayClass) {
                    e.currentTarget.style.background = `${colores.fondoTerciario}80`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!todayClass) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Eventos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: colores.fondoTerciario,
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: `3px solid ${getEventTypeColor(event.type)}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${colores.fondoTerciario}dd`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colores.fondoTerciario;
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600', color: colores.textoClaro }}>
                {event.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} color={colores.textoMedio} />
                  <span style={{ fontSize: '10px', color: colores.textoMedio }}>
                    {event.time}
                  </span>
                </div>
                {event.type && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '600',
                      color: getEventTypeColor(event.type),
                      textTransform: 'uppercase',
                    }}
                  >
                    {event.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botón crear evento */}
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`,
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Plus size={16} />
          Crear Evento
        </button>
      </div>

      {/* Modal Crear Evento */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
                Crear Evento
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colores.textoMedio,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tipo de evento */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: colores.textoClaro, display: 'block', marginBottom: '8px' }}>
                Tipo de Evento
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['reunion', 'cotizacion', 'otro'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewEventType(type as any)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${newEventType === type ? colores.primario : colores.borde}`,
                      background: newEventType === type ? `${colores.primario}20` : 'transparent',
                      color: newEventType === type ? colores.primario : colores.textoMedio,
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: colores.textoClaro, display: 'block', marginBottom: '8px' }}>
                {newEventType === 'cotizacion' ? 'Servicio' : 'Título'}
              </label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder={newEventType === 'cotizacion' ? 'Ej: Ciberseguridad' : 'Nombre del evento'}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${colores.borde}`,
                  background: colores.fondoTerciario,
                  color: colores.textoClaro,
                  fontSize: '13px',
                }}
              />
            </div>

            {/* Hora */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: colores.textoClaro, display: 'block', marginBottom: '8px' }}>
                Hora
              </label>
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${colores.borde}`,
                  background: colores.fondoTerciario,
                  color: colores.textoClaro,
                  fontSize: '13px',
                }}
              />
            </div>

            {/* Botón guardar */}
            <button
              onClick={handleCreateEvent}
              disabled={!newEventTitle || !newEventTime}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: newEventTitle && newEventTime
                  ? `linear-gradient(135deg, ${colores.primario} 0%, ${colores.secundario} 100%)`
                  : colores.fondoTerciario,
                color: newEventTitle && newEventTime ? 'white' : colores.textoMedio,
                fontSize: '14px',
                fontWeight: '600',
                cursor: newEventTitle && newEventTime ? 'pointer' : 'not-allowed',
                opacity: newEventTitle && newEventTime ? 1 : 0.5,
              }}
            >
              Guardar Evento
            </button>
          </div>
        </div>
      )}
    </>
  );
};
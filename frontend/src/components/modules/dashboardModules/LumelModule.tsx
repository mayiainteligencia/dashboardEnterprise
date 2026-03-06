import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, MoreVertical, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface LumelModuleProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableVideo?: boolean;
}

export const LumelModule: React.FC<LumelModuleProps> = ({ 
  videoStreamUrl, 
  apiEndpoint,
  enableVideo = false 
}) => {
  const { colores } = brandingConfig;
  
  const [sessionStatus, setSessionStatus] = useState<'disponible' | 'en-sesion' | 'ocupado'>('disponible');
  const [activeSessions, setActiveSessions] = useState(3);
  const [averageWaitTime, setAverageWaitTime] = useState(5);
  const [satisfactionScore, setSatisfactionScore] = useState(4.8);
  
  // Estados para el menú y modales
  const [showMenu, setShowMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{date: string, time: string} | null>(null);
  
  // Estado para frases rotativas
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Frases motivacionales sobre bienestar emocional
  const wellnessIdeas = [
    "Tu bienestar importa 💜",
    "Pausas = Energía ⚡",
    "Hablar ayuda 💜",
    "Cuida tu mente 💜",
    "Respira profundo 💜",
    "No estás solo 💜",
    "Progresa a tu ritmo 💜",
  ];

  // Rotación automática de frases cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => 
        (prevIndex + 1) % wellnessIdeas.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (apiEndpoint) {
      // TODO: Conectar con API real en el futuro
    }
  }, [apiEndpoint]);

  // Funciones del calendario
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(selected)) {
      setSelectedDate(selected);
    }
  };

  const handleScheduleConfirm = () => {
    if (selectedDate && selectedTime) {
      setConfirmedAppointment({
        date: selectedDate.toLocaleDateString('es-MX', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: selectedTime
      });
      setShowCalendar(false);
      setShowConfirmation(true);
      setSelectedDate(null);
      setSelectedTime('');
      setShowMenu(false);
    }
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div
      style={{
        backgroundColor: colores.fondoSecundario,
        borderRadius: '24px',
        border: `1px solid ${colores.borde}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              LUMEL
            </h3>
            <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0 }}>
              Agente de Acompañamiento Emocional
            </p>
          </div>
        </div>
        
        {/* Botón de menú con dropdown */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}
          >
            <MoreVertical size={20} />
          </button>
          
          {/* Menú desplegable */}
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: colores.fondoSecundario,
                border: `1px solid ${colores.borde}`,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => {
                  setShowCalendar(true);
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: colores.textoClaro,
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colores.fondoTerciario}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Agendar Reunión para Cotización
              </button>
              
              <button
                onClick={() => {
                  setShowInfo(true);
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: colores.textoClaro,
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colores.fondoTerciario}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Más Información
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Área principal - Video o contenido estático */}
      <div 
        style={{
          flex: 1,
          backgroundColor: colores.fondoTerciario,
          borderRadius: '16px',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {enableVideo ? (
          <video 
            src={videoStreamUrl || "/assets/LumelVideo.mp4"}
            autoPlay 
            muted 
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              const container = video.parentElement;
              if (container) {
                container.innerHTML = `
                  <div style="
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center; 
                    height: 100%; 
                    color: ${colores.textoMedio};
                    background: linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario}), 
                                linear-gradient(45deg, ${colores.fondoTerciario} 25%, transparent 25%, transparent 75%, ${colores.fondoTerciario} 75%, ${colores.fondoTerciario});
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                  ">
                    <svg width="64" height="64" fill="${colores.textoMedio}">
                      <path d="M32 8c13.255 0 24 10.745 24 24s-10.745 24-24 24S8 45.255 8 32 18.745 8 32 8m0-4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 34c-6.627 0-12-5.373-12-12 0-1.657 1.343-3 3-3h18c1.657 0 3 1.343 3 3 0 6.627-5.373 12-12 12z"/>
                    </svg>
                    <p style="margin-top: 16px; font-size: 14px;">Video no disponible</p>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: colores.fondoTerciario,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
          }}>
            {/* Contenido estático aquí */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Heart size={28} color="white" />
              </div>
              <p style={{ color: colores.textoClaro, fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                LUMEL
              </p>
              <p style={{ color: colores.textoMedio, fontSize: '12px' }}>
                Agente de Acompañamiento Emocional
              </p>
            </div>
          </div>
        )}

        {/* Marco con frases motivacionales - NUEVO */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '16px',
          maxWidth: '200px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '10px 16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.5s ease',
          animation: 'fadeIn 0.5s ease',
        }}>
          <p style={{
            color: '#FFFFFF',
            fontSize: '11px',
            lineHeight: '1.4',
            margin: 0,
            textAlign: 'center',
            fontWeight: '500',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            {wellnessIdeas[currentPhraseIndex]}
          </p>
          
          {/* Indicadores de progreso */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            marginTop: '8px',
          }}>
            {wellnessIdeas.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: index === currentPhraseIndex ? '#EC4899' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Elementos superpuestos que deben mostrarse sobre el video/contenido estático */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '20px',
          pointerEvents: 'none',
        }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: sessionStatus === 'disponible' ? '#10B981' : '#F59E0B',
              pointerEvents: 'auto',
            }}
          >
            <div 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: '700',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {sessionStatus === 'disponible' ? 'Disponible' : 'En Sesión'}
            </span>
          </div>
        </div>

        <button
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          title="Iniciar conversación"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
          }}
        >
          <MessageCircle size={22} />
        </button>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>
            {activeSessions}
          </p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Acompañamientos
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
            {averageWaitTime}min
          </p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Respuesta Promedio
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EC4899', margin: 0 }}>
            {satisfactionScore}★
          </p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Bienestar
          </p>
        </div>
      </div>

      {/* Modal de Calendario */}
      {showCalendar && (
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
          onClick={() => setShowCalendar(false)}
        >
          <div
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
                Agendar Reunión
              </h3>
              <button
                onClick={() => setShowCalendar(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => changeMonth(-1)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colores.textoClaro,
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', color: colores.textoClaro }}>
                {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => changeMonth(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colores.textoClaro,
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Calendario */}
            <div style={{ marginBottom: '20px' }}>
              {/* Días de la semana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colores.textoMedio }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                  const days = [];
                  
                  // Espacios vacíos antes del primer día
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} />);
                  }
                  
                  // Días del mes
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isDisabled = isDateDisabled(date);
                    const isSelected = selectedDate?.getDate() === day && 
                                      selectedDate?.getMonth() === currentMonth.getMonth() &&
                                      selectedDate?.getFullYear() === currentMonth.getFullYear();
                    
                    days.push(
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                          color: isDisabled ? colores.textoMedio : isSelected ? 'white' : colores.textoClaro,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          opacity: isDisabled ? 0.4 : 1,
                        }}
                      >
                        {day}
                      </button>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Selección de hora */}
            {selectedDate && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: colores.textoClaro, marginBottom: '12px' }}>
                  Selecciona una hora:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: `1px solid ${colores.borde}`,
                        backgroundColor: selectedTime === time ? '#8B5CF6' : 'transparent',
                        color: selectedTime === time ? 'white' : colores.textoClaro,
                        cursor: 'pointer',
                        fontSize: '13px',
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
              onClick={handleScheduleConfirm}
              disabled={!selectedDate || !selectedTime}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: (!selectedDate || !selectedTime) ? colores.textoMedio : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
                opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
              }}
            >
              Confirmar Reunión
            </button>
          </div>
        </div>
      )}

      {/* Modal de Información */}
      {showInfo && (
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
          onClick={() => setShowInfo(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
                Acerca de LUMEL
              </h3>
              <button
                onClick={() => setShowInfo(false)}
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

            <div style={{ 
              padding: '16px',
              backgroundColor: colores.fondoTerciario,
              borderRadius: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <Heart size={32} color="white" />
              </div>
              
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>LUMEL</strong> es tu agente de acompañamiento emocional disponible 24/7.
              </p>
              
              <p style={{ fontSize: '13px', color: colores.textoMedio, lineHeight: '1.6', marginBottom: '12px' }}>
                Ofrecemos apoyo emocional personalizado mediante inteligencia artificial especializada en bienestar mental y prevención del burnout.
              </p>

              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px', marginTop: '12px' }}>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Acompañamiento confidencial
                </p>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Disponibilidad inmediata
                </p>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Técnicas de bienestar emocional
                </p>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '0' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Prevención de burnout
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
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
      )}

      {/* Modal de Confirmación de Cita */}
      {showConfirmation && confirmedAppointment && (
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
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setShowConfirmation(false)}
        >
          <div
            style={{
              backgroundColor: colores.fondoSecundario,
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icono de confirmación */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colores.textoClaro, margin: '0 0 12px 0' }}>
              ¡Reunión Agendada!
            </h3>

            <p style={{ fontSize: '14px', color: colores.textoMedio, marginBottom: '24px', lineHeight: '1.5' }}>
              Tu reunión para cotización ha sido confirmada exitosamente
            </p>

            {/* Detalles de la cita */}
            <div style={{
              backgroundColor: colores.fondoTerciario,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: `1px solid ${colores.borde}`,
            }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fecha
                </p>
                <p style={{ fontSize: '15px', color: colores.textoClaro, margin: 0, fontWeight: '600' }}>
                  {confirmedAppointment.date}
                </p>
              </div>
              
              <div style={{
                height: '1px',
                backgroundColor: colores.borde,
                margin: '12px 0',
              }} />

              <div>
                <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Hora
                </p>
                <p style={{ fontSize: '15px', color: colores.textoClaro, margin: 0, fontWeight: '600' }}>
                  {confirmedAppointment.time}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '20px', lineHeight: '1.5' }}>
              Recibirás un correo de confirmación con los detalles de la reunión
            </p>

            <button
              onClick={() => setShowConfirmation(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Perfecto, gracias
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
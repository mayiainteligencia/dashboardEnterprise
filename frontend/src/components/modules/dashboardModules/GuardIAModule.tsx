import React, { useState, useEffect, useRef } from 'react';
import { Camera, Shield, AlertTriangle, CheckCircle, Eye, EyeOff, MoreVertical, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface GuardIAModuleProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableLiveVideo?: boolean;
}

export const GuardIAModule: React.FC<GuardIAModuleProps> = ({ 
  videoStreamUrl, 
  apiEndpoint,
  enableLiveVideo = false 
}) => {
  const { colores } = brandingConfig;
  
  const [alertas, setAlertas] = useState(2);
  const [camarasActivas, setCamarasActivas] = useState(8);
  const [precisionIA, setPrecisionIA] = useState(98);
  const [deteccionesHoy, setDeteccionesHoy] = useState(24);
  
  // Estados para el menú y modales
  const [showMenu, setShowMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{date: string, time: string} | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (videoRef.current) {
      if (cameraEnabled) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
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
              background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              GuardIA
            </h3>
            <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0 }}>
              Seguridad Inteligente con IA
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

      {/* Área principal - Video */}
      <div 
        style={{
          flex: 1,
          backgroundColor: colores.fondoTerciario,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '200px',
          overflow: 'hidden',
        }}
      >
        {enableLiveVideo && videoStreamUrl ? (
          /* Stream en vivo desde API */
          <video 
            ref={videoRef}
            src={videoStreamUrl}
            autoPlay 
            muted 
            loop
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
              filter: cameraEnabled ? 'none' : 'blur(10px) brightness(0.5)',
              transition: 'filter 0.3s ease',
            }}
          />
        ) : (
          /* Video demo estático */
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
              filter: cameraEnabled ? 'none' : 'blur(10px) brightness(0.5)',
              transition: 'filter 0.3s ease',
            }}
            onError={(e) => {
              console.error('Error cargando video:', e);
            }}
          >
            <source src="/assets/guardIA.mp4" type="video/mp4" />
            <source src="/assets/guardIA.mov" type="video/quicktime" />
            <source src="/assets/guardIA.webm" type="video/webm" />
            Tu navegador no soporta video HTML5.
          </video>
        )}

        {/* Mensaje cuando la cámara está deshabilitada */}
        {!cameraEnabled && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#FFFFFF',
            zIndex: 5,
          }}>
            <EyeOff size={48} style={{ marginBottom: '12px', opacity: 0.8 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Cámara Deshabilitada</p>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '4px 0 0 0' }}>Haz clic en el botón para reactivar</p>
          </div>
        )}

        {/* Overlay con información */}
        {cameraEnabled && (
          <>
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {/* Badge de cámara activa */}
              <div 
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}
              >
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                EN VIVO
              </div>

              {/* Badge de ubicación */}
              <div 
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '12px',
                  color: '#FFFFFF',
                }}
              >
                📍 Cámara 1 - Producción
              </div>
            </div>

            {/* Alertas en la esquina superior derecha */}
            {alertas > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                <AlertTriangle size={16} />
                {alertas} Alertas
              </div>
            )}
          </>
        )}

        {/* Controles de video */}
        <div 
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={toggleCamera}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: cameraEnabled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(239, 68, 68, 0.9)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
            }}
            title={cameraEnabled ? "Deshabilitar cámara" : "Habilitar cámara"}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {cameraEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
            {camarasActivas}
          </p>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Cámaras Activas
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: colores.acento, margin: 0 }}>
            {precisionIA}%
          </p>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Precisión
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: colores.primario, margin: 0 }}>
            {deteccionesHoy}
          </p>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 0' }}>
            Detecciones Hoy
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
                          backgroundColor: isSelected ? colores.primario : 'transparent',
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
                        backgroundColor: selectedTime === time ? colores.primario : 'transparent',
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
                background: (!selectedDate || !selectedTime) ? colores.textoMedio : `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
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
                Acerca de GuardIA
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
                background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <Shield size={32} color="white" />
              </div>
              
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>GuardIA</strong> es tu sistema de seguridad inteligente impulsado por inteligencia artificial.
              </p>
              
              <p style={{ fontSize: '13px', color: colores.textoMedio, lineHeight: '1.6', marginBottom: '12px' }}>
                Monitoreo en tiempo real con detección automática de amenazas y alertas instantáneas.
              </p>

              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px', marginTop: '12px' }}>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Detección inteligente de amenazas
                </p>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Alertas en tiempo real
                </p>
                <p style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '0' }}>
                  <strong style={{ color: colores.textoClaro }}>✓</strong> Análisis de video con IA
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
                background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
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
                background: `linear-gradient(135deg, ${colores.primario} 100%, ${colores.secundario} 100%)`,
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
          50% { opacity: 0.7; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
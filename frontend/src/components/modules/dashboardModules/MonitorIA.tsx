import React, { useState, useEffect, useRef } from 'react';
import { Radio, Shield, AlertTriangle, CheckCircle, MoreVertical, X, ChevronLeft, ChevronRight, Volume2, VolumeX, Mic, Wifi, WifiOff } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface MonitorIAProps {
  apiEndpoint?: string;
}

// Radios - configuración DEMO (archivos locales)
const RADIOS_DEMO = [
  {
    id: 'exa',
    nombre: 'EXA FM',
    frecuencia: '90.9 FM',
    audio: '/assets/exa.mp3',
    logo: '/assets/exaLogo.jpeg',
    color: '#E62463',
  },
  {
    id: 'lamejor',
    nombre: 'La Mejor',
    frecuencia: '100.3 FM',
    audio: '/assets/lamejor.mp3',
    logo: '/assets/lamejorLogo.jpeg',
    color: '#705091',
  },
  {
    id: 'mvs',
    nombre: 'MVS Radio',
    frecuencia: '102.5 FM',
    audio: '/assets/mvs.mp3',
    logo: '/assets/mvsRadioLogo.png',
    color: '#F8CB0C',
  },
];

// Radios - configuración LIVE (iframes de emisoras.com.mx)
const RADIOS_LIVE = [
  {
    id: 'exa',
    nombre: 'EXA FM',
    frecuencia: '104.9 FM',
    audio: '', // No usamos audio directo, usamos iframe
    embedUrl: 'https://emisoras.com.mx/embed/exa-104-9', // URL del embed
    streamPage: 'https://emisoras.com.mx/#exa-104-9',
    logo: '/assets/exaLogo.jpeg',
    color: '#E62463',
    useEmbed: true,
  },
  {
    id: 'lamejor',
    nombre: 'La Mejor',
    frecuencia: '100.3 FM',
    audio: '',
    embedUrl: 'https://emisoras.com.mx/embed/la-mejor-ciudad-de-mexico',
    streamPage: 'https://emisoras.com.mx/#la-mejor-ciudad-de-mexico',
    logo: '/assets/lamejorLogo.jpeg',
    color: '#705091',
    useEmbed: true,
  },
  {
    id: 'mvs',
    nombre: 'MVS Radio',
    frecuencia: '102.5 FM',
    audio: '',
    embedUrl: 'https://emisoras.com.mx/embed/mvs-df',
    streamPage: 'https://emisoras.com.mx/#mvs-df',
    logo: '/assets/mvsRadioLogo.png',
    color: '#F8CB0C',
    useEmbed: true,
  },
];

// Palabras clave detectadas - DEMO (estático)
const PALABRAS_CLAVE_DEMO: Record<string, { palabra: string; marca: string; tiempo: string; confianza: number }[]> = {
  exa: [
    { palabra: 'Coca-Cola', marca: 'Coca-Cola', tiempo: '08:14', confianza: 97 },
    { palabra: 'Telcel', marca: 'Telcel', tiempo: '08:32', confianza: 94 },
  ],
  lamejor: [
    { palabra: 'Bimbo', marca: 'Grupo Bimbo', tiempo: '09:05', confianza: 98 },
  ],
  mvs: [
    { palabra: 'OXXO', marca: 'OXXO', tiempo: '07:58', confianza: 91 },
    { palabra: 'Elektra', marca: 'Grupo Elektra', tiempo: '08:45', confianza: 89 },
    { palabra: 'Soriana', marca: 'Soriana', tiempo: '09:10', confianza: 95 },
  ],
};

export const MonitorIAModule: React.FC<MonitorIAProps> = ({ apiEndpoint }) => {
  const { colores } = brandingConfig;

  // Estado para modo LIVE vs DEMO
  const [modoLive, setModoLive] = useState(false);
  const [deteccionesLive, setDeteccionesLive] = useState<Record<string, any[]>>({});

  const [radioActiva, setRadioActiva] = useState<string>('exa');
  const [reproduciendo, setReproduciendo] = useState(false);
  const [volumen, setVolumen] = useState(0.8);
  const [mutedo, setMutedo] = useState(false);
  const [barras, setBarras] = useState<number[]>(Array(24).fill(4));

  // Estados para menú y modales
  const [showMenu, setShowMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{ date: string; time: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Seleccionar datos según el modo
  const RADIOS = modoLive ? RADIOS_LIVE : RADIOS_DEMO;
  const PALABRAS_CLAVE = modoLive ? deteccionesLive : PALABRAS_CLAVE_DEMO;

  const radioInfo = RADIOS.find(r => r.id === radioActiva)!;
  const detecciones = PALABRAS_CLAVE[radioActiva] || [];

  // ----- Polling API en modo LIVE -----
  useEffect(() => {
    if (!modoLive || !apiEndpoint) return;

    const fetchDetecciones = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/detecciones`);
        const data = await response.json();
        setDeteccionesLive(data);
      } catch (error) {
        console.error('Error fetching live detections:', error);
      }
    };

    // Fetch inicial
    fetchDetecciones();

    // Polling cada 5 segundos
    const interval = setInterval(fetchDetecciones, 5000);

    return () => clearInterval(interval);
  }, [modoLive, apiEndpoint]);

  // ----- Handler para cambiar modo -----
  const toggleModo = () => {
    setModoLive(!modoLive);
    // Pausar audio al cambiar modo
    if (reproduciendo) {
      setReproduciendo(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // ----- Animación de ondas de sonido (simulada) -----
  useEffect(() => {
    if (!reproduciendo) {
      setBarras(Array(24).fill(4));
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animar = () => {
      setBarras(prev =>
        prev.map(() => Math.floor(Math.random() * 36) + 4)
      );
      animFrameRef.current = requestAnimationFrame(() => {
        setTimeout(animar, 80);
      });
    };

    animar();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reproduciendo]);

  // ----- Cargar nuevo audio al cambiar radio -----
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (reproduciendo) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [radioActiva]);

  // ----- Volumen -----
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mutedo ? 0 : volumen;
    }
  }, [volumen, mutedo]);

  // ----- Cerrar menú al hacer clic fuera -----
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const toggleReproducir = () => {
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current.play().catch(() => {});
      setReproduciendo(true);
    }
  };

  const cambiarRadio = (id: string) => {
    setRadioActiva(id);
  };

  // ----- Calendario helpers -----
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const changeMonth = (inc: number) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1));

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(selected)) setSelectedDate(selected);
  };

  const handleScheduleConfirm = () => {
    if (selectedDate && selectedTime) {
      setConfirmedAppointment({
        date: selectedDate.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: selectedTime,
      });
      setShowCalendar(false);
      setShowConfirmation(true);
      setSelectedDate(null);
      setSelectedTime('');
      setShowMenu(false);
    }
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  // ----- Render -----
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
      {/* Audio/Iframe player oculto */}
      {modoLive && (radioInfo as any).useEmbed ? (
        /* Modo LIVE: iframe embebido de emisoras.com.mx */
        <iframe
          key={radioActiva}
          src={(radioInfo as any).embedUrl}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
          }}
          allow="autoplay"
          title={`${radioInfo.nombre} Live Stream`}
        />
      ) : (
        /* Modo DEMO: audio element normal */
        <audio ref={audioRef} loop>
          <source src={radioInfo.audio} type="audio/mpeg" />
        </audio>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/monitorIALogo.jpeg"
              alt="MonitorIA"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
              MonitorIA
            </h3>
            <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0 }}>
              Monitoreo de radio con IA
            </p>
          </div>
        </div>

        {/* Toggle DEMO / LIVE + Menú */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Toggle Switch */}
          <button
            onClick={toggleModo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1.5px solid ${modoLive ? colores.exito ?? '#10B981' : colores.borde}`,
              background: modoLive 
                ? `${colores.exito ?? '#10B981'}18`
                : colores.fondoTerciario,
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '11px',
              fontWeight: '600',
              color: modoLive ? colores.exito ?? '#10B981' : colores.textoMedio,
            }}
            title={modoLive ? 'Cambiar a modo DEMO' : 'Cambiar a modo LIVE'}
          >
            {modoLive ? <Wifi size={14} /> : <WifiOff size={14} />}
            {modoLive ? 'LIVE' : 'DEMO'}
          </button>

          {/* Menú ⋮ */}
          <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}
          >
            <MoreVertical size={20} />
          </button>

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
              {[
                { label: 'Agendar Reunión para Cotización', action: () => { setShowCalendar(true); setShowMenu(false); } },
                { label: 'Más Información', action: () => { setShowInfo(true); setShowMenu(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
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
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ── Selector de radios — grid compacto scrolleable ── */}
      <div
        style={{
          maxHeight: '112px',
          overflowY: 'auto',
          marginBottom: '12px',
          paddingRight: '4px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${colores.borde} transparent`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '5px',
          }}
        >
          {RADIOS.map(radio => {
            const isActive = radioActiva === radio.id;
            return (
              <button
                key={radio.id}
                onClick={() => cambiarRadio(radio.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 8px',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? radio.color + '66' : colores.borde}`,
                  background: isActive ? `${radio.color}14` : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%',
                  minWidth: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = colores.fondoTerciario; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Logo cuadrado pequeño */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: isActive ? `1.5px solid ${radio.color}99` : '1.5px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <img
                    src={radio.logo}
                    alt={radio.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Texto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: '600',
                    color: isActive ? colores.textoClaro : colores.textoMedio,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.2',
                  }}>
                    {radio.nombre}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: isActive ? radio.color : colores.textoOscuro,
                    lineHeight: '1.2',
                  }}>
                    {radio.frecuencia}
                  </p>
                </div>

                {/* Dot activo */}
                {isActive && (
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: radio.color,
                    flexShrink: 0,
                    animation: reproduciendo ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Área principal del reproductor ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#0F0F14',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '140px',
          overflow: 'hidden',
          padding: '14px 16px',
        }}
      >
        {/* Fondo con color de la radio activa */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 120%, ${radioInfo.color}22 0%, transparent 70%)`,
            transition: 'background 0.6s ease',
          }}
        />

        {/* Badges — columna izquierda para no encimarlos */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 10,
          }}
        >
          {/* Badge modo LIVE/DEMO */}
          <div
            style={{
              padding: '4px 9px',
              borderRadius: '20px',
              backgroundColor: modoLive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              border: modoLive ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '9px',
              color: '#FFFFFF',
              fontWeight: '700',
              width: 'fit-content',
              letterSpacing: '0.5px',
            }}
          >
            {modoLive ? <Wifi size={9} /> : <WifiOff size={9} />}
            {modoLive ? 'MODO LIVE' : 'MODO DEMO'}
          </div>

          {/* Badge playing status */}
          <div
            style={{
              padding: '4px 9px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10px',
              color: '#FFFFFF',
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: reproduciendo ? '#10B981' : '#6B7280',
                animation: reproduciendo ? 'pulse 2s ease-in-out infinite' : 'none',
                flexShrink: 0,
              }}
            />
            {reproduciendo ? 'EN VIVO' : 'PAUSADO'}
          </div>

          {detecciones.length > 0 && (
            <div
              style={{
                padding: '4px 9px',
                borderRadius: '20px',
                backgroundColor: 'rgba(230, 36, 99, 0.88)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '10px',
                color: '#FFFFFF',
                fontWeight: 'bold',
                animation: 'pulse 2s ease-in-out infinite',
                width: 'fit-content',
              }}
            >
              <AlertTriangle size={10} />
              {detecciones.length} Mención{detecciones.length !== 1 ? 'es' : ''}
            </div>
          )}
        </div>

        {/* ── Miniaturas 3D de las 3 radios ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px',
            position: 'relative',
            zIndex: 2,
            perspective: '600px',
            perspectiveOrigin: 'center center',
            height: '46px',
            paddingTop: '6px',
          }}
        >
          {RADIOS.map((radio, index) => {
            const activeIndex = RADIOS.findIndex(r => r.id === radioActiva);
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            // Efecto 3D: los de los lados se van para atrás
            const translateX = offset * 52;
            const translateZ = isActive ? 0 : -60 * absOffset;
            const scale = isActive ? 1 : 0.78;
            const rotateY = isActive ? 0 : offset * -18;

            return (
              <div
                key={radio.id}
                onClick={() => cambiarRadio(radio.id)}
                style={{
                  position: 'absolute',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: isActive ? `2px solid ${radio.color}` : '2px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 0 18px ${radio.color}66` : 'none',
                  opacity: isActive ? 1 : 0.45,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transformStyle: 'preserve-3d',
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  zIndex: isActive ? 10 : 5 - absOffset,
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={radio.logo}
                  alt={radio.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Visualizador de barras ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            height: '32px',
            marginBottom: '12px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {barras.map((h, i) => (
            <div
              key={i}
              style={{
                width: '5px',
                height: `${h}px`,
                borderRadius: '3px',
                backgroundColor: radioInfo.color,
                opacity: reproduciendo ? 0.85 : 0.25,
                transition: 'height 0.08s ease',
              }}
            />
          ))}
        </div>

        {/* ── Controles ── */}
        {modoLive && (radioInfo as any).useEmbed ? (
          /* En modo LIVE con iframe, mostrar mensaje */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              zIndex: 2,
              padding: '12px 20px',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ 
              fontSize: '11px', 
              color: 'rgba(255,255,255,0.7)', 
              margin: 0, 
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Modo LIVE activo
            </p>
            <a
              href="https://mvs-ia.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: colores.exito ?? '#10B981',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ¿Gustas analizarla? Ve a MonitorIA →
            </a>
          </div>
        ) : (
          /* Modo DEMO: controles normales */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              position: 'relative',
              zIndex: 2,
            }}
          >
          {/* Botón mute */}
          <button
            onClick={() => setMutedo(!mutedo)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            title={mutedo ? 'Activar sonido' : 'Silenciar'}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          >
            {mutedo ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Botón play / pause */}
          <button
            onClick={toggleReproducir}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: 'none',
              background: `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})`,
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px ${colores.primario}55`,
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {reproduciendo ? (
              /* Pause icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              /* Play icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Slider de volumen */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mutedo ? 0 : volumen}
            onChange={e => {
              setVolumen(Number(e.target.value));
              if (mutedo) setMutedo(false);
            }}
            style={{ width: '70px', accentColor: colores.primario, cursor: 'pointer' }}
          />
          </div>
        )}
      </div>



      {/* ── Menciones detectadas ── */}
      {detecciones.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoMedio, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Menciones · {radioInfo.nombre}
          </p>
          <div
            style={{
              maxHeight: '112px',
              overflowY: 'auto',
              paddingRight: '4px',
              scrollbarWidth: 'thin',
              scrollbarColor: `${colores.borde} transparent`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
              {detecciones.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '5px 8px',
                    backgroundColor: colores.fondoTerciario,
                    borderRadius: '8px',
                    border: `1px solid ${colores.borde}`,
                    minWidth: 0,
                  }}
                >
                  {/* Ícono mic pequeño */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: `${colores.primario}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Mic size={11} color={colores.primario} />
                  </div>

                  {/* Texto */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: colores.textoClaro, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>
                      {d.palabra}
                    </p>
                    <p style={{ fontSize: '10px', color: colores.textoMedio, margin: 0, lineHeight: '1.2' }}>
                      {d.tiempo}
                    </p>
                  </div>

                  {/* % confianza */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    flexShrink: 0,
                  }}>
                    <CheckCircle size={10} color={colores.exito ?? '#10B981'} />
                    <span style={{ fontSize: '10px', fontWeight: '600', color: colores.exito ?? '#10B981' }}>
                      {d.confianza}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODALES ══════════════ */}

      {/* Modal Calendario */}
      {showCalendar && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.3s ease' }}
          onClick={() => setShowCalendar(false)}
        >
          <div
            style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', animation: 'slideUp 0.3s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Agendar Reunión</h3>
              <button onClick={() => setShowCalendar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoClaro }}><ChevronLeft size={24} /></button>
              <span style={{ fontSize: '18px', fontWeight: '600', color: colores.textoClaro }}>
                {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoClaro }}><ChevronRight size={24} /></button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: colores.textoMedio }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                  const days: React.ReactNode[] = [];
                  for (let i = 0; i < startingDayOfWeek; i++) days.push(<div key={`e${i}`} />);
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isDisabled = isDateDisabled(date);
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
                    days.push(
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled}
                        style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: isSelected ? colores.primario : 'transparent', color: isDisabled ? colores.textoMedio : isSelected ? 'white' : colores.textoClaro, cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isDisabled ? 0.4 : 1 }}
                      >{day}</button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>

            {selectedDate && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: colores.textoClaro, marginBottom: '12px' }}>Selecciona una hora:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {timeSlots.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${colores.borde}`, backgroundColor: selectedTime === t ? colores.primario : 'transparent', color: selectedTime === t ? 'white' : colores.textoClaro, cursor: 'pointer', fontSize: '13px' }}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleScheduleConfirm}
              disabled={!selectedDate || !selectedTime}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: (!selectedDate || !selectedTime) ? colores.textoMedio : colores.gradientePrimario, color: 'white', fontSize: '16px', fontWeight: '600', cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
            >
              Confirmar Reunión
            </button>
          </div>
        </div>
      )}

      {/* Modal Información */}
      {showInfo && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.3s ease' }}
          onClick={() => setShowInfo(false)}
        >
          <div
            style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '90%', animation: 'slideUp 0.3s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Acerca de MonitorIA</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}><X size={24} /></button>
            </div>

            <div style={{ padding: '16px', backgroundColor: colores.fondoTerciario, borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: colores.gradientePrimario, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Radio size={32} color="white" />
              </div>
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>MonitorIA</strong> escucha en tiempo real las transmisiones de radio para detectar menciones de marcas y palabras clave contratadas.
              </p>
              <p style={{ fontSize: '13px', color: colores.textoMedio, lineHeight: '1.6', marginBottom: '12px' }}>
                Navega entre estaciones, reproduce el audio y consulta las detecciones con su nivel de confianza.
              </p>
              
              {/* Mostrar link a emisoras.com.mx solo en modo LIVE */}
              {modoLive && (
                <div style={{ 
                  padding: '10px 12px', 
                  backgroundColor: `${colores.exito ?? '#10B981'}14`, 
                  borderRadius: '8px', 
                  marginBottom: '12px',
                  border: `1px solid ${colores.exito ?? '#10B981'}33`
                }}>
                  <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Modo LIVE activo
                  </p>
                  <p style={{ fontSize: '12px', color: colores.textoClaro, marginBottom: '6px', lineHeight: '1.4' }}>
                    Audio streaming desde emisoras.com.mx
                  </p>
                  <a 
                    href="https://mvs-ia.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      fontSize: '11px', 
                      color: colores.exito ?? '#10B981', 
                      textDecoration: 'underline',
                      fontWeight: '600'
                    }}
                  >
                    Para analizar, ve a MonitorIA →
                  </a>
                </div>
              )}
              
              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px', marginTop: '12px' }}>
                {['Detección de palabras clave en audio', 'Navegación entre múltiples estaciones', 'Métricas de precisión por mención', 'Historial de menciones con timestamp'].map(item => (
                  <p key={item} style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                    <strong style={{ color: colores.textoClaro }}>✓</strong> {item}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: colores.gradientePrimario, color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {showConfirmation && confirmedAppointment && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.3s ease' }}
          onClick={() => setShowConfirmation(false)}
        >
          <div
            style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', animation: 'slideUp 0.3s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colores.textoClaro, margin: '0 0 12px 0' }}>¡Reunión Agendada!</h3>
            <p style={{ fontSize: '14px', color: colores.textoMedio, marginBottom: '24px', lineHeight: '1.5' }}>Tu reunión para cotización ha sido confirmada exitosamente</p>
            <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '12px', padding: '16px', marginBottom: '24px', border: `1px solid ${colores.borde}` }}>
              <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</p>
              <p style={{ fontSize: '15px', color: colores.textoClaro, margin: '0 0 12px 0', fontWeight: '600' }}>{confirmedAppointment.date}</p>
              <div style={{ height: '1px', backgroundColor: colores.borde, margin: '0 0 12px 0' }} />
              <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora</p>
              <p style={{ fontSize: '15px', color: colores.textoClaro, margin: 0, fontWeight: '600' }}>{confirmedAppointment.time}</p>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: colores.gradientePrimario, color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
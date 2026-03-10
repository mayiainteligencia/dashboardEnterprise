import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Gauge, Weight, Star, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Motocicleta {
  id: number;
  nombre: string;
  modelo: string;
  año: number;
  colorAccent: string;
  colorGlow: string;       // versión más transparente para glows
  precio: string;
  potencia: string;
  velocidadMax: string;
  peso: string;
  cilindrada: string;
  torque: string;
  rating: number;
  descripcion: string;
  badge: string;
  video: string | null;    // ruta al .mp4
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const motocicletas: Motocicleta[] = [
  {
    id: 1,
    nombre: 'GSX-R1000R',
    modelo: 'Supersport',
    año: 2024,
    colorAccent: '#1A4FCC',
    colorGlow: 'rgba(26,79,204,0.35)',
    precio: '$19,499',
    potencia: '202 HP',
    velocidadMax: '299 km/h',
    peso: '203 kg',
    cilindrada: '999 cc',
    torque: '117 Nm',
    rating: 4.9,
    descripcion: 'La cúspide de la ingeniería MotoGP llevada directamente al asfalto.',
    badge: 'MotoGP Tech',
    video: '/assets/selectorMotos/Suzuki_GSX-R1000R.mp4',
  },
  {
    id: 2,
    nombre: 'Hayabusa',
    modelo: 'Hypersport',
    año: 2024,
    colorAccent: '#C0392B',
    colorGlow: 'rgba(192,57,43,0.35)',
    precio: '$17,999',
    potencia: '190 HP',
    velocidadMax: '299 km/h',
    peso: '264 kg',
    cilindrada: '1340 cc',
    torque: '150 Nm',
    rating: 4.8,
    descripcion: 'El ícono definitivo. Velocidad, diseño y un legado inigualable.',
    badge: 'Icónica',
    video: '/assets/selectorMotos/Hayabusa.mp4',
  },
  {
    id: 3,
    nombre: 'V-Strom 1050XT',
    modelo: 'Adventure',
    año: 2024,
    colorAccent: '#1D6A40',
    colorGlow: 'rgba(29,106,64,0.35)',
    precio: '$14,299',
    potencia: '107 HP',
    velocidadMax: '220 km/h',
    peso: '232 kg',
    cilindrada: '1037 cc',
    torque: '100 Nm',
    rating: 4.7,
    descripcion: 'Aventura sin límites. Domina cualquier terreno con total confianza.',
    badge: 'Off-Road Ready',
    video: '/assets/selectorMotos/v-Storm.mp4',
  },
];

// ─── Video Player ─────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  src: string;
  colorAccent: string;
  colorGlow: string;
  onPlay: () => void;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src, colorAccent, colorGlow, onPlay, isActive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-play cuando está activo
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().then(() => { setIsPlaying(true); onPlay(); }).catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive]);

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
    setTimeout(() => {
      const v = videoRef.current;
      if (v && isActive) {
        v.currentTime = 0;
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 800);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().then(() => { setIsPlaying(true); onPlay(); }).catch(() => {}); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', background: '#000' }}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        playsInline
        preload="auto"
        onTimeUpdate={() => { const v = videoRef.current; if (v && v.duration) setProgress((v.currentTime / v.duration) * 100); }}
        onEnded={handleEnded}
        onLoadedData={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Loading skeleton */}
      {!isLoaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ color: '#555', fontSize: '13px' }}>Cargando video...</div>
        </div>
      )}

      {/* Top gradient overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Color glow at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
        background: `linear-gradient(to top, ${colorGlow}, transparent)`,
        pointerEvents: 'none',
        transition: 'background 0.6s ease',
      }} />

      {/* Controls overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '10px 12px',
      }}>
        {/* Progress bar */}
        <div
          onClick={handleProgressClick}
          style={{
            width: '100%', height: '3px', borderRadius: '2px',
            background: 'rgba(255,255,255,0.25)', cursor: 'pointer', marginBottom: '8px',
            position: 'relative',
          }}
        >
          <div style={{
            height: '100%', borderRadius: '2px',
            width: `${progress}%`,
            background: colorAccent,
            transition: 'width 0.2s linear',
          }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', top: '50%', left: `${progress}%`,
            transform: 'translate(-50%, -50%)',
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'white',
            boxShadow: `0 0 6px ${colorAccent}`,
          }} />
        </div>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={togglePlay}
            style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.28)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={toggleMute}
            style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.28)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginLeft: 'auto' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const SelectorMotocicletas: React.FC = () => {
  const { colores } = brandingConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const moto = motocicletas[currentIndex];

  // ── Navigation ──

  const navigate = (dir: 1 | -1) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + dir + motocicletas.length) % motocicletas.length);
      setIsTransitioning(false);
    }, 380);
  };

  const goTo = (i: number) => {
    if (isTransitioning || i === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => { setCurrentIndex(i); setIsTransitioning(false); }, 380);
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(moto.rating));

  // ─── Spec rows ────────────────────────────────────────────────────────────

  const specs = [
    { icon: <Zap size={12} />,    label: 'Potencia',    value: moto.potencia,     accent: '#F59E0B' },
    { icon: <Gauge size={12} />,  label: 'Vel. Máx',    value: moto.velocidadMax, accent: colores.acento },
    { icon: <Weight size={12} />, label: 'Peso',        value: moto.peso,         accent: colores.primario },
  ];

  return (
    <div style={{
      backgroundColor: colores.fondoSecundario,
      borderRadius: '24px',
      border: `1px solid ${colores.borde}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* Ambient glow orb */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: `radial-gradient(circle, ${moto.colorAccent}18 0%, transparent 65%)`,
        transition: 'background 0.6s ease',
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: colores.gradientePrimario,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '17px', fontWeight: '900', color: 'white',
          }}>S</div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: colores.textoClaro, margin: 0 }}>
              Selector de Motocicletas Inteligentes
            </h3>
            <p style={{ fontSize: '11px', color: colores.textoMedio, margin: 0 }}>
              Suzuki · Línea 2024 · {motocicletas.length} modelos
            </p>
          </div>
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '600',
          background: `${moto.colorAccent}18`, color: moto.colorAccent,
          border: `1px solid ${moto.colorAccent}40`,
          transition: 'all 0.5s ease',
        }}>{moto.badge}</span>
      </div>

      {/* ── Video Stage ── */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>

        {/* Arrow left */}
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          border: `1px solid rgba(255,255,255,0.15)`, borderRadius: '50%',
          width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', transition: 'all 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = moto.colorAccent}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.55)'}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Video container */}
        <div style={{
          margin: '0 42px',
          height: '200px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.38s ease, transform 0.38s ease',
          boxShadow: `0 8px 32px ${moto.colorGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
        }}>
          {moto.video ? (
            <VideoPlayer
              key={moto.id}
              src={moto.video}
              colorAccent={moto.colorAccent}
              colorGlow={moto.colorGlow}
              onPlay={() => {}}
              isActive={!isTransitioning}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#111', color: '#555', gap: '8px',
            }}>
              <span style={{ fontSize: '36px' }}>🏍️</span>
              <span style={{ fontSize: '12px' }}>Video no disponible</span>
            </div>
          )}
        </div>

        {/* Arrow right */}
        <button onClick={() => navigate(1)} style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          border: `1px solid rgba(255,255,255,0.15)`, borderRadius: '50%',
          width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', transition: 'all 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = moto.colorAccent}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.55)'}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Dots ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '12px' }}>
        {motocicletas.map((m, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === currentIndex ? '20px' : '6px',
            height: '6px', borderRadius: '3px',
            background: i === currentIndex ? m.colorAccent : colores.borde,
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>

      {/* ── Model info ── */}
      <div style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(5px)' : 'translateY(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        flex: 1, display: 'flex', flexDirection: 'column', gap: '10px',
      }}>

        {/* Name + price + stars */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '800', color: colores.textoClaro, margin: 0, lineHeight: 1.1 }}>
              {moto.nombre}
            </h2>
            <p style={{ fontSize: '10px', color: moto.colorAccent, margin: '2px 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              {moto.modelo} · {moto.año} · {moto.cilindrada}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '16px', fontWeight: '800', color: colores.textoClaro, margin: 0 }}>{moto.precio}</p>
            <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end', marginTop: '2px' }}>
              {stars.map((filled, i) => (
                <Star key={i} size={10} fill={filled ? '#F59E0B' : 'none'} color={filled ? '#F59E0B' : colores.borde} />
              ))}
              <span style={{ fontSize: '10px', color: colores.textoMedio, marginLeft: '2px' }}>{moto.rating}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0, lineHeight: '1.55' }}>
          {moto.descripcion}
        </p>

        {/* Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {specs.map((s, i) => (
            <div key={i} style={{
              backgroundColor: colores.fondoTerciario, borderRadius: '10px',
              padding: '8px 5px', textAlign: 'center', border: `1px solid ${colores.borde}`,
            }}>
              <div style={{ color: s.accent, marginBottom: '3px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: colores.textoClaro, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
};
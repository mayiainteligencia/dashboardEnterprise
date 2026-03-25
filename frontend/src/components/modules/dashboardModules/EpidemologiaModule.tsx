import React, { useState, useEffect, useRef } from 'react';
import { Activity, MoreVertical, X, ArrowRight, MapPin } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface EpidemologiaModuleProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableVideo?: boolean;
  onNavigate?: (section: string) => void;
}

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 32 - ((v - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(' ');
  const fillPts = `0,34 ${pts} 100,34`;
  const lastIdx = data.length - 1;
  const lastX = 100;
  const lastY = 32 - ((data[lastIdx] - min) / range) * 28;
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" style={{ width: '100%', height: '40px' }}>
      <polygon points={fillPts} fill={`${color}20`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
};

export const EpidemologiaModule: React.FC<EpidemologiaModuleProps> = ({
  videoStreamUrl,
  enableVideo = false,
  onNavigate,
}) => {
  const { colores } = brandingConfig;

  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const casosData = [120, 145, 132, 178, 201, 189, 215, 234, 198, 267, 245, 289];
  const enfermedades = [
    { nombre: 'Influenza A', casos: 289, zonas: 8, trend: '+18.6%', nivel: 'alto' },
    { nombre: 'Gastroenteritis', casos: 214, zonas: 5, trend: '+6.2%', nivel: 'medio' },
    { nombre: 'Dengue', casos: 87, zonas: 3, trend: '-4.1%', nivel: 'bajo' },
    { nombre: 'COVID-19', casos: 156, zonas: 6, trend: '+12.3%', nivel: 'medio' },
  ];
  const estados = [
    { nombre: 'CDMX', valor: 92, color: '#EF4444' },
    { nombre: 'Jalisco', valor: 74, color: '#F59E0B' },
    { nombre: 'N. León', valor: 61, color: '#F59E0B' },
    { nombre: 'Puebla', valor: 43, color: '#10B981' },
    { nombre: 'Oaxaca', valor: 28, color: '#10B981' },
  ];

  const nivelColor: Record<string, string> = { alto: '#EF4444', medio: '#F59E0B', bajo: '#10B981' };
  const nivelBg: Record<string, string> = { alto: '#EF444415', medio: '#F59E0B15', bajo: '#10B98115' };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '24px', border: `1px solid ${colores.borde}`, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={22} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colores.textoClaro, margin: 0, lineHeight: 1.2 }}>Guanajuato Inteligencia Epidemiológica</h3>
            <p style={{ fontSize: '11px', color: colores.textoMedio, margin: 0 }}>
              Vigilancia en tiempo real · <span style={{ color: '#EC4899', fontWeight: 600 }}>● 3 Alertas activas</span>
            </p>
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio, padding: '4px' }}>
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', minWidth: '210px', zIndex: 1000, overflow: 'hidden' }}>
              {[
                { label: 'Ver Vigilancia Epidemiológica', action: () => { onNavigate?.('analiticos'); setShowMenu(false); } },
                { label: 'Más Información', action: () => { setShowInfo(true); setShowMenu(false); } },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: colores.textoClaro, fontSize: '14px', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >{item.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {[
          { valor: '18', label: 'Zonas Monitoreadas', color: '#8B5CF6', bg: '#8B5CF615' },
          { valor: '< 1h', label: 'Actualización', color: '#EC4899', bg: '#EC489915' },
          { valor: '96.1%', label: 'Precisión IA', color: '#10B981', bg: '#10B98115' },
        ].map(({ valor, label, color, bg }) => (
          <div key={label} style={{ backgroundColor: bg, border: `1px solid ${color}33`, borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color, margin: 0, lineHeight: 1 }}>{valor}</p>
            <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '4px 0 0 0', lineHeight: 1.3 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Sparkline + Video side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', alignItems: 'stretch' }}>

        {/* Sparkline */}
        <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>Casos · 12 semanas</p>
              <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0 0' }}>Todas las enfermedades · Red </p>
            </div>
            <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: '700', backgroundColor: '#EF444420', padding: '2px 7px', borderRadius: '20px' }}>↑ +20%</span>
          </div>
          <Sparkline data={casosData} color="#8B5CF6" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            {['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Hoy'].map(m => (
              <span key={m} style={{ fontSize: '8px', color: colores.textoMedio }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Video thumbnail — Live feed */}
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000', flexShrink: 0 }}>
          {enableVideo ? (
            <video
              src={videoStreamUrl || '/assets/guanajuato2.mp4'}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: '110px', background: 'linear-gradient(160deg, #8B5CF630, #EC489930)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={28} color="#8B5CF666" />
            </div>
          )}
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)', pointerEvents: 'none' }} />
          {/* Live badge */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '3px 7px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#EC4899', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: '700', letterSpacing: '0.5px' }}>LIVE</span>
          </div>
          {/* Label */}
          <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center' }}>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.2 }}>Vigilancia</p>
            <p style={{ fontSize: '8px', color: '#fff', fontWeight: '700', margin: 0 }}>Epidemiológica</p>
          </div>
        </div>
      </div>

      {/* Enfermedades monitoreadas */}
      <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: colores.textoClaro, margin: '0 0 10px 0' }}>Enfermedades Monitoreadas</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {enfermedades.map(({ nombre, casos, zonas, trend, nivel }) => (
            <div key={nombre} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: nivelColor[nivel], flexShrink: 0, boxShadow: `0 0 6px ${nivelColor[nivel]}88` }} />
              <span style={{ fontSize: '11px', color: colores.textoClaro, flex: 1, fontWeight: 500 }}>{nombre}</span>
              <span style={{ fontSize: '10px', color: colores.textoMedio }}>{casos} casos</span>
              <span style={{ fontSize: '10px', color: colores.textoMedio }}>{zonas} zonas</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: trend.startsWith('-') ? '#10B981' : '#EF4444', backgroundColor: nivelBg[nivel], padding: '2px 6px', borderRadius: '8px' }}>{trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa de calor por estado */}
      <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>
            <MapPin size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Concentración por Estado
          </p>
          <span style={{ fontSize: '9px', color: colores.textoMedio }}>Índice de riesgo</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {estados.map(({ nombre, valor, color }) => (
            <div key={nombre} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: colores.textoClaro, width: '52px', flexShrink: 0 }}>{nombre}</span>
              <div style={{ flex: 1, height: '8px', borderRadius: '4px', backgroundColor: `${colores.borde}66`, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${valor}%`, borderRadius: '4px', backgroundColor: color, boxShadow: `0 0 8px ${color}66` }} />
              </div>
              <span style={{ fontSize: '10px', color, fontWeight: '700', width: '28px', textAlign: 'right' }}>{valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón navegación */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s', marginTop: 'auto' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver Vigilancia Epidemiológica <ArrowRight size={16} />
      </button>

      {/* Modal Info */}
      {showInfo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setShowInfo(false)}>
          <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Acerca de Guanajuato Epidemiología</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}><X size={24} /></button>
            </div>
            <div style={{ padding: '16px', backgroundColor: colores.fondoTerciario, borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Activity size={28} color="white" />
              </div>
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>Guanajuato Inteligencia Epidemiológica</strong> monitorea brotes y alertas sanitarias en tiempo real para toda la red.
              </p>
              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px' }}>
                {['Detección temprana de brotes por región', 'Correlación consumo de medicamentos y enfermedad', 'Alertas sanitarias automáticas', 'Mapa de calor epidemiológico nacional'].map(item => (
                  <p key={item} style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                    <strong style={{ color: '#8B5CF6' }}>✓</strong> {item}
                  </p>
                ))}
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Entendido</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};
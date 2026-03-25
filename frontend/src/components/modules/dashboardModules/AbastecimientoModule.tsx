import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, MoreVertical, X, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface AbastecimientoModuleProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableVideo?: boolean;
  onNavigate?: (section: string) => void;
}

const MiniBarChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const w = 100 / data.length;
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '44px' }}>
      {data.map((v, i) => {
        const h = (v / max) * 36;
        const isLast = i === data.length - 1;
        return (
          <rect key={i} x={i * w + 1} y={40 - h} width={w - 2} height={h} rx="2"
            fill={isLast ? color : `${color}55`} />
        );
      })}
    </svg>
  );
};

export const AbastecimientoModule: React.FC<AbastecimientoModuleProps> = ({
  videoStreamUrl,
  enableVideo = false,
  onNavigate,
}) => {
  const { colores } = brandingConfig;

  const [zonas] = useState(12);
  const [precision] = useState(94.3);
  const [alertas] = useState(3);
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const demandaData = [42, 58, 51, 67, 73, 61, 88, 75, 92, 85, 97, 104];
  const categorias = [
    { nombre: 'Analgésicos', stock: 87, demanda: 92, trend: '+12.3%', up: true },
    { nombre: 'Antibióticos', stock: 45, demanda: 68, trend: '+34.7%', up: true },
    { nombre: 'Vitaminas', stock: 91, demanda: 85, trend: '-3.2%', up: false },
    { nombre: 'Dermatología', stock: 62, demanda: 71, trend: '+8.1%', up: true },
  ];

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
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart2 size={22} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colores.textoClaro, margin: 0, lineHeight: 1.2 }}>Guanajuato Inteligencia de Demanda</h3>
            <p style={{ fontSize: '11px', color: colores.textoMedio, margin: 0 }}>
              y Abastecimiento · <span style={{ color: '#10B981', fontWeight: 600 }}>● Activo</span>
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
                { label: 'Ver Abastecimiento Predictivo', action: () => { onNavigate?.('analiticos'); setShowMenu(false); } },
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
          { valor: zonas, label: 'Zonas Activas', color: '#0EA5E9', bg: '#0EA5E915' },
          { valor: `${precision}%`, label: 'Precisión IA', color: '#10B981', bg: '#10B98115' },
          { valor: alertas, label: 'Alertas Stock', color: '#F59E0B', bg: '#F59E0B15' },
        ].map(({ valor, label, color, bg }) => (
          <div key={label} style={{ backgroundColor: bg, border: `1px solid ${color}33`, borderRadius: '12px', padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color, margin: 0, lineHeight: 1 }}>{valor}</p>
            <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '4px 0 0 0', lineHeight: 1.3 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Gráfica + Video side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', alignItems: 'stretch' }}>

        {/* Gráfica de barras */}
        <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>Demanda · 12 semanas</p>
              <p style={{ fontSize: '9px', color: colores.textoMedio, margin: '2px 0 0 0' }}>Unidades proyectadas por zona</p>
            </div>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', backgroundColor: '#10B98120', padding: '2px 7px', borderRadius: '20px' }}>↑ +23%</span>
          </div>
          <MiniBarChart data={demandaData} color="#0EA5E9" />
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
              src={videoStreamUrl || '/assets/guanajuato1.mp4'}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: '110px', background: 'linear-gradient(160deg, #0EA5E930, #10B98130)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={28} color="#0EA5E966" />
            </div>
          )}
          {/* Overlay: live badge + mini stat */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '3px 7px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: '700', letterSpacing: '0.5px' }}>LIVE</span>
          </div>
          <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center' }}>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.2 }}>Sistema de</p>
            <p style={{ fontSize: '8px', color: '#fff', fontWeight: '700', margin: 0 }}>Abastecimiento</p>
          </div>
        </div>
      </div>

      {/* Stock vs Demanda */}
      <div style={{ backgroundColor: colores.fondoTerciario, borderRadius: '14px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: colores.textoClaro, margin: 0 }}>Stock vs Demanda</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '9px', color: colores.textoMedio }}><span style={{ color: '#0EA5E9' }}>■</span> Stock</span>
            <span style={{ fontSize: '9px', color: colores.textoMedio }}><span style={{ color: '#F59E0B' }}>□</span> Demanda</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {categorias.map(({ nombre, stock, demanda, trend, up }) => (
            <div key={nombre}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: colores.textoClaro, fontWeight: 500 }}>{nombre}</span>
                <span style={{ fontSize: '10px', color: up ? '#10B981' : '#EF4444', fontWeight: '700' }}>{up ? '↑' : '↓'} {trend}</span>
              </div>
              <div style={{ position: 'relative', height: '6px', borderRadius: '3px', backgroundColor: `${colores.borde}66` }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${stock}%`, borderRadius: '3px', background: 'linear-gradient(90deg, #0EA5E9aa, #10B981aa)' }} />
                <div style={{ position: 'absolute', left: 0, top: '-1px', height: '8px', width: `${Math.min(demanda, 100)}%`, borderRadius: '3px', border: `1.5px solid #F59E0B`, backgroundColor: 'transparent' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas recientes */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: '600', color: colores.textoMedio, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Alertas Recientes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { tipo: 'warning', texto: 'Quiebre inminente · Antibióticos Zona Norte', tiempo: '2h' },
            { tipo: 'ok', texto: 'Reabastecimiento completado · CDMX', tiempo: '4h' },
            { tipo: 'warning', texto: 'Sobrestock detectado · Vitaminas Occidente', tiempo: '6h' },
          ].map(({ tipo, texto, tiempo }) => (
            <div key={texto} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', backgroundColor: colores.fondoTerciario, borderRadius: '10px', borderLeft: `3px solid ${tipo === 'warning' ? '#F59E0B' : '#10B981'}` }}>
              {tipo === 'warning'
                ? <AlertTriangle size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
                : <CheckCircle size={13} color="#10B981" style={{ flexShrink: 0 }} />}
              <span style={{ fontSize: '10px', color: colores.textoClaro, flex: 1, lineHeight: 1.3 }}>{texto}</span>
              <span style={{ fontSize: '9px', color: colores.textoMedio }}>{tiempo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón navegación */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9, #10B981)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s', marginTop: 'auto' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Ver Abastecimiento Predictivo <ArrowRight size={16} />
      </button>

      {/* Modal Info */}
      {showInfo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setShowInfo(false)}>
          <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Acerca de Guanajuato Demanda IA</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}><X size={24} /></button>
            </div>
            <div style={{ padding: '16px', backgroundColor: colores.fondoTerciario, borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <BarChart2 size={28} color="white" />
              </div>
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>Guanajuato Inteligencia de Demanda</strong> es tu motor de abastecimiento predictivo para optimizar el inventario de la red.
              </p>
              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px' }}>
                {['Predicción de demanda por zona y temporada', 'Alertas de quiebre de stock anticipadas', 'Programación inteligente de reabastecimiento', 'Optimización de inventario con IA'].map(item => (
                  <p key={item} style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}>
                    <strong style={{ color: '#10B981' }}>✓</strong> {item}
                  </p>
                ))}
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9, #10B981)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Entendido</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};
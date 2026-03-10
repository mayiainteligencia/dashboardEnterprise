import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, MoreVertical, X, TrendingUp, ArrowRight } from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

interface AbastecimientoModuleProps {
  videoStreamUrl?: string;
  apiEndpoint?: string;
  enableVideo?: boolean;
  onNavigate?: (section: string) => void;
}

export const AbastecimientoModule: React.FC<AbastecimientoModuleProps> = ({
  videoStreamUrl,
  enableVideo = false,
  onNavigate,
}) => {
  const { colores } = brandingConfig;

  const [systemStatus] = useState<'activo' | 'procesando'>('activo');
  const [zonas] = useState(12);
  const [precision] = useState(94.3);
  const [alertas] = useState(3);
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const phrases = [
    '📊 Analizando tendencias de demanda',
    '📦 Stock optimizado por IA',
    '⚡ Abastecimiento predictivo activo',
    '🔍 Detectando patrones de consumo',
    '📈 Pedido inteligente activo',
    '🏭 Cadena de suministro optimizada',
    '✅ Inventario balanceado',
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentPhraseIndex(p => (p + 1) % phrases.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <div style={{ backgroundColor: colores.fondoSecundario, borderRadius: '24px', border: `1px solid ${colores.borde}`, padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>SIMI Inteligencia de Demanda</h3>
            <p style={{ fontSize: '12px', color: colores.textoMedio, margin: 0 }}>y Abastecimiento</p>
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}>
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '200px', zIndex: 1000, overflow: 'hidden' }}>
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

      {/* Área principal */}
      <div style={{ flex: 1, backgroundColor: colores.fondoTerciario, borderRadius: '16px', minHeight: '200px', position: 'relative', overflow: 'hidden' }}>
        {enableVideo ? (
          <video src={videoStreamUrl || '/assets/simiAbastecimiento.mp4'} autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            onError={e => {
              const container = (e.target as HTMLVideoElement).parentElement;
              if (container) container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:${colores.textoMedio};font-size:14px;">Video no disponible</div>`;
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0EA5E920 0%, #10B98120 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
          </div>
        )}

        {/* Badge de estado */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', alignItems: 'flex-end', padding: '20px', pointerEvents: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', backgroundColor: '#10B981', pointerEvents: 'auto' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {systemStatus === 'activo' ? 'Sistema Activo' : 'Procesando'}
            </span>
          </div>
        </div>

        {/* Botón ícono */}
        <button
          onClick={() => onNavigate?.('analiticos')}
          style={{ position: 'absolute', top: '16px', right: '16px', width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(14,165,233,0.4)', transition: 'all 0.3s ease', zIndex: 10 }}
          title="Ver Abastecimiento Predictivo"
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,165,233,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.4)'; }}
        >
          <TrendingUp size={22} />
        </button>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0EA5E9', margin: 0 }}>{zonas}</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Zonas Activas</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>{precision}%</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Precisión IA</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: 0 }}>{alertas}</p>
          <p style={{ fontSize: '11px', color: colores.textoMedio, margin: '4px 0 0 0' }}>Alertas Stock</p>
        </div>
      </div>

      {/* Botón principal de navegación */}
      <button
        onClick={() => onNavigate?.('analiticos')}
        style={{ marginTop: '16px', width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s' }}
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
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>Acerca de SIMI Demanda IA</h3>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colores.textoMedio }}><X size={24} /></button>
            </div>
            <div style={{ padding: '16px', backgroundColor: colores.fondoTerciario, borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <BarChart2 size={32} color="white" />
              </div>
              <p style={{ fontSize: '14px', color: colores.textoClaro, lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>SIMI Inteligencia de Demanda</strong> es tu motor de abastecimiento predictivo para optimizar el inventario de la red Similares.
              </p>
              <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '12px', marginTop: '12px' }}>
                {['Predicción de demanda por zona y temporada', 'Alertas de quiebre de stock anticipadas', 'Programación inteligente de reabastecimiento', 'Optimización de inventario con IA'].map(item => (
                  <p key={item} style={{ fontSize: '12px', color: colores.textoMedio, marginBottom: '8px' }}><strong style={{ color: colores.textoClaro }}>✓</strong> {item}</p>
                ))}
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Entendido</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
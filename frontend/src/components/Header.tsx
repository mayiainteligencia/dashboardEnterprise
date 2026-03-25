import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Bot,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { AsistenteIAChat } from './modules/AsistenteIAChat';
import type { AsistenteIAChatHandle } from './modules/AsistenteIAChat';

interface HeaderProps {
  title: string;
}

interface Notification {
  id: number;
  tipo: 'alerta' | 'exito' | 'info' | 'urgente';
  titulo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
}

const notificacionesEstaticas: Notification[] = [
  { id: 1, tipo: 'urgente', titulo: 'Guanajuato: Quiebre Inminente · Antibióticos',        mensaje: 'Zona Norte en riesgo crítico. Stock vs demanda proyectada +34.7%. Acción inmediata requerida.',          tiempo: 'Hace 2 horas',  leida: false },
  { id: 2, tipo: 'alerta',  titulo: 'Guanajuato: Alertas Epidemiológicas Activas',         mensaje: 'Influenza A +18.6% en 8 zonas y COVID-19 +12.3% en 6 zonas. CDMX con índice de riesgo: 92.',           tiempo: 'Hace 15 min',   leida: false },
  { id: 3, tipo: 'alerta',  titulo: 'Guanajuato: Riesgo de Desabasto Nacional',       mensaje: '38 alertas activas hoy. 7.4% riesgo desabasto y 156 SKUs críticos de 24,390 monitoreados.',            tiempo: 'Hace 30 min',   leida: false },
  { id: 4, tipo: 'exito',   titulo: 'Guanajuato: Reabastecimiento Completado · CDMX',       mensaje: 'Operación de reabastecimiento finalizada. Cobertura promedio actual: 92.6% en inventario disponible.',  tiempo: 'Hace 4 horas',  leida: true  },
  { id: 5, tipo: 'info',    titulo: 'Guanajuato: Sobrestock Detectado · Vitaminas',     mensaje: 'Vitaminas Occidente con variación -3.2%. Cluster Alérgica tendencia -6% — nivel de riesgo bajo.',      tiempo: 'Hace 6 horas',  leida: true  },
];

const sugerencias = [
  { icono: '📊', texto: '¿Cuál es el KPI más bajo este mes?' },
  { icono: '👥', texto: '¿Cuántos empleados están activos hoy?' },
  { icono: '⚠️', texto: 'Muéstrame las alertas críticas' },
  { icono: '📈', texto: '¿Cómo van las ventas este trimestre?' },
];

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { colores, empresa } = brandingConfig;

  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notification[]>(notificacionesEstaticas);
  const notifRef = useRef<HTMLDivElement>(null);

  const [chatAbierto, setChatAbierto] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<AsistenteIAChatHandle>(null);

  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotificacionesAbiertas(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node))
        setChatAbierto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const getIconoPorTipo = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'alerta':  return <AlertTriangle size={16} color="#F59E0B" />;
      case 'exito':   return <CheckCircle   size={16} color="#10B981" />;
      case 'urgente': return <AlertTriangle size={16} color="#EF4444" />;
      case 'info':    return <Info          size={16} color="#3B82F6" />;
    }
  };

  const marcarComoLeida = (id: number) =>
    setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, leida: true } : n));

  const marcarTodasComoLeidas = () =>
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));

  return (
    <>
      {/* Overlay oscuro cuando el chat está abierto */}
      {chatAbierto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <header
        style={{
          height: '72px',
          backgroundColor: colores.fondoSecundario,
          borderBottom: `1px solid ${colores.borde}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          gap: '8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 300,
        }}
      >
        {/* ── IZQUIERDA: Barra con dropdown ── */}
        <div
          ref={searchWrapRef}
          style={{ flex: 1, maxWidth: '540px', position: 'relative' }}
        >
          {/* La barra */}
          <div
            onClick={() => { setChatAbierto(true); setTimeout(() => chatRef.current?.focusInput(), 50); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 14px',
              height: '44px',
              borderRadius: chatAbierto ? '14px 14px 0 0' : '999px',
              backgroundColor: chatAbierto ? colores.fondoPrincipal : colores.fondoTerciario,
              border: `1px solid ${chatAbierto ? colores.primario : colores.borde}`,
              borderBottom: chatAbierto ? `1px solid ${colores.borde}` : `1px solid ${colores.borde}`,
              cursor: 'text',
              transition: 'border-radius 0.2s, background-color 0.2s',
              boxShadow: chatAbierto ? `0 0 0 3px ${colores.primario}28` : 'none',
              position: 'relative',
              zIndex: 310,
            }}
          >
            <Sparkles size={17} style={{ color: colores.primario, flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: colores.textoMedio, flex: 1, userSelect: 'none' }}>
              {chatAbierto ? 'Asistente IA — escribe tu pregunta…' : 'Pregúntale algo al asistente IA…'}
            </span>
            {chatAbierto ? (
              <button
                onClick={e => { e.stopPropagation(); setChatAbierto(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: '50%' }}
              >
                <X size={16} style={{ color: colores.textoMedio }} />
              </button>
            ) : (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: colores.primario,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={14} color="#fff" />
              </div>
            )}
          </div>

          {/* ── Dropdown estilo Google ── */}
          {chatAbierto && (
            <div
              style={{
                position: 'absolute',
                top: '43px',
                left: 0,
                right: 0,
                backgroundColor: colores.fondoPrincipal,
                border: `1px solid ${colores.primario}`,
                borderTop: `1px solid ${colores.borde}`,
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                overflow: 'hidden',
                zIndex: 305,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 130px)',
              }}
            >
              {/* Sugerencias rápidas */}
              <div style={{
                padding: '12px 16px 10px',
                borderBottom: `1px solid ${colores.borde}`,
                flexShrink: 0,
              }}>
                <p style={{
                  margin: '0 0 8px',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: colores.textoMedio,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Sugerencias
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sugerencias.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => chatRef.current?.sendExternal(s.texto)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: `1px solid ${colores.borde}`,
                        backgroundColor: colores.fondoTerciario,
                        color: colores.textoClaro,
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoSecundario)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                    >
                      <span>{s.icono}</span>
                      <span>{s.texto}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
                <AsistenteIAChat ref={chatRef} />
              </div>
            </div>
          )}
        </div>

        {/* ── CENTRO: Logo ── */}
        <img
          src={empresa.logo}
          alt={`${empresa.nombre} logo`}
          style={{ height: '206px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {/* ── DERECHA: Fecha + Bell + Avatar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Fecha pegada a la campana */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '7px 14px', borderRadius: '999px',
            backgroundColor: colores.fondoTerciario,
            border: `1px solid ${colores.borde}`,
            marginRight: '4px',
          }}>
            <CalendarDays size={14} style={{ color: colores.textoMedio }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: colores.textoClaro }}>
              {fechaFormateada}
            </span>
          </div>

          {/* Notificaciones */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)}
              style={iconBtnStyle(colores.fondoTerciario)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoPrincipal)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
            >
              <Bell size={19} style={{ color: colores.textoClaro }} />
              {notificacionesNoLeidas > 0 && (
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  minWidth: '17px', height: '17px', borderRadius: '10px',
                  backgroundColor: '#EF4444', border: `2px solid ${colores.fondoSecundario}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 'bold', color: '#FFFFFF', padding: '0 3px',
                }}>
                  {notificacionesNoLeidas}
                </span>
              )}
            </button>

            {notificacionesAbiertas && (
              <div style={{
                position: 'absolute', top: '56px', right: '0',
                width: '370px', maxHeight: '480px',
                backgroundColor: colores.fondoSecundario,
                borderRadius: '14px', border: `1px solid ${colores.borde}`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                overflow: 'hidden', zIndex: 1000,
              }}>
                <div style={{
                  padding: '14px 18px', borderBottom: `1px solid ${colores.borde}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: colores.textoClaro }}>Notificaciones</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: colores.textoMedio }}>{notificacionesNoLeidas} sin leer</p>
                  </div>
                  {notificacionesNoLeidas > 0 && (
                    <button onClick={marcarTodasComoLeidas}
                      style={{ background: 'none', border: 'none', color: colores.primario, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      Marcar todas
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {notificaciones.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => marcarComoLeida(notif.id)}
                      style={{
                        padding: '14px 18px', borderBottom: `1px solid ${colores.borde}`,
                        backgroundColor: notif.leida ? 'transparent' : colores.fondoTerciario + '44',
                        cursor: 'pointer', transition: 'background-color 0.15s', display: 'flex', gap: '10px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = notif.leida ? 'transparent' : colores.fondoTerciario + '44')}
                    >
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIconoPorTipo(notif.tipo)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: notif.leida ? '500' : '700', color: colores.textoClaro }}>
                            {notif.titulo}
                          </h4>
                          {!notif.leida && (
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colores.primario, flexShrink: 0, marginLeft: '8px', marginTop: '4px' }} />
                          )}
                        </div>
                        <p style={{ margin: '2px 0', fontSize: '12px', color: colores.textoMedio, lineHeight: '1.4' }}>{notif.mensaje}</p>
                        <span style={{ fontSize: '11px', color: colores.textoOscuro }}>{notif.tiempo}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '10px 18px', borderTop: `1px solid ${colores.borde}`, textAlign: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: colores.primario, fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', padding: '6px' }}>
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <button
            style={{
              width: '42px', height: '42px', borderRadius: '50%',
              backgroundColor: '#FFFFFF', border: `2px solid ${colores.borde}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', overflow: 'hidden', padding: '2px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <img
              src="/assets/logosEmpresas/guanajuato.png"
              alt="Perfil"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.style.background = `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})`;
                  container.style.fontSize = '16px';
                  container.style.fontWeight = 'bold';
                  container.style.color = '#FFFFFF';
                  container.textContent = 'M';
                }
              }}
            />
          </button>
        </div>
      </header>
    </>
  );
};

const iconBtnStyle = (bg: string): React.CSSProperties => ({
  width: '40px', height: '40px', borderRadius: '50%',
  backgroundColor: bg, border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  position: 'relative', transition: 'background-color 0.2s',
});
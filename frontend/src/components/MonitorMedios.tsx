// src/components/modules/MonitorMedios.tsx
import { useState, useEffect, useRef } from 'react';
import { brandingConfig } from '../config/branding';

const { colores } = brandingConfig;

// ─── Tipos ───────────────────────────────────────────────────────────
interface Sesion {
  sesion_id: string;
  emisora_nombre: string;
  emisora_url: string;
  keywords: string[];
  iniciada_en: string;
  total_chunks: number;
  total_detecciones: number;
}

interface Testigo {
  id: number;
  sesion_id: string;
  emisora_nombre: string;
  keyword_detectada: string;
  transcripcion: string;
  timestamp: string;
}

// ─── Componente principal ─────────────────────────────────────────────
export const MonitorMedios = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [testigos, setTestigos] = useState<Testigo[]>([]);
  const [emisoraUrl, setEmisoraUrl] = useState('');
  const [emisoraNombre, setEmisoraNombre] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const wsRefs = useRef<Record<string, WebSocket>>({});

  // Polling de sesiones cada 5s
  useEffect(() => {
    fetchSesiones();
    fetchTestigos();
    const interval = setInterval(() => {
      fetchSesiones();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Conectar WebSocket cuando hay sesiones nuevas
  useEffect(() => {
    sesiones.forEach(s => {
      if (!wsRefs.current[s.sesion_id]) {
        conectarWS(s.sesion_id);
      }
    });
  }, [sesiones]);

  const fetchSesiones = async () => {
    try {
      const res = await fetch('/api/monitor/sessions');
      const data = await res.json();
      setSesiones(data.sesiones || []);
    } catch { /* silencioso */ }
  };

  const fetchTestigos = async () => {
    try {
      const res = await fetch('/api/monitor/testigos');
      const data = await res.json();
      setTestigos(data.testigos || []);
    } catch { /* silencioso */ }
  };

  const conectarWS = (sesionId: string) => {
    const ws = new WebSocket(`ws://localhost:8001/ws/${sesionId}`);
    ws.onmessage = (e) => {
      const alerta: Testigo = JSON.parse(e.data);
      setTestigos(prev => [alerta as any, ...prev]);
    };
    ws.onclose = () => {
      delete wsRefs.current[sesionId];
    };
    wsRefs.current[sesionId] = ws;
  };

  const iniciarMonitoreo = async () => {
    setError('');
    if (!emisoraUrl.trim()) return setError('Ingresa la URL de la emisora');
    if (!keywordsInput.trim()) return setError('Ingresa al menos una keyword');
    if (sesiones.length >= 3) return setError('Máximo 3 sesiones simultáneas');

    setCargando(true);
    try {
      const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
      const res = await fetch('/api/monitor/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emisora_url: emisoraUrl,
          emisora_nombre: emisoraNombre || 'Sin nombre',
          keywords
        })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al iniciar');
      setEmisoraUrl('');
      setEmisoraNombre('');
      setKeywordsInput('');
      await fetchSesiones();
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const detenerSesion = async (sesionId: string) => {
    try {
      await fetch(`/api/monitor/stop/${sesionId}`, { method: 'DELETE' });
      wsRefs.current[sesionId]?.close();
      delete wsRefs.current[sesionId];
      await fetchSesiones();
    } catch { /* silencioso */ }
  };

  const exportarCSV = () => {
    if (!testigos.length) return;
    const headers = 'ID,Emisora,Keyword,Transcripción,Timestamp\n';
    const rows = testigos.map(t =>
      `${t.id},"${t.emisora_nombre}","${t.keyword_detectada}","${t.transcripcion.replace(/"/g, '""')}","${t.timestamp}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testigos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: colores.fondoPrincipal, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>
            Monitor de Medios
          </h1>
          <p style={{ fontSize: 15, color: colores.textoOscuro, margin: '6px 0 0' }}>
            Detección automática de menciones en radio en vivo
          </p>
        </div>

        {/* ── Grid principal ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── Panel izquierdo: Configurador ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Formulario nueva sesión */}
            <div style={{
              background: colores.fondoClaro,
              borderRadius: 16,
              padding: 24,
              border: `1px solid ${colores.borde}`,
              boxShadow: colores.sombra
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: colores.textoClaro, margin: '0 0 20px' }}>
                Nueva sesión
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>URL de la emisora</label>
                  <input
                    value={emisoraUrl}
                    onChange={e => setEmisoraUrl(e.target.value)}
                    placeholder="https://streaming.ejemplo.com/radio"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nombre de la emisora</label>
                  <input
                    value={emisoraNombre}
                    onChange={e => setEmisoraNombre(e.target.value)}
                    placeholder="Ej: Exa FM 104.9"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Keywords (separadas por coma)</label>
                  <input
                    value={keywordsInput}
                    onChange={e => setKeywordsInput(e.target.value)}
                    placeholder="Ej: Coca-Cola, nuevo sabor, promo"
                    style={inputStyle}
                  />
                  <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '6px 0 0' }}>
                    El sistema alertará cuando detecte cualquiera de estas palabras
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 8, padding: '10px 14px',
                    fontSize: 13, color: '#DC2626'
                  }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={iniciarMonitoreo}
                  disabled={cargando}
                  style={{
                    padding: '12px 0', borderRadius: 10, border: 'none',
                    background: colores.textoClaro, color: colores.fondoClaro,
                    fontWeight: 600, fontSize: 14, cursor: cargando ? 'not-allowed' : 'pointer',
                    opacity: cargando ? 0.6 : 1, transition: 'opacity 0.2s'
                  }}
                >
                  {cargando ? 'Iniciando...' : '▶ Iniciar monitoreo'}
                </button>
              </div>
            </div>

            {/* Sesiones activas */}
            <div style={{
              background: colores.fondoClaro,
              borderRadius: 16, padding: 24,
              border: `1px solid ${colores.borde}`,
              boxShadow: colores.sombra
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: colores.textoClaro, margin: 0 }}>
                  Sesiones activas
                </h2>
                <span style={{
                  background: sesiones.length > 0 ? '#DCFCE7' : colores.fondoSecundario,
                  color: sesiones.length > 0 ? '#16A34A' : colores.textoOscuro,
                  fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999
                }}>
                  {sesiones.length}/3
                </span>
              </div>

              {sesiones.length === 0 ? (
                <p style={{ fontSize: 13, color: colores.textoOscuro, textAlign: 'center', padding: '20px 0' }}>
                  No hay sesiones activas
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sesiones.map(s => (
                    <div key={s.sesion_id} style={{
                      background: colores.fondoSecundario,
                      borderRadius: 10, padding: '12px 14px',
                      border: `1px solid ${colores.borde}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: '#10B981', display: 'inline-block',
                              boxShadow: '0 0 6px #10B981'
                            }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>
                              {s.emisora_nombre}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: colores.textoOscuro, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.emisora_url}
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {s.keywords.map(kw => (
                              <span key={kw} style={{
                                background: colores.fondoTerciario,
                                color: colores.textoMedio,
                                fontSize: 11, padding: '2px 8px', borderRadius: 999
                              }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: 11, color: colores.textoOscuro, marginTop: 6 }}>
                            {s.total_detecciones} detecciones · {s.total_chunks} chunks
                          </div>
                        </div>
                        <button
                          onClick={() => detenerSesion(s.sesion_id)}
                          style={{
                            marginLeft: 10, padding: '4px 10px',
                            borderRadius: 6, border: '1px solid #FECACA',
                            background: '#FEF2F2', color: '#DC2626',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer'
                          }}
                        >
                          Detener
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Panel derecho: Testigos ── */}
          <div style={{
            background: colores.fondoClaro,
            borderRadius: 16, padding: 24,
            border: `1px solid ${colores.borde}`,
            boxShadow: colores.sombra,
            minHeight: 600
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: colores.textoClaro, margin: 0 }}>
                  Testigos detectados
                </h2>
                <p style={{ fontSize: 12, color: colores.textoOscuro, margin: '4px 0 0' }}>
                  Registro en tiempo real de cada mención detectada
                </p>
              </div>
              <button
                onClick={exportarCSV}
                disabled={testigos.length === 0}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  border: `1px solid ${colores.borde}`,
                  background: colores.fondoSecundario,
                  color: colores.textoMedio,
                  fontSize: 13, fontWeight: 500,
                  cursor: testigos.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: testigos.length === 0 ? 0.5 : 1
                }}
              >
                ↓ Exportar CSV
              </button>
            </div>

            {testigos.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: 400, gap: 12
              }}>
                <div style={{ fontSize: 48 }}>📻</div>
                <p style={{ fontSize: 15, fontWeight: 500, color: colores.textoMedio, margin: 0 }}>
                  Esperando detecciones...
                </p>
                <p style={{ fontSize: 13, color: colores.textoOscuro, margin: 0 }}>
                  Inicia una sesión de monitoreo para ver los testigos aquí
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 700, overflowY: 'auto' }}>
                {testigos.map((t, i) => (
                  <div key={t.id ?? i} style={{
                    background: colores.fondoSecundario,
                    borderRadius: 12, padding: '14px 16px',
                    border: `1px solid ${colores.borde}`,
                    borderLeft: `4px solid ${colores.textoClaro}`,
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: colores.textoClaro, color: colores.fondoClaro,
                          fontSize: 11, fontWeight: 700,
                          padding: '3px 10px', borderRadius: 999
                        }}>
                          {t.keyword_detectada}
                        </span>
                        <span style={{ fontSize: 12, color: colores.textoOscuro, fontWeight: 500 }}>
                          {t.emisora_nombre}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: colores.textoOscuro }}>
                        {new Date(t.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 13, color: colores.textoMedio,
                      margin: 0, lineHeight: 1.5,
                      fontStyle: 'italic'
                    }}>
                      "{t.transcripcion}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
};

// ─── Estilos compartidos ──────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: colores.textoMedio, marginBottom: 6
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  borderRadius: 8, border: `1px solid ${colores.borde}`,
  background: colores.fondoSecundario,
  color: colores.textoClaro, fontSize: 13,
  outline: 'none', boxSizing: 'border-box'
};
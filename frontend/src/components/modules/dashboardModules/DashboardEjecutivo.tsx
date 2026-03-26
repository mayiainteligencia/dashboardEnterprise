import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight, TrendingUp, Package, AlertTriangle,
  BarChart2, ShoppingCart, ArrowUp, ArrowDown, Minus,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  unidad?: string;
  cambio: number;
  descripcion: string;
  color: string;
  data: { v: number }[];
  icono: React.ReactNode;
  destacado?: boolean;
  isMobile?: boolean;
}

const spark = (base: number, len = 8, spread = 0.15) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.round(base * (1 + (Math.random() - 0.5) * spread + i * 0.005)),
  }));

const kpis: Omit<KpiCardProps, 'color' | 'isMobile'>[] = [
  { titulo: 'Ventas Nacionales',    valor: '$148.3M', cambio: 8.4,  descripcion: 'Incremento vs mes anterior',  data: spark(148, 8, 0.12), icono: <ShoppingCart size={22} />, destacado: true },
  { titulo: 'Inventario Disponible',valor: '92.6%',   cambio: 2.1,  descripcion: 'Cobertura promedio nacional', data: spark(92,  8, 0.05), icono: <Package       size={22} /> },
  { titulo: 'Riesgo de Desabasto',  valor: '7.4%',    cambio: -3.2, descripcion: 'SKUs en nivel crítico',       data: spark(7,   8, 0.2),  icono: <AlertTriangle size={22} /> },
  { titulo: 'Demanda Proyectada',   valor: '+12.8%',  cambio: 12.8, descripcion: 'Próximos 30 días',            data: spark(112, 8, 0.08), icono: <BarChart2     size={22} /> },
];

const KpiCard: React.FC<KpiCardProps> = ({ titulo, valor, cambio, descripcion, color, data, icono, destacado, isMobile }) => {
  const { colores } = brandingConfig;
  const [hovered, setHovered] = useState(false);

  const positivo = cambio > 0;
  const neutro = cambio === 0;
  const CambioIcon = neutro ? Minus : positivo ? ArrowUp : ArrowDown;
  const cambioColor = neutro ? colores.textoMedio : positivo ? colores.exito : colores.peligro;

  const cardBg = destacado ? `linear-gradient(140deg, ${color} 0%, ${color}CC 100%)` : colores.fondoSecundario;
  const textoPrincipal = destacado ? '#FFFFFF' : colores.textoClaro;
  const textoSecundario = destacado ? 'rgba(255,255,255,0.75)' : colores.textoMedio;
  const iconoBg = destacado ? 'rgba(255,255,255,0.2)' : `${color}18`;
  const iconoColor = destacado ? '#FFFFFF' : color;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg, borderRadius: '20px',
        padding: isMobile ? '16px' : '24px',
        border: destacado ? 'none' : `1px solid ${colores.borde}`,
        boxShadow: hovered ? `0 12px 32px ${color}30` : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {destacado && (
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconoColor }}>
          {icono}
        </div>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: destacado ? 'rgba(255,255,255,0.2)' : `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconoColor }}>
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: '800', color: textoPrincipal, lineHeight: 1, letterSpacing: '-0.5px' }}>{valor}</div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: textoSecundario, marginTop: '6px' }}>{titulo}</div>
      </div>

      {!isMobile && (
        <div style={{ height: '36px', margin: '0 -4px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={destacado ? 'rgba(255,255,255,0.6)' : color} strokeWidth={2} dot={false} />
              <Tooltip contentStyle={{ display: 'none' }} cursor={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px',
        borderTop: destacado ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colores.borde}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: destacado ? 'rgba(255,255,255,0.9)' : cambioColor, fontSize: '12px', fontWeight: '700' }}>
          <CambioIcon size={13} />{Math.abs(cambio)}%
        </div>
        <span style={{ fontSize: '11px', color: textoSecundario }}>{descripcion}</span>
      </div>
    </div>
  );
};

export const DashboardEjecutivo: React.FC = () => {
  const { colores } = brandingConfig;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {}, 8000);
    return () => clearInterval(t);
  }, []);

  const coloresKpi = [colores.primario, colores.exito, colores.advertencia, colores.acento];
  const ahoraStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: colores.fondoSecundario, borderRadius: '24px', padding: isMobile ? '16px' : '28px', border: `1px solid ${colores.borde}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '14px' : '24px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colores.exito, boxShadow: `0 0 8px ${colores.exito}`, animation: 'pulseEjec 2s infinite' }} />
            <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: colores.textoClaro, margin: 0, letterSpacing: '-0.3px' }}>
              Dashboard Ejecutivo
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>
            Indicadores nacionales · Actualizado {ahoraStr}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: `${colores.primario}12`, border: `1px solid ${colores.primario}30` }}>
          <TrendingUp size={14} color={colores.primario} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: colores.primario }}>Nivel Corporativo</span>
        </div>
      </div>

      {/* Grid KPIs: 2 cols en móvil, 4 en desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '10px' : '16px',
      }}>
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} color={coloresKpi[i]} isMobile={isMobile} />
        ))}
      </div>

      {/* Métricas secundarias: 1 col en móvil, 3 en desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '8px' : '12px',
        marginTop: isMobile ? '12px' : '16px',
      }}>
        {[
          { label: 'Sucursales activas',     valor: '1,842',     icono: '🏪' },
          { label: 'Productos monitoreados', valor: '24,390 SKUs', icono: '📦' },
          { label: 'Alertas activas hoy',    valor: '38',         icono: '🔔' },
        ].map((m, i) => (
          <div key={i} style={{ background: colores.fondoTerciario, borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${colores.borde}` }}>
            <span style={{ fontSize: '22px' }}>{m.icono}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: colores.textoClaro }}>{m.valor}</div>
              <div style={{ fontSize: '11px', color: colores.textoMedio }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulseEjec { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }`}</style>
    </div>
  );
};
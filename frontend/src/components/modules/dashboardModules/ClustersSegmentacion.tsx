import React, { useState } from 'react';
import {
  Grid,
  Activity,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type EjeClusters = 'enfermedad' | 'region' | 'temporalidad' | 'perfil';

interface ClusterBurbuja {
  id: string;
  nombre: string;
  x: number;       // eje: intensidad de demanda
  y: number;       // eje: riesgo de desabasto
  z: number;       // tamaño: volumen de casos
  casos: number;
  medicamentos: string[];
  tendencia: number;
  color: string;
}

interface SegmentoTabla {
  segmento: string;
  descripcion: string;
  casos: number;
  skus: number;
  riesgo: 'critico' | 'alto' | 'medio' | 'bajo';
  tendencia: number;
  color: string;
}

// ── Datos dummy por eje ────────────────────────────────────────────────────────

const clustersData: Record<EjeClusters, ClusterBurbuja[]> = {
  enfermedad: [
    { id: 'c1', nombre: 'Respiratoria Aguda',    x: 88, y: 82, z: 420, casos: 8420, medicamentos: ['Amoxicilina','Azitromicina','Bromhexina'],   tendencia: +28, color: '#EF4444' },
    { id: 'c2', nombre: 'Gastrointestinal',       x: 72, y: 64, z: 310, casos: 5103, medicamentos: ['Loperamida','Metoclopramida','SRO'],          tendencia: +14, color: '#F59E0B' },
    { id: 'c3', nombre: 'Viral Estacional',       x: 65, y: 71, z: 280, casos: 3870, medicamentos: ['Paracetamol','Ibuprofeno','Vitamina C'],      tendencia: +19, color: '#8B5CF6' },
    { id: 'c4', nombre: 'Alérgica',               x: 45, y: 38, z: 190, casos: 2241, medicamentos: ['Loratadina','Cetirizina','Fluticasona'],      tendencia:  -6, color: '#10B981' },
    { id: 'c5', nombre: 'Crónica Recurrente',     x: 38, y: 52, z: 160, casos: 1580, medicamentos: ['Metformina','Losartán','Atorvastatina'],      tendencia:  +3, color: '#008CAE' },
    { id: 'c6', nombre: 'Pediátrica',             x: 78, y: 88, z: 240, casos: 2980, medicamentos: ['Amoxicilina pediátrica','Ibuprofeno niños'],  tendencia: +22, color: '#F27405' },
  ],
  region: [
    { id: 'r1', nombre: 'Región Norte',     x: 82, y: 78, z: 380, casos: 6840, medicamentos: ['Antibióticos','Antigripales'],   tendencia: +18, color: '#EF4444' },
    { id: 'r2', nombre: 'Región Centro',    x: 90, y: 85, z: 450, casos: 9120, medicamentos: ['Analgésicos','Antivirales'],     tendencia: +24, color: '#F27405' },
    { id: 'r3', nombre: 'Región Sur',       x: 68, y: 72, z: 320, casos: 5430, medicamentos: ['Antiparasitarios','SRO'],       tendencia: +12, color: '#F59E0B' },
    { id: 'r4', nombre: 'Región Bajío',     x: 55, y: 48, z: 240, casos: 3870, medicamentos: ['Antialérgicos','Vitaminas'],    tendencia:  +7, color: '#10B981' },
    { id: 'r5', nombre: 'Región Occidente', x: 60, y: 55, z: 260, casos: 4210, medicamentos: ['Respiratorios','Crónicos'],     tendencia:  +9, color: '#008CAE' },
    { id: 'r6', nombre: 'Región Sureste',   x: 48, y: 42, z: 190, casos: 2980, medicamentos: ['Tropicales','Gastrointestinal'],tendencia:  +5, color: '#8B5CF6' },
  ],
  temporalidad: [
    { id: 't1', nombre: 'Temporada Frío (Dic-Feb)',    x: 92, y: 88, z: 480, casos: 11240, medicamentos: ['Antigripales','Antibióticos','Broncodilatadores'], tendencia: +42, color: '#EF4444' },
    { id: 't2', nombre: 'Temporada Calor (Jun-Ago)',   x: 74, y: 65, z: 320, casos:  6890, medicamentos: ['SRO','Antiparasitarios','Antifúngicos'],           tendencia: +18, color: '#F59E0B' },
    { id: 't3', nombre: 'Primavera Alergias (Mar-May)',x: 62, y: 48, z: 260, casos:  4230, medicamentos: ['Antihistamínicos','Corticosteroides'],              tendencia: +12, color: '#8B5CF6' },
    { id: 't4', nombre: 'Regreso Clases (Ago-Sep)',    x: 78, y: 74, z: 340, casos:  7120, medicamentos: ['Pediátricos','Antibióticos','Vitaminas'],           tendencia: +28, color: '#F27405' },
    { id: 't5', nombre: 'Otoño Estable (Oct-Nov)',     x: 42, y: 38, z: 180, casos:  2840, medicamentos: ['Crónicos','Vitamina D'],                           tendencia:  -4, color: '#10B981' },
  ],
  perfil: [
    { id: 'p1', nombre: 'Adulto Mayor 60+',   x: 55, y: 68, z: 320, casos: 5840, medicamentos: ['Antihipertensivos','Antidiabéticos','Estatinas'],    tendencia:  +8, color: '#008CAE' },
    { id: 'p2', nombre: 'Pediátrico 0-12',    x: 80, y: 84, z: 380, casos: 7120, medicamentos: ['Antibióticos pediátricos','Antipiréticos','Vitaminas'],tendencia: +22, color: '#F27405' },
    { id: 'p3', nombre: 'Adulto Joven 18-40', x: 65, y: 52, z: 280, casos: 4980, medicamentos: ['Analgésicos','Anticonceptivos','Vitaminas'],           tendencia: +11, color: '#10B981' },
    { id: 'p4', nombre: 'Adulto Medio 40-60', x: 58, y: 62, z: 240, casos: 4120, medicamentos: ['Antihipertensivos','Analgésicos','Gastro'],            tendencia:  +9, color: '#8B5CF6' },
    { id: 'p5', nombre: 'Embarazo/Lactancia', x: 44, y: 55, z: 160, casos: 1980, medicamentos: ['Ácido fólico','Hierro','Calcio'],                      tendencia:  +4, color: '#EC4899' },
  ],
};

const segmentosTabla: Record<EjeClusters, SegmentoTabla[]> = {
  enfermedad: [
    { segmento: 'Respiratoria Aguda',  descripcion: 'Brote activo en 12 estados',         casos: 8420, skus: 28, riesgo: 'critico', tendencia: +28, color: '#EF4444' },
    { segmento: 'Pediátrica',          descripcion: 'Alta correlación escolar',            casos: 2980, skus: 18, riesgo: 'critico', tendencia: +22, color: '#F27405' },
    { segmento: 'Viral Estacional',    descripcion: 'Aumento anormal región norte',        casos: 3870, skus: 22, riesgo: 'alto',    tendencia: +19, color: '#8B5CF6' },
    { segmento: 'Gastrointestinal',    descripcion: 'Pico estacional detectado',           casos: 5103, skus: 15, riesgo: 'alto',    tendencia: +14, color: '#F59E0B' },
    { segmento: 'Crónica Recurrente',  descripcion: 'Estable, monitoreo preventivo',       casos: 1580, skus: 32, riesgo: 'medio',   tendencia:  +3, color: '#008CAE' },
    { segmento: 'Alérgica',            descripcion: 'Tendencia descendente temporal',      casos: 2241, skus: 12, riesgo: 'bajo',    tendencia:  -6, color: '#10B981' },
  ],
  region: [
    { segmento: 'Región Centro',    descripcion: '18 estados, mayor densidad',     casos: 9120, skus: 42, riesgo: 'critico', tendencia: +24, color: '#F27405' },
    { segmento: 'Región Norte',     descripcion: 'Presión en antibióticos',        casos: 6840, skus: 35, riesgo: 'critico', tendencia: +18, color: '#EF4444' },
    { segmento: 'Región Sur',       descripcion: 'Gastrointestinal dominante',     casos: 5430, skus: 28, riesgo: 'alto',    tendencia: +12, color: '#F59E0B' },
    { segmento: 'Región Occidente', descripcion: 'Mix crónico-respiratorio',       casos: 4210, skus: 30, riesgo: 'medio',   tendencia:  +9, color: '#008CAE' },
    { segmento: 'Región Bajío',     descripcion: 'Bajo riesgo, stock adecuado',    casos: 3870, skus: 25, riesgo: 'bajo',    tendencia:  +7, color: '#10B981' },
    { segmento: 'Región Sureste',   descripcion: 'Enfermedades tropicales activas',casos: 2980, skus: 20, riesgo: 'medio',   tendencia:  +5, color: '#8B5CF6' },
  ],
  temporalidad: [
    { segmento: 'Temporada Frío',         descripcion: 'Dic-Feb · Pico máximo anual',      casos: 11240, skus: 48, riesgo: 'critico', tendencia: +42, color: '#EF4444' },
    { segmento: 'Regreso a Clases',       descripcion: 'Ago-Sep · Brote pediátrico',       casos:  7120, skus: 32, riesgo: 'critico', tendencia: +28, color: '#F27405' },
    { segmento: 'Temporada Calor',        descripcion: 'Jun-Ago · Gastrointestinal',       casos:  6890, skus: 25, riesgo: 'alto',    tendencia: +18, color: '#F59E0B' },
    { segmento: 'Primavera Alergias',     descripcion: 'Mar-May · Pico alérgico',          casos:  4230, skus: 18, riesgo: 'medio',   tendencia: +12, color: '#8B5CF6' },
    { segmento: 'Otoño Estable',          descripcion: 'Oct-Nov · Demanda controlada',     casos:  2840, skus: 15, riesgo: 'bajo',    tendencia:  -4, color: '#10B981' },
  ],
  perfil: [
    { segmento: 'Pediátrico 0-12',    descripcion: 'Mayor riesgo, alta rotación',        casos: 7120, skus: 38, riesgo: 'critico', tendencia: +22, color: '#F27405' },
    { segmento: 'Adulto Joven 18-40', descripcion: 'Demanda estable, analgésicos',       casos: 4980, skus: 28, riesgo: 'alto',    tendencia: +11, color: '#10B981' },
    { segmento: 'Adulto Medio 40-60', descripcion: 'Creciente, crónicos + agudos',       casos: 4120, skus: 32, riesgo: 'alto',    tendencia:  +9, color: '#8B5CF6' },
    { segmento: 'Adulto Mayor 60+',   descripcion: 'Alta dependencia medicamentos',      casos: 5840, skus: 45, riesgo: 'medio',   tendencia:  +8, color: '#008CAE' },
    { segmento: 'Embarazo/Lactancia', descripcion: 'Segmento especializado estable',    casos: 1980, skus: 15, riesgo: 'bajo',    tendencia:  +4, color: '#EC4899' },
  ],
};

const nivelRiesgoCfg = {
  critico: { color: '#EF4444', bg: '#EF444415', label: 'Crítico' },
  alto:    { color: '#F59E0B', bg: '#F59E0B15', label: 'Alto'    },
  medio:   { color: '#008CAE', bg: '#008CAE15', label: 'Medio'   },
  bajo:    { color: '#10B981', bg: '#10B98115', label: 'Bajo'    },
};

const ejesConfig: { id: EjeClusters; label: string; icono: React.ReactNode }[] = [
  { id: 'enfermedad',   label: 'Por Enfermedad',    icono: <Activity size={14} /> },
  { id: 'region',       label: 'Por Región',         icono: <MapPin size={14} />   },
  { id: 'temporalidad', label: 'Por Temporalidad',   icono: <Calendar size={14} /> },
  { id: 'perfil',       label: 'Por Perfil Paciente',icono: <Users size={14} />    },
];

// ── Tooltip personalizado ──────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }: any) => {
  const { colores } = brandingConfig;
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ClusterBurbuja;
  return (
    <div
      style={{
        background: colores.fondoSecundario,
        border: `1px solid ${d.color}40`,
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        maxWidth: '200px',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro, marginBottom: '6px' }}>
        {d.nombre}
      </div>
      <div style={{ fontSize: '11px', color: colores.textoMedio, marginBottom: '4px' }}>
        Casos: <strong style={{ color: d.color }}>{d.casos.toLocaleString()}</strong>
      </div>
      <div style={{ fontSize: '11px', color: colores.textoMedio, marginBottom: '4px' }}>
        Demanda: <strong style={{ color: colores.textoClaro }}>{d.x}%</strong>
      </div>
      <div style={{ fontSize: '11px', color: colores.textoMedio, marginBottom: '8px' }}>
        Riesgo: <strong style={{ color: colores.textoClaro }}>{d.y}%</strong>
      </div>
      <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: '6px' }}>
        {d.medicamentos.slice(0, 2).map((m, i) => (
          <div key={i} style={{ fontSize: '10px', color: colores.textoMedio }}>· {m}</div>
        ))}
      </div>
    </div>
  );
};

// ── Componente principal ───────────────────────────────────────────────────────

export const ClustersSegmentacion: React.FC = () => {
  const { colores } = brandingConfig;
  const [ejeActivo, setEjeActivo] = useState<EjeClusters>('enfermedad');
  const [clusterSeleccionado, setClusterSeleccionado] = useState<string | null>(null);

  const burbujas = clustersData[ejeActivo];
  const tabla = segmentosTabla[ejeActivo];
  const clusterDetalle = clusterSeleccionado ? burbujas.find(b => b.id === clusterSeleccionado) : null;

  return (
    <div
      style={{
        background: colores.fondoSecundario,
        borderRadius: '24px',
        padding: '28px',
        border: `1px solid ${colores.borde}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6',
                animation: 'pulseCluster 2s infinite',
              }}
            />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: colores.textoClaro, margin: 0, letterSpacing: '-0.3px' }}>
              Clusters de Segmentación IA
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>
            Agrupación inteligente por patrones de consumo y demanda · {burbujas.length} clusters activos
          </p>
        </div>

        {/* Selector de eje */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {ejesConfig.map(e => (
            <button
              key={e.id}
              onClick={() => { setEjeActivo(e.id); setClusterSeleccionado(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '10px', border: 'none',
                fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                transition: 'all 0.2s',
                background: ejeActivo === e.id ? '#8B5CF6' : colores.fondoTerciario,
                color: ejeActivo === e.id ? '#fff' : colores.textoMedio,
              }}
            >
              {e.icono} {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout: scatter + tabla */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Scatter chart de burbujas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: colores.textoMedio, fontWeight: '600' }}>
              Intensidad de demanda vs Riesgo de desabasto · tamaño = volumen casos
            </span>
          </div>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 20 }}>
                <XAxis
                  type="number" dataKey="x" name="Demanda" domain={[20, 100]}
                  tick={{ fontSize: 10, fill: colores.textoOscuro }} axisLine={false} tickLine={false}
                  label={{ value: 'Intensidad demanda %', position: 'insideBottom', offset: -10, style: { fontSize: 10, fill: colores.textoMedio } }}
                />
                <YAxis
                  type="number" dataKey="y" name="Riesgo" domain={[20, 100]}
                  tick={{ fontSize: 10, fill: colores.textoOscuro }} axisLine={false} tickLine={false}
                  label={{ value: 'Riesgo desabasto %', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: colores.textoMedio } }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 500]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  data={burbujas}
                  onClick={(data) => setClusterSeleccionado(prev => prev === data.id ? null : data.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {burbujas.map((b) => (
                    <Cell
                      key={b.id}
                      fill={b.color}
                      fillOpacity={clusterSeleccionado && clusterSeleccionado !== b.id ? 0.25 : 0.8}
                      stroke={clusterSeleccionado === b.id ? b.color : 'transparent'}
                      strokeWidth={3}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Detalle cluster seleccionado */}
          {clusterDetalle ? (
            <div
              style={{
                background: colores.fondoTerciario,
                borderRadius: '14px',
                padding: '14px 16px',
                border: `1px solid ${clusterDetalle.color}40`,
                animation: 'fadeInCluster 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>
                  {clusterDetalle.nombre}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '700', color: clusterDetalle.tendencia > 0 ? '#EF4444' : '#10B981' }}>
                  {clusterDetalle.tendencia > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {clusterDetalle.tendencia > 0 ? '+' : ''}{clusterDetalle.tendencia}%
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'Casos', valor: clusterDetalle.casos.toLocaleString() },
                  { label: 'Demanda', valor: `${clusterDetalle.x}%` },
                  { label: 'Riesgo', valor: `${clusterDetalle.y}%` },
                ].map((m, i) => (
                  <div key={i} style={{ flex: 1, background: colores.fondoSecundario, borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: clusterDetalle.color }}>{m.valor}</div>
                    <div style={{ fontSize: '10px', color: colores.textoMedio }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: colores.textoMedio }}>
                Medicamentos clave: {clusterDetalle.medicamentos.join(' · ')}
              </div>
            </div>
          ) : (
            <div style={{ background: colores.fondoTerciario, borderRadius: '14px', padding: '12px 16px', border: `1px solid ${colores.borde}`, textAlign: 'center' }}>
              <Layers size={20} color={colores.textoOscuro} style={{ margin: '0 auto 4px' }} />
              <p style={{ fontSize: '11px', color: colores.textoMedio, margin: 0 }}>
                Haz clic en una burbuja para ver el detalle del cluster
              </p>
            </div>
          )}
        </div>

        {/* Tabla de segmentos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: colores.textoClaro }}>
            Segmentos ordenados por riesgo
          </span>
          {tabla.map((seg, i) => {
            const cfg = nivelRiesgoCfg[seg.riesgo];
            return (
              <div
                key={i}
                style={{
                  background: colores.fondoTerciario,
                  borderRadius: '14px',
                  padding: '12px 16px',
                  border: `1px solid ${cfg.color}25`,
                  borderLeft: `4px solid ${cfg.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${cfg.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Color dot */}
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: colores.textoClaro }}>{seg.segmento}</div>
                  <div style={{ fontSize: '10px', color: colores.textoMedio }}>{seg.descripcion}</div>
                </div>

                {/* Métricas */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>{seg.casos.toLocaleString()}</div>
                    <div style={{ fontSize: '9px', color: colores.textoMedio }}>casos</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>{seg.skus}</div>
                    <div style={{ fontSize: '9px', color: colores.textoMedio }}>SKUs</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '700', color: seg.tendencia > 0 ? '#EF4444' : '#10B981' }}>
                    {seg.tendencia > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {seg.tendencia > 0 ? '+' : ''}{seg.tendencia}%
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: cfg.color, background: cfg.bg, padding: '3px 8px', borderRadius: '6px' }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <button
            style={{
              marginTop: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '12px',
              border: `1px solid ${colores.borde}`, background: 'transparent',
              color: '#8B5CF6', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#8B5CF615'; e.currentTarget.style.borderColor = '#8B5CF6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colores.borde; }}
          >
            Ver análisis completo de clusters <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseCluster {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes fadeInCluster {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight, ArrowRightLeft, Package, TrendingUp,
  ChevronRight, Truck, AlertTriangle, CheckCircle,
  Clock, MapPin, Zap, Filter, RefreshCw, Timer, ArrowDown,
} from 'lucide-react';
import { brandingConfig } from '../../../config/branding';

type NivelRiesgo = 'critico' | 'alto' | 'medio' | 'ok';
type Categoria   = 'Todos' | 'Antibióticos' | 'Analgésicos' | 'Vitaminas' | 'Gastro' | 'Diabetes';
type TabActivo   = 'riesgo' | 'recomendaciones' | 'ocioso';

interface ProductoRiesgo {
  sku: string; nombre: string; categoria: Categoria; stockActual: number;
  demandaEsperada: number; nivel: NivelRiesgo; sucursalesAfectadas: number; diasHastaQuiebre: number;
}
interface Recomendacion {
  id: string; tipo: 'transferencia' | 'reposicion' | 'urgente';
  producto: string; de: string; hacia: string; unidades: number; impacto: string;
}
interface ProductoOcioso {
  sku: string; nombre: string; categoria: string; stockOcioso: number;
  valorMXN: number; region: string; diasSinMovimiento: number; destinoSugerido: string;
}
interface RegionSemaforo {
  nombre: string; abrev: string; cobertura: number; nivel: NivelRiesgo; productos: number;
}

const productosRiesgo: ProductoRiesgo[] = [
  { sku: 'ANT-001', nombre: 'Amoxicilina 500mg c/15',     categoria: 'Antibióticos', stockActual: 3,  demandaEsperada: 42, nivel: 'critico', sucursalesAfectadas: 38, diasHastaQuiebre: 2  },
  { sku: 'ANT-002', nombre: 'Azitromicina 500mg c/6',     categoria: 'Antibióticos', stockActual: 5,  demandaEsperada: 31, nivel: 'critico', sucursalesAfectadas: 24, diasHastaQuiebre: 4  },
  { sku: 'ANL-003', nombre: 'Ibuprofeno 400mg c/20',      categoria: 'Analgésicos',  stockActual: 7,  demandaEsperada: 18, nivel: 'alto',    sucursalesAfectadas: 17, diasHastaQuiebre: 7  },
  { sku: 'VIT-004', nombre: 'Vitamina C 1g efervescente', categoria: 'Vitaminas',    stockActual: 9,  demandaEsperada: 22, nivel: 'alto',    sucursalesAfectadas: 12, diasHastaQuiebre: 9  },
  { sku: 'GAS-005', nombre: 'Omeprazol 20mg c/14',        categoria: 'Gastro',       stockActual: 12, demandaEsperada:  9, nivel: 'medio',   sucursalesAfectadas:  8, diasHastaQuiebre: 14 },
  { sku: 'DIA-006', nombre: 'Metformina 850mg c/30',      categoria: 'Diabetes',     stockActual: 18, demandaEsperada:  4, nivel: 'ok',      sucursalesAfectadas:  2, diasHastaQuiebre: 21 },
];

const recomendaciones: Recomendacion[] = [
  { id: '1', tipo: 'urgente',       producto: 'Amoxicilina 500mg',  de: 'CEDIS Monterrey', hacia: 'Región Veracruz', unidades: 4800, impacto: 'Cubre 38 suc. por 7 días'   },
  { id: '2', tipo: 'transferencia', producto: 'Azitromicina 500mg', de: 'Región Bajío',    hacia: 'Región Centro',   unidades: 2400, impacto: 'Reduce riesgo en 24 suc.'   },
  { id: '3', tipo: 'transferencia', producto: 'Ibuprofeno 400mg',   de: 'CEDIS CDMX',      hacia: 'Región Norte',    unidades: 3200, impacto: 'Previene quiebre 17 suc.'   },
  { id: '4', tipo: 'reposicion',    producto: 'Vitamina C 1g',      de: 'Proveedor Alfa',  hacia: 'Nacional',        unidades: 6000, impacto: 'Cubre temporada alta'       },
];

const productosOciosos: ProductoOcioso[] = [
  { sku: 'ANL-098', nombre: 'Aspirina 500mg c/20',    categoria: 'Analgésicos',  stockOcioso: 12400, valorMXN: 186000, region: 'Región Pacífico',  diasSinMovimiento: 45, destinoSugerido: 'Región Centro'  },
  { sku: 'VIT-112', nombre: 'Complejo B c/30',         categoria: 'Vitaminas',    stockOcioso:  8700, valorMXN: 130500, region: 'Región Sur',       diasSinMovimiento: 38, destinoSugerido: 'Región Norte'   },
  { sku: 'GAS-034', nombre: 'Ranitidina 300mg c/20',  categoria: 'Gastro',       stockOcioso:  6200, valorMXN:  93000, region: 'Región Bajío',     diasSinMovimiento: 52, destinoSugerido: 'Región Sureste' },
  { sku: 'DIA-055', nombre: 'Glibenclamida 5mg c/30', categoria: 'Diabetes',     stockOcioso:  4800, valorMXN:  72000, region: 'Región Noroeste',  diasSinMovimiento: 61, destinoSugerido: 'Región Centro'  },
  { sku: 'ANT-076', nombre: 'Trimetoprim 160mg c/10', categoria: 'Antibióticos', stockOcioso:  3900, valorMXN:  58500, region: 'Región Occidente', diasSinMovimiento: 34, destinoSugerido: 'Región Sur'     },
];

const regionesSemaforo: RegionSemaforo[] = [
  { nombre: 'Región Norte',    abrev: 'NOR', cobertura: 34, nivel: 'critico', productos: 12 },
  { nombre: 'Región Centro',   abrev: 'CEN', cobertura: 51, nivel: 'alto',    productos:  8 },
  { nombre: 'Región Sur',      abrev: 'SUR', cobertura: 58, nivel: 'alto',    productos:  6 },
  { nombre: 'Región Bajío',    abrev: 'BAJ', cobertura: 74, nivel: 'medio',   productos:  3 },
  { nombre: 'Región Pacífico', abrev: 'PAC', cobertura: 82, nivel: 'ok',      productos:  1 },
  { nombre: 'Región CDMX',     abrev: 'CMX', cobertura: 88, nivel: 'ok',      productos:  0 },
];

const categorias: Categoria[] = ['Todos', 'Antibióticos', 'Analgésicos', 'Vitaminas', 'Gastro', 'Diabetes'];

const nivelCfg: Record<NivelRiesgo, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  critico: { color: '#EF4444', bg: '#EF444415', label: 'Crítico', icon: <AlertTriangle size={12} /> },
  alto:    { color: '#F59E0B', bg: '#F59E0B15', label: 'Alto',    icon: <Clock size={12} />          },
  medio:   { color: '#008CAE', bg: '#008CAE15', label: 'Medio',   icon: <TrendingUp size={12} />     },
  ok:      { color: '#10B981', bg: '#10B98115', label: 'OK',      icon: <CheckCircle size={12} />    },
};

const tipoCfg: Record<Recomendacion['tipo'], { color: string; bg: string; label: string }> = {
  urgente:       { color: '#EF4444', bg: '#EF444415', label: 'Urgente'       },
  transferencia: { color: '#008CAE', bg: '#008CAE15', label: 'Transfer.'     },
  reposicion:    { color: '#10B981', bg: '#10B98115', label: 'Reposición'    },
};

const Countdown: React.FC<{ dias: number; nivel: NivelRiesgo }> = ({ dias, nivel }) => {
  const [tick, setTick] = useState(0);
  const cfg = nivelCfg[nivel];
  useEffect(() => {
    if (nivel === 'critico') {
      const t = setInterval(() => setTick(p => p + 1), 1000);
      return () => clearInterval(t);
    }
  }, [nivel]);
  const h = String(23 - (tick % 24)).padStart(2, '0');
  const m = String(59 - (tick % 60)).padStart(2, '0');
  const s = String(59 - (tick % 60)).padStart(2, '0');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 8px', borderRadius: '10px', background: cfg.bg, border: `1px solid ${cfg.color}40`, minWidth: '60px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: cfg.color }}>
        <Timer size={9} /><span style={{ fontSize: '8px', fontWeight: '700' }}>QUIEBRE</span>
      </div>
      {nivel === 'critico' ? (
        <div style={{ fontSize: '11px', fontWeight: '800', color: cfg.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>{h}:{m}:{s}</div>
      ) : (
        <div style={{ fontSize: '14px', fontWeight: '800', color: cfg.color }}>{dias}d</div>
      )}
    </div>
  );
};

export const DashboardAbastecimiento: React.FC = () => {
  const { colores } = brandingConfig;
  const [tabActivo, setTabActivo]               = useState<TabActivo>('riesgo');
  const [recsAceptadas, setRecsAceptadas]       = useState<string[]>([]);
  const [categoriaFiltro, setCategoriaFiltro]   = useState<Categoria>('Todos');
  const [ociososAceptados, setOciososAceptados] = useState<string[]>([]);
  const [isMobile, setIsMobile]                 = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const aceptarRec    = (id: string)  => setRecsAceptadas(p   => p.includes(id)  ? p.filter(r => r !== id)  : [...p, id]);
  const aceptarOcioso = (sku: string) => setOciososAceptados(p => p.includes(sku) ? p.filter(s => s !== sku) : [...p, sku]);

  const productosFiltrados = categoriaFiltro === 'Todos' ? productosRiesgo : productosRiesgo.filter(p => p.categoria === categoriaFiltro);
  const criticos     = productosRiesgo.filter(p => p.nivel === 'critico').length;
  const altos        = productosRiesgo.filter(p => p.nivel === 'alto').length;
  const sucAfectadas = productosRiesgo.reduce((s, p) => s + p.sucursalesAfectadas, 0);
  const valorOcioso  = productosOciosos.reduce((s, p) => s + p.valorMXN, 0);

  // Labels cortos para móvil
  const tabs = [
    { id: 'riesgo'          as TabActivo, label: isMobile ? 'Riesgo'   : 'Productos en riesgo',  badge: productosRiesgo.filter(p => ['critico','alto'].includes(p.nivel)).length },
    { id: 'recomendaciones' as TabActivo, label: isMobile ? 'IA'       : 'Recomendaciones IA',   badge: recomendaciones.length - recsAceptadas.length },
    { id: 'ocioso'          as TabActivo, label: isMobile ? 'Ocioso'   : 'Inventario Ocioso',    badge: productosOciosos.length },
  ];

  return (
    <div style={{ background: colores.fondoSecundario, borderRadius: '24px', padding: isMobile ? '16px' : '28px', border: `1px solid ${colores.borde}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B', animation: 'pulseAbast2 2s infinite', flexShrink: 0 }} />
            <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: colores.textoClaro, margin: 0, letterSpacing: '-0.3px' }}>Abastecimiento Predictivo</h3>
          </div>
          <p style={{ fontSize: '12px', color: colores.textoMedio, margin: '4px 0 0 20px' }}>Riesgos · Inventario ocioso · Recomendaciones IA</p>
        </div>
        {/* KPIs — scroll horizontal en móvil */}
        <div style={{ display: 'flex', gap: '8px', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : 0, scrollbarWidth: 'none' }}>
          {[
            { val: criticos,     label: 'críticos',       color: '#EF4444' },
            { val: altos,        label: 'en alerta',      color: '#F59E0B' },
            { val: sucAfectadas, label: 'suc. en riesgo', color: '#008CAE' },
          ].map((k, i) => (
            <div key={i} style={{ padding: '8px 12px', borderRadius: '14px', background: `${k.color}15`, border: `1px solid ${k.color}30`, textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: k.color }}>{k.val}</div>
              <div style={{ fontSize: '10px', color: colores.textoMedio, whiteSpace: 'nowrap' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout: columnas en desktop, stack en móvil */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 220px', gap: isMobile ? '14px' : '20px' }}>

        {/* Columna principal: tabs + contenido */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: colores.fondoTerciario, borderRadius: '12px', padding: '4px', border: `1px solid ${colores.borde}`, gap: '2px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setTabActivo(tab.id)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: isMobile ? '8px 4px' : '8px 10px', borderRadius: '9px', border: 'none', fontSize: isMobile ? '11px' : '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: tabActivo === tab.id ? colores.primario : 'transparent', color: tabActivo === tab.id ? '#fff' : colores.textoMedio }}>
                {tab.label}
                {tab.badge > 0 && (
                  <span style={{ background: tabActivo === tab.id ? 'rgba(255,255,255,0.3)' : `${colores.peligro}20`, color: tabActivo === tab.id ? '#fff' : colores.peligro, borderRadius: '6px', padding: '1px 5px', fontSize: '10px', fontWeight: '800' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB: Riesgo */}
          {tabActivo === 'riesgo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Filtros categoría — scroll horizontal en móvil */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                <Filter size={13} color={colores.textoMedio} style={{ flexShrink: 0 }} />
                {categorias.map(c => (
                  <button key={c} onClick={() => setCategoriaFiltro(c)}
                    style={{ padding: '3px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: categoriaFiltro === c ? colores.primario : colores.fondoTerciario, color: categoriaFiltro === c ? '#fff' : colores.textoMedio, flexShrink: 0, whiteSpace: 'nowrap' }}>{c}
                  </button>
                ))}
              </div>

              {productosFiltrados.map(p => {
                const cfg = nivelCfg[p.nivel];
                return (
                  <div key={p.sku}
                    style={{ background: colores.fondoTerciario, borderRadius: '14px', padding: isMobile ? '12px' : '14px 16px', border: `1px solid ${cfg.color}30`, borderLeft: `4px solid ${cfg.color}`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px', transition: 'all 0.2s' }}>
                    {/* Fila superior en móvil: icono + nombre + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}><Package size={18} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: colores.textoClaro }}>{p.nombre}</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: cfg.color, background: cfg.bg, padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>{cfg.icon} {cfg.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: colores.textoMedio }}>SKU: <strong style={{ color: colores.textoClaro }}>{p.sku}</strong></span>
                          <span style={{ fontSize: '11px', color: colores.textoMedio }}>Cat: <strong style={{ color: colores.textoClaro }}>{p.categoria}</strong></span>
                        </div>
                      </div>
                    </div>
                    {/* Stats en fila horizontal siempre */}
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: p.stockActual <= 5 ? '#EF4444' : p.stockActual <= 10 ? '#F59E0B' : colores.exito }}>{p.stockActual}d</div>
                        <div style={{ fontSize: '9px', color: colores.textoMedio }}>cobertura</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={11} />+{p.demandaEsperada}%</div>
                        <div style={{ fontSize: '9px', color: colores.textoMedio }}>demanda</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: colores.textoClaro }}>{p.sucursalesAfectadas}</div>
                        <div style={{ fontSize: '9px', color: colores.textoMedio }}>sucursales</div>
                      </div>
                      <Countdown dias={p.diasHastaQuiebre} nivel={p.nivel} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Recomendaciones */}
          {tabActivo === 'recomendaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recomendaciones.map(r => {
                const cfg = tipoCfg[r.tipo];
                const aceptada = recsAceptadas.includes(r.id);
                return (
                  <div key={r.id} style={{ background: aceptada ? `${colores.exito}10` : colores.fondoTerciario, borderRadius: '16px', padding: '16px', border: `1px solid ${aceptada ? colores.exito + '40' : cfg.color + '30'}`, transition: 'all 0.25s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: aceptada ? colores.exito : cfg.color, background: aceptada ? `${colores.exito}15` : cfg.bg, padding: '3px 10px', borderRadius: '8px' }}>{aceptada ? '✓ Aceptada' : cfg.label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colores.textoClaro }}>{r.producto}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: colores.primario }}>{r.unidades.toLocaleString()} uds</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: colores.fondoSecundario, borderRadius: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <MapPin size={13} color={colores.textoMedio} />
                      <span style={{ fontSize: '12px', color: colores.textoClaro, fontWeight: '600' }}>{r.de}</span>
                      <ArrowRightLeft size={13} color={colores.primario} />
                      <span style={{ fontSize: '12px', color: colores.textoClaro, fontWeight: '600' }}>{r.hacia}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: colores.textoMedio }}>💡 {r.impacto}</span>
                      <button onClick={() => aceptarRec(r.id)} style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: aceptada ? `${colores.exito}20` : colores.primario, color: aceptada ? colores.exito : '#fff' }}>
                        {aceptada ? '✓ Aceptada' : 'Aceptar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Ocioso */}
          {tabActivo === 'ocioso' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: `${colores.acento}10`, borderRadius: '14px', padding: '14px 16px', border: `1px solid ${colores.acento}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Valor total en inventario ocioso</div>
                  <div style={{ fontSize: '11px', color: colores.textoMedio }}>Productos sin movimiento +30 días</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: colores.acento }}>${(valorOcioso / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: '10px', color: colores.textoMedio }}>MXN</div>
                </div>
              </div>
              {productosOciosos.map(p => {
                const aceptado = ociososAceptados.includes(p.sku);
                const urgencia = p.diasSinMovimiento > 50 ? 'alto' : p.diasSinMovimiento > 35 ? 'medio' : 'ok';
                const urgCfg = nivelCfg[urgencia as NivelRiesgo];
                return (
                  <div key={p.sku}
                    style={{ background: aceptado ? `${colores.exito}08` : colores.fondoTerciario, borderRadius: '14px', padding: '12px 14px', border: `1px solid ${aceptado ? colores.exito + '30' : urgCfg.color + '25'}`, borderLeft: `4px solid ${aceptado ? colores.exito : urgCfg.color}`, transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: aceptado ? `${colores.exito}15` : urgCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: aceptado ? colores.exito : urgCfg.color, flexShrink: 0 }}><RefreshCw size={16} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: colores.textoClaro, marginBottom: '4px' }}>{p.nombre}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', color: colores.textoMedio }}>Región: <strong style={{ color: colores.textoClaro }}>{p.region}</strong></span>
                          <span style={{ fontSize: '10px', color: urgCfg.color, fontWeight: '700' }}>{p.diasSinMovimiento}d sin mov.</span>
                        </div>
                        {/* Stats en fila */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>{p.stockOcioso.toLocaleString()}</div>
                            <div style={{ fontSize: '9px', color: colores.textoMedio }}>unidades</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: colores.acento }}>${(p.valorMXN / 1000).toFixed(0)}K</div>
                            <div style={{ fontSize: '9px', color: colores.textoMedio }}>MXN</div>
                          </div>
                          <button onClick={() => aceptarOcioso(p.sku)} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: aceptado ? `${colores.exito}20` : `${colores.primario}15`, color: aceptado ? colores.exito : colores.primario, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {aceptado ? <CheckCircle size={12} /> : <ArrowDown size={12} />}
                            {aceptado ? 'Enviado' : 'Redistribuir'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {!aceptado && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: colores.fondoSecundario, borderRadius: '8px' }}>
                        <MapPin size={11} color={colores.textoMedio} />
                        <span style={{ fontSize: '11px', color: colores.textoMedio }}>Destino:</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: colores.primario }}>{p.destinoSugerido}</span>
                        <ArrowUpRight size={11} color={colores.primario} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Semáforo regional — en móvil va debajo */}
        <div style={{ background: colores.fondoTerciario, borderRadius: '18px', padding: '18px', border: `1px solid ${colores.borde}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Semáforo Regional</span>
            <Truck size={16} color={colores.primario} />
          </div>
          {/* En móvil: 2 columnas para el semáforo */}
          <div style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, flexDirection: isMobile ? undefined : 'column', gap: '10px' }}>
            {regionesSemaforo.map(r => {
              const cfg = nivelCfg[r.nivel];
              return (
                <div key={r.abrev} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, boxShadow: r.nivel === 'critico' ? `0 0 6px ${cfg.color}` : 'none', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: '700', color: colores.textoClaro }}>{isMobile ? r.abrev : r.nombre}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: cfg.color }}>{r.cobertura}%</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '5px', background: `${cfg.color}20`, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.cobertura}%`, background: cfg.color, borderRadius: '5px', transition: 'width 0.6s ease' }} />
                  </div>
                  {r.productos > 0 && <span style={{ fontSize: '9px', color: cfg.color }}>{r.productos} en riesgo</span>}
                </div>
              );
            })}
          </div>
          <button style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', border: `1px solid ${colores.borde}`, background: 'transparent', color: colores.primario, fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${colores.primario}12`; e.currentTarget.style.borderColor = colores.primario; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = colores.borde; }}>
            Ver plan de abasto <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Alerta */}
      <div style={{ background: `linear-gradient(135deg, ${colores.primario}12 0%, ${colores.acento}08 100%)`, border: `1px solid ${colores.primario}25`, borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${colores.primario}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Zap size={18} color={colores.primario} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colores.textoClaro }}>Acción recomendada · Antibióticos pediátricos · Región Centro</div>
          <div style={{ fontSize: '12px', color: colores.textoMedio, marginTop: '2px' }}>Riesgo alto de desabasto en los próximos 5 días. Demanda esperada supera inventario en 18 sucursales.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: colores.primario, fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
            Activar reabasto <ArrowUpRight size={14} />
          </div>
        </div>
      </div>

      <style>{`@keyframes pulseAbast2 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }`}</style>
    </div>
  );
};
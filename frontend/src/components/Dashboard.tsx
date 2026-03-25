import React from 'react';
import { brandingConfig } from '../config/branding';
import { WelcomeHeader } from './modules/dashboardModules/WelcomeHeader';
import { HeroCard } from './modules/dashboardModules/Herocard';
import { EpidemologiaModule } from './modules/dashboardModules/EpidemologiaModule';
import { ProductivityChart } from './modules/dashboardModules/Productivitychart';
import { TopCoursesCard } from './modules/dashboardModules/Topcoursescard';
import { ExpandableModule } from './modules/dashboardModules/ExpandableModule';
import { OfertasCard } from './modules/dashboardModules/Ofertascard';
import { AbastecimientoModule } from './modules/dashboardModules/AbastecimientoModule';
import { DashboardEjecutivo } from './modules/dashboardModules/DashboardejecutivoModule';
import { MapaCalorModule } from './modules/dashboardModules/MapaCalorModule';
import { ClustersSegmentacion } from './modules/dashboardModules/ClusterModule';

interface DashboardProps {
  onSectionChange?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  const { colores } = brandingConfig;

  return (
    <div style={{ minHeight: '100vh', background: colores.fondoPrincipal, padding: '32px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <WelcomeHeader />

        {/* Fila 1a: Abastecimiento | HeroCard + Video | Epidemiología */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          marginBottom: '24px',
          alignItems: 'stretch',
        }}>

          {/* Columna izquierda */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
            <ExpandableModule expandDirection="right">
              <AbastecimientoModule enableVideo={true} onNavigate={onSectionChange} />
            </ExpandableModule>
          </div>

          {/* Columna central: HeroCard + Video que ocupa el espacio restante */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <HeroCard />
            {/* Video simiCentro — ocupa todo el espacio restante hasta igualar altura lateral */}
            <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '160px' }}>
              <video
                src="/assets/doctorCentro.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay sutil con gradiente */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Columna derecha */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
            <ExpandableModule expandDirection="left">
              <EpidemologiaModule enableVideo={true} onNavigate={onSectionChange} />
            </ExpandableModule>
          </div>
        </div>

        {/* Fila 1b: OfertasCard | DashboardEjecutivo | TopCoursesCard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          marginBottom: '24px',
          alignItems: 'stretch',
        }}>
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
            <OfertasCard />
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
            <ExpandableModule expandDirection="right">
              <DashboardEjecutivo onNavigate={onSectionChange} />
            </ExpandableModule>
          </div>

          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
            <TopCoursesCard />
          </div>
        </div>

        {/* Filas 2+3: MapaCalor + ProductivityChart | Clusters (span 2 filas) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: '24px',
        }}>
          {/* MapaCalor — fila 1, columnas 1-8 */}
          <div style={{ gridColumn: 'span 8', gridRow: '1' }}>
            <ExpandableModule expandDirection="right">
              <MapaCalorModule onNavigate={onSectionChange} />
            </ExpandableModule>
          </div>

          {/* Clusters — filas 1+2, columnas 9-12 */}
          <div style={{ gridColumn: 'span 4', gridRow: '1 / 3', display: 'flex', flexDirection: 'column' }}>
            <ExpandableModule expandDirection="left">
              <div style={{ height: '100%' }}>
                <ClustersSegmentacion onNavigate={onSectionChange} />
              </div>
            </ExpandableModule>
          </div>

          {/* ProductivityChart — fila 2, columnas 1-8 */}
          <div style={{ gridColumn: 'span 8', gridRow: '2' }}>
            <ProductivityChart />
          </div>
        </div>

        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: ${colores.fondoSecundario}40; border-radius: 4px; }
          ::-webkit-scrollbar-thumb { background: ${colores.primario}60; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: ${colores.primario}80; }
        `}</style>
      </div>
    </div>
  );
};
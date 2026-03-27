import React, { useState, useEffect } from 'react';
import { brandingConfig } from '../config/branding';
import { WelcomeHeader } from './modules/dashboardModules/WelcomeHeader';
import { HeroCard } from './modules/dashboardModules/Herocard';
import { ProductivityChart } from './modules/dashboardModules/Productivitychart';
import { TopCoursesCard } from './modules/dashboardModules/Topcoursescard';
import { ExpandableModule } from './modules/dashboardModules/ExpandableModule';
import { OfertasCard } from './modules/dashboardModules/Ofertascard';
import { RadiosEscuchadasCard } from './modules/dashboardModules/RadiosEscuchadasCard';
import { PalabrasBuscadasCard } from './modules/dashboardModules/PalabrasBuscadasCard';
import { CSVGeneradosCard } from './modules/dashboardModules/CSVGeneradosCard';

interface DashboardProps {
  onSectionChange?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  const { colores } = brandingConfig;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: colores.fondoPrincipal, padding: isMobile ? '16px' : '32px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <WelcomeHeader />

          {/* ── Fila 1: OfertasCard | HeroCard (centro) | TopCoursesCard ── */}
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              <HeroCard />
              <OfertasCard />
              <TopCoursesCard />
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 24, marginBottom: 24, alignItems: 'stretch',
            }}>
              <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
                <ExpandableModule expandDirection="right">
                  <OfertasCard />
                </ExpandableModule>
              </div>
              <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
                <HeroCard />
              </div>
              <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
                <TopCoursesCard />
              </div>
            </div>
          )}

        {/* ── Fila 2: Radios | Palabras | CSV ── */}
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
            <RadiosEscuchadasCard />
            <PalabrasBuscadasCard />
            <CSVGeneradosCard />
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 24, marginBottom: 24, alignItems: 'stretch',
          }}>
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
              <RadiosEscuchadasCard />
            </div>
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
              <PalabrasBuscadasCard />
            </div>
            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
              <CSVGeneradosCard />
            </div>
          </div>
        )}

        {/* ── Fila 3: ProductivityChart full width ── */}
        <div style={{ marginBottom: 24 }}>
          <ProductivityChart />
        </div>

        <style>{`
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
import React from 'react';
import { brandingConfig } from '../config/branding';
import { WelcomeHeader } from './modules/dashboardModules/WelcomeHeader';
import { HeroCard } from './modules/dashboardModules/Herocard';
import { MiniCalendarCard } from './modules/dashboardModules/Minicalendarcard';
import { LumelModule } from './modules/dashboardModules/LumelModule';
import { MonitorIAModule } from './modules/dashboardModules/MonitorIA';
import { ProductivityChart } from './modules/dashboardModules/Productivitychart';
import { TopCoursesCard } from './modules/dashboardModules/Topcoursescard';
import { ExpandableModule } from './modules/dashboardModules/ExpandableModule';
import { OfertasCard } from './modules/dashboardModules/Ofertascard';
import { AlertasEmpresa } from './modules/dashboardModules/Alertaempresa';

export const Dashboard: React.FC = () => {
  const { colores } = brandingConfig;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colores.fondoPrincipal,
        padding: '32px',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Grid Principal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Columna 1: MonitorIA arriba, Ofertas abajo */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* MonitorIA expandible hacia la derecha */}
            <ExpandableModule expandDirection="right">
              <MonitorIAModule />
            </ExpandableModule>
            
            {/* Ofertas Especiales */}
            <OfertasCard />
          </div>

          {/* Columna 2: Hero arriba, Calendar abajo */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <HeroCard />
            <MiniCalendarCard />
          </div>

          {/* Columna 3: MedicalIA arriba, Cursos abajo */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* MedicalIA expandible hacia la izquierda */}
            <ExpandableModule expandDirection="left">
              <LumelModule enableVideo={true} />
            </ExpandableModule>
            <TopCoursesCard />
          </div>
        </div>

        {/* Fila Inferior: Alertas (izquierda) + Gráfica (derecha) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
          }}
        >
          {/* Alertas Empresariales - IZQUIERDA */}
          <div style={{ gridColumn: 'span 4' }}>
            <AlertasEmpresa />
          </div>

          {/* Gráfica de Productividad - DERECHA */}
          <div style={{ gridColumn: 'span 8' }}>
            <ProductivityChart />
          </div>
        </div>

        {/* Global Styles */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            /* Scrollbar styling */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: ${colores.fondoSecundario}40;
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb {
              background: ${colores.primario}60;
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: ${colores.primario}80;
            }
          `}
        </style>
      </div>
    </div>
  );
};
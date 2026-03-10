import React from 'react';
import { brandingConfig } from '../config/branding';
import { WelcomeHeader } from './modules/dashboardModules/WelcomeHeader';
import { HeroCard } from './modules/dashboardModules/Herocard';
import { MiniCalendarCard } from './modules/dashboardModules/Minicalendarcard';
import { SucursalInteligenteModule } from './modules/dashboardModules/SucursalInteligenteModule';
import { ProductivityChart } from './modules/dashboardModules/Productivitychart';
import { TopCoursesCard } from './modules/dashboardModules/Topcoursescard';
import { ExpandableModule } from './modules/dashboardModules/ExpandableModule';
import { OfertasCard } from './modules/dashboardModules/Ofertascard';
import { AlertasEmpresa } from './modules/dashboardModules/Alertaempresa';
import { SelectorMotocicletas } from './modules/dashboardModules/SelectorMotocicletas';
import { CampañasInteligentes } from './modules/dashboardModules/CampaniasInteligentes';
import { AnalisisDemanda } from './modules/dashboardModules/AnalisisDemanda';
import { MonitoreoRedesSociales } from './modules/dashboardModules/MonitorRedesSociales';

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

        {/* --- FILA 1: Operaciones y Asistente (SE MANTIENEN IGUAL) --- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Columna 1: Sucursal Inteligente */}
          <div style={{ gridColumn: 'span 4' }}>
            <ExpandableModule expandDirection="right">
              <SucursalInteligenteModule />
            </ExpandableModule>
          </div>

          {/* Columna 2: Hero + Calendario (Por ahora solo Hero) */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <HeroCard />
            {/* El calendario NO va aquí, se moverá al final */}
          </div>

          {/* Columna 3: Selector de Motos */}
          <div style={{ gridColumn: 'span 4' }}>
            <ExpandableModule expandDirection="left">
              <SelectorMotocicletas />
            </ExpandableModule>
          </div>
        </div>

        {/* --- FILA 2: Análisis Predictivo + Gráfica de Impacto IA --- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Columna Izquierda: Análisis Predictivo */}
          <div style={{ gridColumn: 'span 4' }}>
            <AnalisisDemanda />
          </div>

          {/* Columna Derecha: Impacto de IA en Productividad (OCUPA 8 COLUMNAS) */}
          <div style={{ gridColumn: 'span 8' }}>
            <ProductivityChart />
          </div>
        </div>

        {/* --- FILA 3: Redes Sociales, Campañas y Alertas --- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Columna Izquierda: Monitoreo Redes Sociales */}
          <div style={{ gridColumn: 'span 4' }}>
            <MonitoreoRedesSociales />
          </div>

          {/* Columna Centro: Campañas Inteligentes */}
          <div style={{ gridColumn: 'span 4' }}>
            <CampañasInteligentes />
          </div>

          {/* Columna Derecha: Alertas de la Empresa */}
          <div style={{ gridColumn: 'span 4' }}>
            <AlertasEmpresa />
          </div>
        </div>

        {/* --- FILA 4: Ofertas Especiales y Calendario (el "remate" visual) --- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
          }}
        >
          {/* Columna Izquierda: Ofertas Especiales */}
          <div style={{ gridColumn: 'span 4' }}>
            <OfertasCard />
          </div>

          {/* Columna Centro: Mini Calendario (recuperado de la Fila 1) */}
          <div style={{ gridColumn: 'span 4' }}>
            <MiniCalendarCard />
          </div>

          {/* Columna Derecha: Top Cursos (como cierre positivo) */}
          <div style={{ gridColumn: 'span 4' }}>
            <TopCoursesCard />
          </div>
        </div>

        {/* ... tus estilos globales se mantienen igual ... */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
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
        `}</style>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RecursosHumanos } from './components/departamentos/RecursosHumanos';
import { FinanzasContabilidad } from './components/departamentos/FinanzasContabilidad';
import { Operaciones } from './components/departamentos/Operaciones';
import { VentasMarketing } from './components/departamentos/VentasMarketing';
import { TecnologiasInformacion } from './components/departamentos/TecnologiasInformacion';
import { Administracion } from './components/departamentos/Administracion';
import { Ciberseguridad } from './components/departamentos/Ciberseguridad';
import { Playground } from './components/departamentos/Playground';
import { Academia } from './components/departamentos/Academia';
import { Analiticos } from './components/departamentos/Analiticos';
import { brandingConfig } from './config/branding';
import './responsive.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { colores } = brandingConfig;

  const getTitulo = () => {
    const titulos: Record<string, string> = {
      dashboard:      'Dashboard General',
      rh:             'Recursos Humanos',
      finanzas:       'Finanzas y Contabilidad',
      operaciones:    'Operaciones',
      ventas:         'Ventas y Marketing',
      ti:             'Tecnologías de la Información',
      administracion: 'Administración',
      ciberseguridad: 'CiberSeguridad',
      playground:     'Playground',
      academia:       'Academia',
      analiticos:     'Analíticos',
    };
    return titulos[activeSection] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':      return <Dashboard onSectionChange={setActiveSection} />;
      case 'rh':             return <RecursosHumanos />;
      case 'finanzas':       return <FinanzasContabilidad />;
      case 'operaciones':    return <Operaciones />;
      case 'ventas':         return <VentasMarketing />;
      case 'ti':             return <TecnologiasInformacion />;
      case 'administracion': return <Administracion />;
      case 'ciberseguridad': return <Ciberseguridad />;
      case 'playground':     return <Playground />;
      case 'academia':       return <Academia />;
      case 'analiticos':     return <Analiticos />;
      default:               return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <ResponsiveLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      header={<Header title={getTitulo()} />}
      sidebar={
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      }
    >
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: colores.fondoPrincipal }}>
        {renderContent()}
      </div>
    </ResponsiveLayout>
  );
}

export default App;
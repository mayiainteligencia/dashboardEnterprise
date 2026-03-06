import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

const statusColor = {
  rojo: '#ef4444',
  amarillo: '#facc15',
  verde: '#22c55e',
};

type EstadoCapacitacion = 'rojo' | 'amarillo' | 'verde';

interface Empleado {
  nombre: string;
  estado: EstadoCapacitacion;
  porcentaje: number;
  cursosCompletados: string[];
  cursosPendientes: string[];
}

const cursosDisponibles = [
  'Fundamentos del Prompting',
  'IA para Trabajo Inteligente',
  'Comunicación Efectiva en Equipo',
  'Priorización y Delegación',
  'IA para Gerentes',
  'Gestión del Cambio',
  'Toma de Decisiones Estratégicas',
  'Optimización de Procesos',
  'Desarrollo de Talento Humano',
];

export const CapacitacionStatus = () => {
  const empleados: Empleado[] = [
    { 
      nombre: 'Luis Martínez', 
      estado: 'rojo', 
      porcentaje: 0,
      cursosCompletados: [],
      cursosPendientes: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo']
    },
    { 
      nombre: 'María González', 
      estado: 'amarillo', 
      porcentaje: 50,
      cursosCompletados: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo'],
      cursosPendientes: ['IA para Trabajo Inteligente', 'Priorización y Delegación']
    },
    { 
      nombre: 'Sofía Ramírez', 
      estado: 'verde', 
      porcentaje: 100,
      cursosCompletados: ['Fundamentos del Prompting', 'IA para Trabajo Inteligente', 'Comunicación Efectiva en Equipo', 'IA para Gerentes'],
      cursosPendientes: []
    },
    { 
      nombre: 'Carlos Hernández', 
      estado: 'rojo', 
      porcentaje: 15,
      cursosCompletados: [],
      cursosPendientes: ['Fundamentos del Prompting', 'Optimización de Procesos']
    },
    { 
      nombre: 'Ana Torres', 
      estado: 'amarillo', 
      porcentaje: 60,
      cursosCompletados: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo', 'Priorización y Delegación'],
      cursosPendientes: ['Gestión del Cambio', 'Toma de Decisiones Estratégicas']
    },
    { 
      nombre: 'Roberto Sánchez', 
      estado: 'verde', 
      porcentaje: 100,
      cursosCompletados: ['Fundamentos del Prompting', 'IA para Trabajo Inteligente', 'IA para Gerentes', 'Desarrollo de Talento Humano'],
      cursosPendientes: []
    },
    { 
      nombre: 'Patricia López', 
      estado: 'amarillo', 
      porcentaje: 45,
      cursosCompletados: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo'],
      cursosPendientes: ['IA para Trabajo Inteligente', 'Optimización de Procesos']
    },
    { 
      nombre: 'Diego Morales', 
      estado: 'rojo', 
      porcentaje: 10,
      cursosCompletados: [],
      cursosPendientes: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo', 'Priorización y Delegación']
    },
    { 
      nombre: 'Valeria Castro', 
      estado: 'verde', 
      porcentaje: 100,
      cursosCompletados: ['Fundamentos del Prompting', 'IA para Trabajo Inteligente', 'Comunicación Efectiva en Equipo', 'IA para Gerentes', 'Gestión del Cambio'],
      cursosPendientes: []
    },
    { 
      nombre: 'Fernando Ruiz', 
      estado: 'amarillo', 
      porcentaje: 55,
      cursosCompletados: ['Fundamentos del Prompting', 'Comunicación Efectiva en Equipo', 'Priorización y Delegación'],
      cursosPendientes: ['IA para Gerentes', 'Optimización de Procesos']
    },
  ];

  const getEstadoStyles = (estado: EstadoCapacitacion) => {
    switch (estado) {
      case 'rojo':
        return {
          animation: 'pulseRed 1.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
        };
      case 'amarillo':
        return {
          animation: 'orbitYellow 3s linear infinite',
          position: 'relative' as const,
        };
      case 'verde':
        return {
          animation: 'glowGreen 2s ease-in-out infinite',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)',
        };
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulseRed {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
          }
          50% {
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.4);
            border-color: #dc2626;
          }
        }

        @keyframes orbitYellow {
          0% {
            box-shadow: 
              20px 0 30px rgba(250, 204, 21, 0.6),
              0 0 20px rgba(250, 204, 21, 0.4);
          }
          25% {
            box-shadow: 
              0 20px 30px rgba(250, 204, 21, 0.6),
              0 0 20px rgba(250, 204, 21, 0.4);
          }
          50% {
            box-shadow: 
              -20px 0 30px rgba(250, 204, 21, 0.6),
              0 0 20px rgba(250, 204, 21, 0.4);
          }
          75% {
            box-shadow: 
              0 -20px 30px rgba(250, 204, 21, 0.6),
              0 0 20px rgba(250, 204, 21, 0.4);
          }
          100% {
            box-shadow: 
              20px 0 30px rgba(250, 204, 21, 0.6),
              0 0 20px rgba(250, 204, 21, 0.4);
          }
        }

        @keyframes glowGreen {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(34, 197, 94, 0.6),
              0 0 60px rgba(34, 197, 94, 0.3),
              inset 0 0 20px rgba(34, 197, 94, 0.1);
            border-color: #22c55e;
            transform: scale(1);
          }
          50% {
            box-shadow: 
              0 0 50px rgba(34, 197, 94, 0.8),
              0 0 100px rgba(34, 197, 94, 0.5),
              inset 0 0 30px rgba(34, 197, 94, 0.2);
            border-color: #16a34a;
            transform: scale(1.02);
          }
        }

        .progress-bar {
          transition: width 0.3s ease;
        }
      `}</style>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '14px',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        paddingRight: '8px',
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: colores.fondoTerciario,
          borderRadius: '12px',
          marginBottom: '8px',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: colores.textoClaro,
            marginBottom: '8px',
          }}>
            Estado de Capacitación
          </h3>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: statusColor.rojo,
              }} />
              <span style={{ color: colores.textoMedio }}>Sin iniciar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: statusColor.amarillo,
              }} />
              <span style={{ color: colores.textoMedio }}>En progreso</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: statusColor.verde,
              }} />
              <span style={{ color: colores.textoMedio }}>Completado</span>
            </div>
          </div>
        </div>

        {empleados.map((empleado, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: `2px solid ${statusColor[empleado.estado]}`,
              backgroundColor: colores.fondoTerciario,
              transition: 'all 0.3s ease',
              ...getEstadoStyles(empleado.estado),
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: statusColor[empleado.estado],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                  {empleado.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: colores.textoClaro,
                    fontSize: '15px',
                  }}>
                    {empleado.nombre}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: colores.textoMedio,
                    marginTop: '2px',
                  }}>
                    {empleado.cursosCompletados.length} de {empleado.cursosCompletados.length + empleado.cursosPendientes.length} cursos
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: statusColor[empleado.estado],
              }}>
                {empleado.porcentaje}%
              </div>
            </div>

            {/* Barra de progreso */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: colores.fondoSecundario,
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <div
                className="progress-bar"
                style={{
                  width: `${empleado.porcentaje}%`,
                  height: '100%',
                  backgroundColor: statusColor[empleado.estado],
                  borderRadius: '4px',
                }}
              />
            </div>

            {/* Cursos completados */}
            {empleado.cursosCompletados.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: colores.textoClaro,
                  marginBottom: '6px',
                }}>
                  ✓ Completados:
                </div>
                <div style={{ fontSize: '11px', color: colores.textoMedio, lineHeight: '1.6' }}>
                  {empleado.cursosCompletados.join(', ')}
                </div>
              </div>
            )}

            {/* Cursos pendientes */}
            {empleado.cursosPendientes.length > 0 && (
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: colores.textoClaro,
                  marginBottom: '6px',
                }}>
                  ⏳ Pendientes:
                </div>
                <div style={{ fontSize: '11px', color: colores.textoMedio, lineHeight: '1.6' }}>
                  {empleado.cursosPendientes.join(', ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
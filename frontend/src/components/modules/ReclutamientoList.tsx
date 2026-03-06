
export const ReclutamientoList = () => {
  const candidatos = [
    { nombre: 'Ana López', puesto: 'Frontend Dev', fecha: '2025-01-12' },
    { nombre: 'Carlos Ruiz', puesto: 'QA Engineer', fecha: '2025-01-10' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {candidatos.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#1f2937',
            borderRadius: '10px',
          }}
        >
          <div>
            <strong>{c.nombre}</strong>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              {c.puesto}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            {c.fecha}
          </span>
        </div>
      ))}
    </div>
  );
};

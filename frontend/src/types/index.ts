export interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  departamento: string;
  salario: number;
  fechaIngreso: string;
  email: string;
  telefono: string;
  status: 'activo' | 'vacaciones' | 'baja';
}

export interface Presupuesto {
  id: number;
  departamento: string;
  monto: number;
  gastado: number;
  periodo: string;
  categoria: string;
}

export interface Proyecto {
  id: number;
  nombre: string;
  departamento: string;
  status: 'en-progreso' | 'completado' | 'pausado';
  progreso: number;
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
}
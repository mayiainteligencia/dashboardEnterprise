import type { LucideProps } from 'lucide-react';

export interface Alerta {
  id: number;
  tipo: 'rendimiento' | 'epp' | 'accidente' | 'incendio';
  titulo: string;
  mensaje: string;
  timestamp: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface Servicio {
  id: number;
  titulo: string;
  logo: string;
  descripcion: string;
}

export interface AppointmentData {
  date: string;
  time: string;
}

export interface AlertaConfig {
  color: string;
  icon: React.ComponentType<LucideProps>;
  bgColor: string;
  label: string;
}
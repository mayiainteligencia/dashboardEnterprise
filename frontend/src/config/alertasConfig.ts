import { Flame, ShieldAlert, AlertTriangle, TrendingDown } from 'lucide-react';
import type { Alerta, AlertaConfig } from '../types/dashboard';

export const getAlertaConfig = (tipo: Alerta['tipo']): AlertaConfig => {
  switch (tipo) {
    case 'incendio':
      return {
        color: '#ef4444',
        icon: Flame,
        bgColor: 'rgba(239, 68, 68, 0.1)',
        label: 'INCENDIO',
      };
    case 'epp':
      return {
        color: '#f59e0b',
        icon: ShieldAlert,
        bgColor: 'rgba(245, 158, 11, 0.1)',
        label: 'EPP',
      };
    case 'accidente':
      return {
        color: '#f59e0b',
        icon: AlertTriangle,
        bgColor: 'rgba(245, 158, 11, 0.1)',
        label: 'ACCIDENTE',
      };
    case 'rendimiento':
      return {
        color: '#3b82f6',
        icon: TrendingDown,
        bgColor: 'rgba(59, 130, 246, 0.1)',
        label: 'RENDIMIENTO',
      };
  }
};

export const alertasData: Alerta[] = [
  {
    id: 1,
    tipo: 'incendio',
    titulo: 'Detector de Humo Activado',
    mensaje: 'Sector B-3, Almacén Principal. Se ha activado el protocolo de evacuación.',
    timestamp: 'Hace 5 min',
    prioridad: 'alta',
  },
  {
    id: 2,
    tipo: 'epp',
    titulo: 'Falta de EPP Detectada',
    mensaje: '3 operarios sin casco en Zona de Producción A. Supervisor notificado.',
    timestamp: 'Hace 12 min',
    prioridad: 'alta',
  },
  {
    id: 3,
    tipo: 'accidente',
    mensaje: 'Lesión menor reportada en Línea 4. Personal médico en camino.',
    titulo: 'Incidente Reportado',
    timestamp: 'Hace 18 min',
    prioridad: 'media',
  },
  {
    id: 4,
    tipo: 'rendimiento',
    titulo: 'Baja en Productividad',
    mensaje: 'Línea 2 operando al 65% de capacidad. Requiere revisión técnica.',
    timestamp: 'Hace 25 min',
    prioridad: 'media',
  },
];
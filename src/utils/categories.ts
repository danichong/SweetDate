import { CategoryInfo, DateCategory } from '../types/date';

export const CATEGORIES: Record<DateCategory, CategoryInfo> = {
  comida: {
    id: 'comida',
    name: 'Restaurantes & Comida',
    icon: '🍽️',
    color: '#0284c7', // sky-600
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
  },
  viajes: {
    id: 'viajes',
    name: 'Viajes & Escapadas',
    icon: '✈️',
    color: '#7c3aed', // violet-600
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
  },
  casa: {
    id: 'casa',
    name: 'En Casa & Chill',
    icon: '🏠',
    color: '#0ea5e9', // sky-500
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeText: 'text-sky-800',
  },
  cultura: {
    id: 'cultura',
    name: 'Eventos & Cultura',
    icon: '🎟️',
    color: '#9333ea', // purple-600
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-800',
  },
  aire_libre: {
    id: 'aire_libre',
    name: 'Aire Libre & Naturaleza',
    icon: '🌿',
    color: '#0369a1', // sky-700
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    badgeText: 'text-cyan-800',
  },
  cine: {
    id: 'cine',
    name: 'Cine & Entretenimiento',
    icon: '🍿',
    color: '#6366f1', // indigo-500
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
  },
  relax: {
    id: 'relax',
    name: 'Relax & Spa',
    icon: '💆',
    color: '#8b5cf6', // purple-500
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
  },
  aventura: {
    id: 'aventura',
    name: 'Aventura & Sorpresa',
    icon: '⚡',
    color: '#3b82f6', // blue-500
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

import { CoupleProfile, DateItem, TimeCapsule, DateChallenge } from '../types/date';
import { INITIAL_CHALLENGES } from './challengesData';

const STORAGE_KEY_DATES = 'sweet_date_items_v1';
const STORAGE_KEY_PROFILE = 'sweet_date_profile_v1';
const STORAGE_KEY_CAPSULES = 'sweet_date_capsules_v1';
const STORAGE_KEY_CHALLENGES = 'sweet_date_challenges_v1';

export const INITIAL_PROFILE: CoupleProfile = {
  partner1: 'Tú',
  partner2: 'Mi Amor',
  startDate: '2024-02-14',
  currency: 'S/',
};

export const INITIAL_DATES: DateItem[] = [
  {
    id: 'sd-1',
    title: 'Noche de Sushi & Juegos de Mesa',
    category: 'comida',
    dateTime: '2026-10-02T20:00',
    budget: 130,
    location: 'Rolls & Nigiri Bar + Casa',
    dressCode: 'Casual relajado',
    externalLink: 'https://maps.google.com',
    notes: 'Pedir el barco de sushi con 40 piezas, preparar té verde helado y jugar Catán y cartas.',
    status: 'pending',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'sd-2',
    title: 'Pícnic al Atardecer frente al Mar',
    category: 'aire_libre',
    dateTime: '2026-10-10T16:30',
    budget: 65,
    location: 'Parque del Malecón',
    dressCode: 'Ropa fresca con suéter abrigador',
    notes: 'Llevar manta suave, canasta con queso gouda, uvas, fresas, sándwiches gourmet y parlante bluetooth.',
    status: 'pending',
    createdAt: '2026-09-18T15:30:00.000Z',
    updatedAt: '2026-09-18T15:30:00.000Z',
  },
  {
    id: 'sd-3',
    title: 'Taller Creativo de Cerámica en Pareja',
    category: 'cultura',
    dateTime: '2026-10-17T11:00',
    budget: 160,
    location: 'Studio Barro & Café',
    dressCode: 'Ropa cómoda que se pueda ensuciar',
    notes: 'Aprender a modelar tazas con torno de alfarero. Haremos la taza para el café del otro.',
    status: 'pending',
    createdAt: '2026-09-15T09:20:00.000Z',
    updatedAt: '2026-09-15T09:20:00.000Z',
  },
  {
    id: 'sd-4',
    title: 'Noche de Cine en el Jardín con Proyector',
    category: 'casa',
    dateTime: '2026-09-12T20:30',
    budget: 45,
    location: 'Nuestra terraza',
    dressCode: 'Pijama suave y medias calentitas',
    notes: 'Montar sábana blanca, colchones inflables, palomitas de mantequilla y maratón de películas del Studio Ghibli.',
    status: 'completed',
    memory: {
      photoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      note: '¡Fue una de las noches más mágicas! Nos quedamos bajo las estrellas hasta las 2 AM hablando de nuestro futuro.',
      rating: 5,
      completedAt: '2026-09-12T23:30:00.000Z',
    },
    createdAt: '2026-09-01T12:00:00.000Z',
    updatedAt: '2026-09-12T23:30:00.000Z',
  },
  {
    id: 'sd-5',
    title: 'Cena a la Luz de las Velas & Pasta Hecha a Mano',
    category: 'comida',
    dateTime: '2026-08-28T21:00',
    budget: 85,
    location: 'Nuestra cocina',
    dressCode: 'Elegante casual',
    notes: 'Amasamos fettuccine desde cero con salsa trufada y abrimos una botella de vino tinto.',
    status: 'completed',
    memory: {
      photoUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      note: 'Terminamos llenos de harina pero la pasta quedó increíble. Brindamos por nosotros.',
      rating: 5,
      completedAt: '2026-08-28T23:00:00.000Z',
    },
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-28T23:00:00.000Z',
  },
  {
    id: 'sd-6',
    title: 'Escapada de Fin de Semana a Cabaña en la Montaña',
    category: 'viajes',
    dateTime: '2026-11-06T09:00',
    budget: 450,
    location: 'Cabaña Bosque Nuboso',
    dressCode: 'Abrigo de montaña, botas y bufandas',
    notes: 'Cabaña con chimenea a leña, fogata de malvaviscos y caminata matutina por el mirador.',
    status: 'pending',
    createdAt: '2026-09-22T14:15:00.000Z',
    updatedAt: '2026-09-22T14:15:00.000Z',
  },
  {
    id: 'sd-7',
    title: 'Tarde de Masajes y Spa Relajante',
    category: 'relax',
    dateTime: '2026-10-25T15:00',
    budget: 200,
    location: 'Serenity Spa & Aromaterapia',
    dressCode: 'Ropa cómoda y ligera',
    notes: 'Circuito hidrotermal, sauna de eucalipto y masaje descontracturante en cabina doble.',
    status: 'pending',
    createdAt: '2026-09-23T11:00:00.000Z',
    updatedAt: '2026-09-23T11:00:00.000Z',
  },
];

export function loadStoredDates(): DateItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(INITIAL_DATES));
      return INITIAL_DATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DATES;
  } catch (error) {
    console.error('Error loading dates from storage:', error);
    return INITIAL_DATES;
  }
}

export function saveStoredDates(dates: DateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(dates));
  } catch (error) {
    console.error('Error saving dates to storage:', error);
  }
}

export function loadStoredProfile(): CoupleProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? { ...INITIAL_PROFILE, ...parsed } : INITIAL_PROFILE;
  } catch (error) {
    console.error('Error loading profile from storage:', error);
    return INITIAL_PROFILE;
  }
}

export function saveStoredProfile(profile: CoupleProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
}

export function resetToSampleData(): { dates: DateItem[]; profile: CoupleProfile } {
  localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(INITIAL_DATES));
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_PROFILE));
  localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
  localStorage.removeItem(STORAGE_KEY_CAPSULES);
  return { dates: INITIAL_DATES, profile: INITIAL_PROFILE };
}

export function loadStoredCapsules(): TimeCapsule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAPSULES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading capsules:', e);
    return [];
  }
}

export function saveStoredCapsules(capsules: TimeCapsule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CAPSULES, JSON.stringify(capsules));
  } catch (e) {
    console.error('Error saving capsules:', e);
  }
}

export function loadStoredChallenges(): DateChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHALLENGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
      return INITIAL_CHALLENGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CHALLENGES;
  } catch (e) {
    console.error('Error loading challenges:', e);
    return INITIAL_CHALLENGES;
  }
}

export function saveStoredChallenges(challenges: DateChallenge[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error('Error saving challenges:', e);
  }
}

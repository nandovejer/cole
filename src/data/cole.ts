import type { Lang } from '../i18n/paths';

type T = Record<Lang, string>;

export interface Curso { slug: string; nombre: T; emoji: string; color: string }
export interface Asignatura { slug: string; nombre: T; emoji: string; color: string }
export interface Leccion {
  curso: string;
  asignatura: string;
  slug: string;
  nombre: T;
  descripcion: T;
  emoji: string;
  color: string;
  juegos: number;
}

export const cursos: Curso[] = [
  { slug: '1-primaria', nombre: { es: '1º de Primaria', en: 'Year 1 Primary' }, emoji: '🎒', color: '#ff5d73' },
];

export const asignaturas: Asignatura[] = [
  { slug: 'lengua', nombre: { es: 'Lengua', en: 'Spanish' }, emoji: '📖', color: '#ff5d73' },
  { slug: 'matematicas', nombre: { es: 'Matemáticas', en: 'Maths' }, emoji: '🔢', color: '#3a86ff' },
  { slug: 'ciencias-sociales', nombre: { es: 'Ciencias Sociales', en: 'Social Science' }, emoji: '🌍', color: '#ff9f1c' },
  { slug: 'ingles', nombre: { es: 'Inglés', en: 'English' }, emoji: '💂', color: '#9b5de5' },
  { slug: 'ciencias-naturales', nombre: { es: 'Ciencias Naturales', en: 'Natural Science' }, emoji: '🌱', color: '#06d6a0' },
];

// Lessons appear in the order of this list.
export const lecciones: Leccion[] = [
  {
    curso: '1-primaria',
    asignatura: 'lengua',
    slug: 'el-la-los-las',
    nombre: { es: 'El, la, los, las', en: 'El, la, los, las' },
    descripcion: { es: 'Juega con Lola a las palabritas', en: 'Play with Lola: Spanish little words' },
    emoji: '🐛',
    color: '#3a86ff',
    juegos: 10,
  },
];

export const leccionesDe = (curso: string, asignatura: string) =>
  lecciones.filter((l) => l.curso === curso && l.asignatura === asignatura);

export interface Curso {
  slug: string;
  nombre: string;
  emoji: string;
  color: string;
}

export interface Asignatura {
  slug: string;
  nombre: string;
  emoji: string;
  color: string;
}

export interface Actividad {
  curso: string;
  asignatura: string;
  titulo: string;
  descripcion: string;
  emoji: string;
  /** Ruta dentro de /public */
  url: string;
}

export const cursos: Curso[] = [
  { slug: '1-primaria', nombre: '1º de Primaria', emoji: '🎒', color: '#ff5d73' },
];

export const asignaturas: Asignatura[] = [
  { slug: 'lengua', nombre: 'Lengua', emoji: '📖', color: '#ff5d73' },
  { slug: 'matematicas', nombre: 'Matemáticas', emoji: '🔢', color: '#3a86ff' },
  { slug: 'ciencias-sociales', nombre: 'Ciencias Sociales', emoji: '🌍', color: '#ff9f1c' },
  { slug: 'ingles', nombre: 'Inglés', emoji: '💂', color: '#9b5de5' },
  { slug: 'ciencias-naturales', nombre: 'Ciencias Naturales', emoji: '🌱', color: '#06d6a0' },
];

export const actividades: Actividad[] = [
  {
    curso: '1-primaria',
    asignatura: 'lengua',
    titulo: 'El, la, los, las',
    descripcion: 'Juega con Lola a los artículos',
    emoji: '🐛',
    url: '/1-primaria/lengua/el-la-los-las-lola.html',
  },
];

export const actividadesDe = (curso: string, asignatura: string) =>
  actividades.filter((a) => a.curso === curso && a.asignatura === asignatura);

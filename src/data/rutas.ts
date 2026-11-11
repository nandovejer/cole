// Static routes, shared by the Spanish pages (/) and the English ones (/en/).
import { cursos, asignaturas, lecciones } from './cole';

export const rutasCurso = () => cursos.map((curso) => ({ params: { curso: curso.slug }, props: { curso } }));

export const rutasAsignatura = () =>
  cursos.flatMap((curso) =>
    asignaturas.map((asignatura) => ({ params: { curso: curso.slug, asignatura: asignatura.slug }, props: { curso, asignatura } })),
  );

export const rutasLeccion = () =>
  lecciones.map((leccion) => ({
    params: { curso: leccion.curso, asignatura: leccion.asignatura, leccion: leccion.slug },
    props: {
      leccion,
      curso: cursos.find((c) => c.slug === leccion.curso)!,
      asignatura: asignaturas.find((a) => a.slug === leccion.asignatura)!,
    },
  }));

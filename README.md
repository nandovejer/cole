# Cole

Juegos educativos para niños de 6–7 años (1º de Primaria), con Lola la lombriz.
Español por defecto (`/`) e inglés (`/en/`). Hecho con [Astro](https://astro.build), pensado para el móvil.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Estructura

- `src/data/cole.ts`: cursos, asignaturas y lecciones (en el orden en que salen).
- `src/lessons/<leccion>/`: cada lección, con sus juegos. Se registra en `src/views/Lesson.astro`.
- `src/i18n/ui.js`: los textos de la web en los dos idiomas.
- `public/audio/<idioma>/*.mp3`: la voz de Lola, ya generada.

Cada juego tiene su propia URL (`/1-primaria/lengua/el-la-los-las/#globos`), así que el botón de atrás del navegador funciona.

## Voz (MP3 con Piper)

La voz se genera antes con [Piper](https://github.com/OHF-Voice/piper1-gpl), que es de código abierto y funciona sin conexión. Las voces son de España (`es_ES-sharvard`, femenina) y de Inglaterra (`en_GB-cori`). Si falta algún MP3, la web usa la voz del navegador.

```sh
# una sola vez
python3 -m venv .venv && .venv/bin/pip install piper-tts
# genera solo los MP3 que faltan (hace falta ffmpeg)
npm run audio
npm run audio -- --clean   # además borra los que ya no se usan
```

Lo que Lola dice está en `src/lessons/*/data.js` y en `src/i18n/ui.js`. Si cambias una frase, vuelve a ejecutar `npm run audio`.

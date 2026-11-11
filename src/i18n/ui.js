// Interface text. Spanish is the default language.
export const LANGS = ['es', 'en'];
export const DEFAULT_LANG = 'es';

export const ui = {
  es: {
    otherLang: 'en',
    otherShort: 'EN',
    otherName: 'English',
    otherFlag: '🇬🇧',
    back: 'Volver',
    stars: 'Estrellas',
    sound: 'Sonido',
    hear: 'Escuchar',
    soon: 'Muy pronto',
    soonText: 'Aquí pronto habrá juegos. ¡Vuelve otro día!',
    lessons: (n) => (n === 0 ? 'Muy pronto' : n === 1 ? '1 lección' : `${n} lecciones`),
    games: (n) => (n === 1 ? '1 juego' : `${n} juegos`),
    // Lola's lines (they are turned into mp3)
    lola: {
      home: '¡Hola! Soy Lola. ¿A qué curso vas?',
      course: '¿Qué quieres aprender hoy?',
      subject: '¡Elige una lección y a jugar!',
      soon: '¡Estoy preparando juegos nuevos!',
      giggle: '¡Ji, ji! ¡Me haces cosquillas!',
    },
  },
  en: {
    otherLang: 'es',
    otherShort: 'ES',
    otherName: 'Español',
    otherFlag: '🇪🇸',
    back: 'Back',
    stars: 'Stars',
    sound: 'Sound',
    hear: 'Listen',
    soon: 'Coming soon',
    soonText: 'Games are coming here soon. Come back another day!',
    lessons: (n) => (n === 0 ? 'Coming soon' : n === 1 ? '1 lesson' : `${n} lessons`),
    games: (n) => (n === 1 ? '1 game' : `${n} games`),
    lola: {
      home: "Hi! I'm Lola. Which year are you in?",
      course: 'What do you want to learn today?',
      subject: "Pick a lesson and let's play!",
      soon: "I'm getting new games ready!",
      giggle: 'Hee hee! That tickles!',
    },
  },
};

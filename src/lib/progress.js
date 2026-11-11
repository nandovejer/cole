// Progress, stats and achievements. Everything is saved in this browser's localStorage.
const KEY = 'coleProgress';

const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD in local time

function blank() {
  return {
    v: 1,
    name: '',
    avatar: '🐛',
    stars: 0,
    correct: 0,
    wrong: 0,
    wins: 0,
    perfect: 0,
    days: [],
    games: {}, // "lesson/game": { played, wins, perfect, correct, wrong, last }
    achievements: {}, // id: date
  };
}

export function load() {
  let p = null;
  try { p = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
  if (!p || typeof p !== 'object') {
    p = blank();
    // brings over the stars from earlier versions
    try { p.stars = parseInt(localStorage.getItem('coleStars') || localStorage.getItem('lolaStars2') || '0', 10) || 0; } catch {}
  }
  return { ...blank(), ...p };
}

function save(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  document.querySelectorAll('[data-stars]').forEach((el) => (el.textContent = p.stars));
  document.querySelectorAll('[data-avatar]').forEach((el) => (el.textContent = p.avatar));
}

export function reset() {
  try { localStorage.removeItem(KEY); localStorage.removeItem('coleStars'); localStorage.removeItem('lolaStars2'); } catch {}
  save(blank());
}

/** @param {{ name?: string, avatar?: string }} changes */
export function setProfile({ name, avatar }) {
  const p = load();
  if (name !== undefined) p.name = String(name).slice(0, 24);
  if (avatar !== undefined) p.avatar = avatar;
  save(p);
}

/* ================= achievements ================= */
// test(p) → true when it is earned. Names in both languages.
export const ACHIEVEMENTS = [
  { id: 'first-star', em: '⭐', es: ['Primera estrella', 'Gana tu primera estrella'], en: ['First star', 'Win your first star'], test: (p) => p.stars >= 1 },
  { id: 'stars-10', em: '🌟', es: ['Diez estrellas', 'Consigue 10 estrellas'], en: ['Ten stars', 'Get 10 stars'], test: (p) => p.stars >= 10 },
  { id: 'stars-50', em: '🌠', es: ['Lluvia de estrellas', 'Consigue 50 estrellas'], en: ['Shooting stars', 'Get 50 stars'], test: (p) => p.stars >= 50 },
  { id: 'perfect', em: '💯', es: ['¡Sin fallos!', 'Gana un juego sin equivocarte'], en: ['No mistakes!', 'Win a game without a mistake'], test: (p) => p.perfect >= 1 },
  { id: 'perfect-5', em: '🎯', es: ['Puntería', 'Gana 5 juegos sin fallos'], en: ['Bullseye', 'Win 5 games without mistakes'], test: (p) => p.perfect >= 5 },
  { id: 'correct-50', em: '🧠', es: ['Cerebrito', 'Acierta 50 veces'], en: ['Clever clogs', 'Get 50 right answers'], test: (p) => p.correct >= 50 },
  { id: 'correct-200', em: '🦉', es: ['Sabio búho', 'Acierta 200 veces'], en: ['Wise owl', 'Get 200 right answers'], test: (p) => p.correct >= 200 },
  { id: 'explorer', em: '🧭', es: ['Exploradora', 'Prueba 5 juegos distintos'], en: ['Explorer', 'Try 5 different games'], test: (p) => Object.values(p.games).filter((g) => g.played).length >= 5 },
  { id: 'all-games', em: '🏆', es: ['¡Todos!', 'Gana los 10 juegos de el, la, los, las'], en: ['All of them!', 'Win all 10 games of el, la, los, las'], test: (p) => Object.entries(p.games).filter(([k, g]) => k.startsWith('el-la-los-las/') && g.wins).length >= 10 },
  { id: 'days-3', em: '📅', es: ['Tres días', 'Juega 3 días distintos'], en: ['Three days', 'Play on 3 different days'], test: (p) => p.days.length >= 3 },
  { id: 'streak-3', em: '🔥', es: ['Racha', 'Juega 3 días seguidos'], en: ['On a roll', 'Play 3 days in a row'], test: (p) => streak(p) >= 3 },
];

function checkAchievements(p) {
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (!p.achievements[a.id] && a.test(p)) {
      p.achievements[a.id] = today();
      fresh.push(a);
    }
  }
  return fresh;
}

/** Consecutive days played up to today (or yesterday). */
export function streak(p) {
  const set = new Set(p.days);
  const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(d.toLocaleDateString('sv'))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ================= recording what happens in a game ================= */
function touch(p, key) {
  if (!p.days.includes(today())) p.days.push(today());
  p.games[key] ||= { played: 0, wins: 0, perfect: 0, correct: 0, wrong: 0, last: '' };
  p.games[key].last = today();
  return p.games[key];
}

function finish(p) {
  const fresh = checkAchievements(p);
  save(p);
  fresh.forEach((a) => document.dispatchEvent(new CustomEvent('cole:achievement', { detail: a })));
  return fresh;
}

/** Someone opens a game: lesson = 'el-la-los-las', game = 'balloons'… */
export function played(lesson, game) {
  const p = load(); touch(p, `${lesson}/${game}`).played++; finish(p);
}

export function answer(lesson, game, ok) {
  const p = load(); const g = touch(p, `${lesson}/${game}`);
  if (ok) { g.correct++; p.correct++; } else { g.wrong++; p.wrong++; }
  finish(p);
}

/** Wins a round: +1 star. perfect = no mistakes. Returns the new achievements. */
export function win(lesson, game, perfect) {
  const p = load(); const g = touch(p, `${lesson}/${game}`);
  g.wins++; p.wins++; p.stars++;
  if (perfect) { g.perfect++; p.perfect++; }
  return finish(p);
}

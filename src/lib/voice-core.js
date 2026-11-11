// Shared by the browser and by the audio generator (scripts/audio.mjs).
// Each spoken phrase maps to one mp3: public/audio/<lang>/<key>.mp3

export const VOICE_LANGS = { es: 'es-ES', en: 'en-GB' };

/** What is actually spoken: no emoji or symbols, single spaces. */
export function spoken(text) {
  return String(text ?? '')
    .replace(/[^\p{L}\p{N}\s¡!¿?,.:;'’-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Stable key (FNV-1a 32 bit) for a phrase in a language. */
export function clipKey(lang, text) {
  const s = `${lang}|${spoken(text).toLowerCase()}`;
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export const clipPath = (lang, text) => `audio/${lang}/${clipKey(lang, text)}.mp3`;

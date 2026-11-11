// Lola's voice: plays the pre-generated mp3s (Piper) with Web Audio.
// Only if a clip is missing does it fall back to the browser's voice.
import { spoken, clipPath, VOICE_LANGS } from './voice-core.js';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';
const SOUND_KEY = 'coleSound';

let ctx = null;
export function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
}

/** Browsers only allow sound after a tap: unlock on every interaction. */
export function unlock() {
  const c = audioCtx();
  if (c && c.state !== 'running') c.resume().catch(() => {});
}
['pointerdown', 'touchend', 'keydown'].forEach((ev) => addEventListener(ev, unlock, { passive: true }));

export const voice = {
  get enabled() {
    try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; }
  },
  set enabled(on) {
    try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch {}
    if (!on) stop();
  },
};

const buffers = new Map();
function load(url) {
  if (!buffers.has(url)) {
    const c = audioCtx();
    buffers.set(
      url,
      fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .then((b) => new Promise((res, rej) => c.decodeAudioData(b, res, rej)))
        .catch(() => null),
    );
  }
  return buffers.get(url);
}
const urlOf = (lang, text) => BASE + clipPath(lang, text);

export function preload(lang, segs) {
  if (!audioCtx()) return;
  segments(segs, lang).forEach((s) => load(urlOf(s.lang, s.t)));
}

function setTalking(on) {
  document.getElementById('lola')?.classList.toggle('talking', on);
}

let token = 0;
let chain = Promise.resolve();
// Everything that is playing now. stop() silences ALL of it, so two phrases
// never overlap even if the child taps very fast.
const playing = new Set();

export function stop() {
  token++;
  for (const p of [...playing]) {
    try { p.src?.stop(); } catch {}
    try { if (p.tts) speechSynthesis.cancel(); } catch {}
    p.done();
  }
  playing.clear();
  // the browser voice too, even if it is no longer on our list
  try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel(); } catch {}
  chain = Promise.resolve();
  setTalking(false);
}

async function running() {
  const c = audioCtx();
  if (!c) return false;
  if (c.state === 'running') return true;
  await Promise.race([c.resume().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
  return c.state === 'running';
}

function playBuffer(buf, my) {
  return new Promise((done) => {
    if (my !== token) return done(); // something newer has started in the meantime
    const c = audioCtx();
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    const entry = { src, done: finish };
    const safety = setTimeout(finish, buf.duration * 1000 + 600);
    function finish() {
      clearTimeout(safety);
      // always silence it on the way out of the list, so nothing is left playing "loose"
      try { src.onended = null; src.stop(); } catch {}
      playing.delete(entry);
      done();
    }
    playing.add(entry);
    src.onended = finish;
    src.start();
  });
}

/** The best browser voice for es-ES / en-GB (the "natural" ones first). */
function bestVoice(lang) {
  const want = VOICE_LANGS[lang].toLowerCase();
  const all = speechSynthesis.getVoices();
  const score = (v) => {
    const l = v.lang.toLowerCase().replace('_', '-');
    let s = l === want ? 40 : l.startsWith(lang) ? 20 : -100;
    if (/natural|neural|online|enhanced|premium|siri/i.test(v.name)) s += 30;
    if (/google/i.test(v.name)) s += 20;
    if (/espeak|compact/i.test(v.name)) s -= 50;
    return s;
  };
  return all.filter((v) => score(v) > 0).sort((a, b) => score(b) - score(a))[0] || null;
}
if (typeof speechSynthesis !== 'undefined') speechSynthesis.getVoices(); // starts loading the voices

function browserVoice(lang, text, my, opts = {}) {
  return new Promise((done) => {
    if (my !== token || !('speechSynthesis' in window)) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE_LANGS[lang];
    const v = bestVoice(lang);
    if (v) u.voice = v;
    u.rate = opts.rate ?? 1;
    u.pitch = opts.pitch ?? 1;
    const entry = { tts: u, done: finish };
    const safety = setTimeout(finish, 1500 + text.length * 90);
    function finish() {
      clearTimeout(safety);
      playing.delete(entry);
      done();
    }
    playing.add(entry);
    u.onend = u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

/**
 * Says a phrase with the BROWSER's voice (for what cannot be generated beforehand,
 * like the child's name). Cuts off whatever is playing, just like say().
 */
export function sayLive(text, { lang = 'es', pitch = 1.25, rate = 1, fallback } = {}) {
  const t = String(text ?? '').trim();
  if (!voice.enabled || !t) return Promise.resolve();
  // If the browser cannot speak (no voices, it does not start or it fails), the mp3 `fallback` is played:
  // something is always heard.
  const useMp3 = () => (fallback ? say(fallback, { lang }) : Promise.resolve());
  if (!('speechSynthesis' in window) || !bestVoice(lang)) return useMp3();
  const busy = speechSynthesis.speaking || speechSynthesis.pending;
  stop();
  const my = token;
  setTalking(true);
  const run = new Promise((done) => {
    const speak = () => {
      if (my !== token) return done();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = VOICE_LANGS[lang];
      try { u.voice = bestVoice(lang); } catch {}
      u.pitch = pitch;
      u.rate = rate;
      let started = false;
      const entry = { tts: u, done: finish };
      const safety = setTimeout(finish, 2500 + t.length * 90);
      const noStart = setTimeout(() => !started && failed(), 1200);
      function finish() {
        clearTimeout(safety); clearTimeout(noStart);
        playing.delete(entry);
        done();
      }
      function failed() {
        clearTimeout(safety); clearTimeout(noStart);
        playing.delete(entry);
        try { speechSynthesis.cancel(); } catch {}
        if (my === token) useMp3().then(done); else done();
      }
      u.onstart = () => { started = true; };
      u.onend = finish;
      u.onerror = (e) => (!started && !['interrupted', 'canceled'].includes(e.error) ? failed() : finish());
      playing.add(entry);
      speechSynthesis.speak(u);
    };
    // Chrome sometimes swallows a phrase if it is spoken right after cancel(): wait a moment only in that case
    busy ? setTimeout(speak, 90) : speak();
  }).finally(() => { if (my === token) setTalking(false); });
  chain = run.catch(() => {});
  return run;
}

/** Turns phrases into [{ t, lang }]. A phrase can be text, { t, lang } or a list. */
export function segments(segs, lang) {
  return [segs].flat(Infinity)
    .map((s) => (s && typeof s === 'object' ? { t: spoken(s.t), lang: s.lang || lang } : { t: spoken(s), lang }))
    .filter((s) => s.t);
}

/**
 * Says one or more phrases one after another (one mp3 each).
 * A phrase can be { t, lang } to say it in another language (e.g. a Spanish word in English).
 * With { queue: true } it waits for what is playing now; otherwise it cuts it off.
 */
export function say(segs, { lang = 'es', queue = false } = {}) {
  const list = segments(segs, lang);
  if (!voice.enabled || !list.length) return Promise.resolve();
  if (!queue) stop();
  const my = token;
  if (audioCtx()) list.forEach((s) => load(urlOf(s.lang, s.t)));
  const run = chain
    .then(async () => {
      for (const { t: text, lang } of list) {
        if (my !== token) return;
        const buf = audioCtx() ? await load(urlOf(lang, text)) : null;
        if (my !== token) return;
        if (buf) {
          if (!(await running()) || my !== token) return;
          setTalking(true);
          await playBuffer(buf, my);
        } else {
          console.warn(`[voice] missing audio (${lang}): "${text}" → run npm run audio`);
          setTalking(true);
          await browserVoice(lang, text, my);
        }
      }
    })
    .finally(() => {
      if (my === token) setTalking(false);
    });
  chain = run.catch(() => {});
  return run;
}

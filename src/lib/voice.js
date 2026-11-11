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
  segs.map(spoken).filter(Boolean).forEach((t) => load(urlOf(lang, t)));
}

function setTalking(on) {
  document.getElementById('lola')?.classList.toggle('talking', on);
}

let token = 0;
let chain = Promise.resolve();
let current = null;

export function stop() {
  token++;
  if (current) {
    try { current.src?.stop(); } catch {}
    try { if (current.tts) speechSynthesis.cancel(); } catch {}
    current.done();
    current = null;
  }
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

function playBuffer(buf) {
  return new Promise((done) => {
    const c = audioCtx();
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    const safety = setTimeout(finish, buf.duration * 1000 + 600);
    function finish() {
      clearTimeout(safety);
      if (current?.src === src) current = null;
      done();
    }
    current = { src, done: finish };
    src.onended = finish;
    src.start();
  });
}

function browserVoice(lang, text) {
  return new Promise((done) => {
    if (!('speechSynthesis' in window)) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE_LANGS[lang];
    const safety = setTimeout(finish, 1500 + text.length * 90);
    function finish() {
      clearTimeout(safety);
      if (current?.tts === u) current = null;
      done();
    }
    current = { tts: u, done: finish };
    u.onend = u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

/**
 * Says one or more phrases one after another.
 * Each phrase is one mp3. With { queue: true } it waits for what is playing now;
 * otherwise it cuts it off.
 */
export function say(segs, { lang = 'es', queue = false } = {}) {
  const list = (Array.isArray(segs) ? segs : [segs]).map(spoken).filter(Boolean);
  if (!voice.enabled || !list.length) return Promise.resolve();
  if (!queue) stop();
  const my = token;
  preload(lang, list);
  const run = chain
    .then(async () => {
      for (const text of list) {
        if (my !== token) return;
        const buf = audioCtx() ? await load(urlOf(lang, text)) : null;
        if (my !== token) return;
        if (buf) {
          if (!(await running())) return;
          setTalking(true);
          await playBuffer(buf);
        } else {
          console.warn(`[voice] missing audio (${lang}): "${text}" → run npm run audio`);
          setTalking(true);
          await browserVoice(lang, text);
        }
      }
    })
    .finally(() => {
      if (my === token) setTalking(false);
    });
  chain = run.catch(() => {});
  return run;
}

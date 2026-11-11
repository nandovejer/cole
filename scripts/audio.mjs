// Generates the mp3s that are missing in public/audio/<lang>/ with Piper (open source).
// Usage: npm run audio            (only the missing ones)
//        npm run audio -- --clean (also deletes the ones nobody uses)
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { clipKey, spoken } from '../src/lib/voice-core.js';
import { ui, LANGS } from '../src/i18n/ui.js';
import { allTexts as elLaLosLas } from '../src/lessons/el-la-los-las/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'audio');

// Every phrase, by language
const texts = { es: new Set(), en: new Set() };
for (const lang of LANGS) Object.values(ui[lang].lola).flat().forEach((t) => texts[lang].add(t));
for (const pack of [elLaLosLas()])
  for (const [lang, list] of Object.entries(pack)) list.forEach((t) => texts[lang].add(t));

const todo = [];
const keep = new Map();
for (const lang of LANGS) {
  mkdirSync(join(outDir, lang), { recursive: true });
  const seen = new Map();
  keep.set(lang, new Set());
  for (const t of texts[lang]) {
    const text = spoken(t);
    if (!text) continue;
    const key = clipKey(lang, text);
    const prev = seen.get(key);
    if (prev && prev.toLowerCase() !== text.toLowerCase()) {
      console.error(`Key collision ${key}: "${prev}" / "${text}"`);
      process.exit(1);
    }
    if (prev) continue;
    seen.set(key, text);
    keep.get(lang).add(`${key}.mp3`);
    const out = join(outDir, lang, `${key}.mp3`);
    if (!existsSync(out)) todo.push({ lang, text, out });
  }
}

const total = [...keep.values()].reduce((n, s) => n + s.size, 0);
console.log(`Phrases: ${total} · missing: ${todo.length}`);

if (todo.length) {
  const py = join(root, '.venv', 'bin', 'python');
  if (!existsSync(py)) {
    console.error('Missing Piper. Install it once with:\n  python3 -m venv .venv && .venv/bin/pip install piper-tts');
    process.exit(1);
  }
  const list = join(tmpdir(), `cole-audio-${process.pid}.json`);
  writeFileSync(list, JSON.stringify(todo));
  const r = spawnSync(py, [join(root, 'scripts', 'gen_audio.py'), list], { stdio: 'inherit' });
  rmSync(list, { force: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (process.argv.includes('--clean')) {
  for (const lang of LANGS) {
    for (const f of readdirSync(join(outDir, lang))) {
      if (f.endsWith('.mp3') && !keep.get(lang).has(f)) {
        rmSync(join(outDir, lang, f));
        console.log(`Deleted ${lang}/${f}`);
      }
    }
  }
}

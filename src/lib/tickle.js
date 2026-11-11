// When you tap Lola: she laughs with a random funny phrase.
// If the child has put a name in their profile, she says it (browser voice, since the
// name cannot be generated beforehand). Without a name, she uses the mp3s.
import { say, sayLive } from './voice.js';
import { load } from './progress.js';
import { ui } from '../i18n/ui.js';

let last = -1;
function pickOne(list) {
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === last) i = (i + 1) % list.length; // not the same one twice in a row
  last = i;
  return list[i];
}

export function tickle(lang) {
  const t = ui[lang];
  const name = (load().name || '').trim();
  const mp3 = pickOne(t.lola.tickles);
  if (name) {
    // with the browser voice; if that device cannot speak, the mp3 is heard (without the name)
    return sayLive(pickOne(t.tickleNamed).replaceAll('{name}', name), { lang, fallback: mp3 });
  }
  return say(mp3, { lang });
}

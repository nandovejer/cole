// «El, la, los, las» with Lola. Each game is a screen with its own URL (#learn, #balloons…),
// so the browser's back button and links work.
import { say as voiceSay, stop as voiceStop, voice, audioCtx, unlock, preload } from '../../lib/voice.js';
import {
  ARTS, NOUNS, ANIMALS, BODY, SENT, CHEERS, L, WINS,
  artOf, wordOf, picOf, phrase,
} from './data.js';

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
const $ = (id) => document.getElementById(id);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const say = (segs, opts = {}) => voiceSay(segs, { lang: 'es', ...opts });

/* ================= effects ================= */
function tone(freqs, dur = 0.12, type = 'triangle', vol = 0.16) {
  if (!voice.enabled) return;
  try {
    const actx = audioCtx();
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      const t = actx.currentTime + i * dur;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.6);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur * 1.7);
    });
  } catch {}
}
const ding = () => tone([660, 880, 1100]);
const boop = () => tone([300, 220], 0.15, 'sine');
const popS = () => tone([1200, 500], 0.05, 'square', 0.08);

/* ================= Lola ================= */
const STARS_KEY = 'coleStars';
let stars = 0;
try { stars = parseInt(localStorage.getItem(STARS_KEY) || '0', 10) || 0; } catch {}
function addStar() {
  stars++;
  document.querySelectorAll('[data-stars]').forEach((el) => (el.textContent = stars));
  try { localStorage.setItem(STARS_KEY, stars); } catch {}
}
let lastSegs = [];
/** Lola says it: shows `text` in the bubble and plays the `segs` (one mp3 each). */
function talk(text, segs) {
  $('bubbleText').textContent = text;
  lastSegs = segs || [text];
  return say(lastSegs);
}
$('bubble').onclick = () => say(lastSegs);
$('lola').onclick = () => { happy(); say(L.tickle); };
function happy() { const l = $('lola'); l.classList.remove('happy'); void l.offsetWidth; l.classList.add('happy'); }
function confetti() {
  const cols = ['#ff5d73', '#ff9f1c', '#2ec4b6', '#3a86ff', '#9b5de5', '#ffd166'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div'); c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = rnd(cols);
    c.style.animationDuration = 2 + Math.random() * 2 + 's'; c.style.animationDelay = Math.random() * 0.6 + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    document.body.appendChild(c); setTimeout(() => c.remove(), 5000);
  }
}
let replay = null;
function win(key, again) {
  const [title, text, em] = WINS[key];
  addStar(); confetti(); tone([523, 659, 784, 1046], 0.14); happy();
  $('prizeTitle').textContent = title; $('prizeText').textContent = text; $('prizeEm').textContent = em;
  replay = again; $('overlay').classList.add('on');
  setTimeout(() => say([title, text, L.star]), 300);
}
$('prizeBtn').onclick = () => { $('overlay').classList.remove('on'); replay && replay(); };

/* ================= navigation (with URL) ================= */
let current = 'menu';
let started = false;
const screenFromUrl = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  return id && $(id)?.classList.contains('screen') ? id : 'menu';
};
function show(id) {
  current = id;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('on', s.id === id));
  $('overlay').classList.remove('on');
  stopBalloons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!started) return;
  const p = talk(L.intros[id]);
  ({ learn: initLearn, choose: initChoose, listen: initListen, balloons: initBalloons, sort: initSort,
     plural: initPlural, detective: initDetective, sentence: initSentence, unicorn: initUnicorn, body: initBody })[id]?.(p);
}
function go(id) {
  const url = location.pathname + location.search + (id === 'menu' ? '' : '#' + id);
  if (url !== location.pathname + location.search + location.hash) history.pushState({ screen: id }, '', url);
  show(id);
}
addEventListener('popstate', () => show(screenFromUrl()));
addEventListener('hashchange', () => { if (screenFromUrl() !== current) show(screenFromUrl()); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-go]');
  if (b) { e.preventDefault(); go(b.dataset.go); }
});
document.addEventListener('click', (e) => { const b = e.target.closest('[data-say]'); if (b) say(b.dataset.say); });
// The top arrow: inside a game it goes back to the lesson's games; in the menu, back to the subject.
$('backBtn')?.addEventListener('click', (e) => {
  if (current !== 'menu') { e.preventDefault(); go('menu'); }
});

function artBtn(a) { const b = document.createElement('button'); b.className = 'art bg-' + a; b.textContent = a; b.dataset.a = a; return b; }
function drawProg(el, total, done) {
  el.innerHTML = '';
  for (let i = 0; i < total; i++) { const d = document.createElement('i'); if (i < done) d.className = 'done'; el.appendChild(d); }
}
function shake(b) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); boop(); }
const after = (p, fn) => (p || Promise.resolve()).then(fn);

/* ============ 1. Get to know them ============ */
const LEARN_EX = { el: ['gato', '🐱', 'sol', '☀️'], la: ['luna', '🌙', 'flor', '🌸'], los: ['gatos', '🐱🐱🐱', 'osos', '🐻🐻🐻'], las: ['vacas', '🐮🐮🐮', 'fresas', '🍓🍓🍓'] };
const LEARN_BASE = { el: ['🐶', 'el perro'], la: ['🏠', 'la casa'], los: ['🐶🐶🐶', 'los perros'], las: ['🏠🏠🏠', 'las casas'] };
let seen = new Set(), learnWon = false;
function initLearn() {
  seen = new Set(); learnWon = false;
  document.querySelectorAll('.house').forEach((h) => {
    h.classList.remove('seen'); let k = 0;
    const a = h.dataset.a;
    h.querySelector('.ex').textContent = LEARN_BASE[a][0]; h.querySelector('.lbl').textContent = LEARN_BASE[a][1];
    h.onclick = () => {
      h.classList.add('seen'); seen.add(a); happy();
      const i = k++ % 3;
      if (i === 0) {
        h.querySelector('.ex').textContent = LEARN_BASE[a][0]; h.querySelector('.lbl').textContent = LEARN_BASE[a][1];
        talk(L.learn[a]);
      } else {
        const w = LEARN_EX[a][(i - 1) * 2], e = LEARN_EX[a][(i - 1) * 2 + 1];
        h.querySelector('.ex').textContent = e; h.querySelector('.lbl').textContent = a + ' ' + w;
        talk(cap(a) + ' ' + w + '. ' + a + ' ' + w + '.', [a + ' ' + w, a + ' ' + w]);
      }
      if (seen.size === 4 && !learnWon) { learnWon = true; setTimeout(() => win('learn', initLearn), 4500); }
    };
  });
}
$('tip').onclick = () => talk(L.tip);

/* ============ 2. Which one? ============ */
let chList = [], chIdx = 0, chLock = false; const CH_TOTAL = 8;
function initChoose(p) {
  chList = shuffle(shuffle(NOUNS).slice(0, CH_TOTAL).map((n, i) => ({ n, pl: i % 2 === 1 })));
  chIdx = 0; nextChoose(p);
}
function nextChoose(p) {
  chLock = false; drawProg($('chProg'), CH_TOTAL, chIdx);
  const { n, pl } = chList[chIdx];
  $('chPic').textContent = picOf(n, pl); $('chPic').onclick = () => say(wordOf(n, pl));
  $('chWord').textContent = wordOf(n, pl);
  const bl = $('chBlank'); bl.className = 'blank'; bl.textContent = '__';
  const box = $('chOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickChoose(b, n, pl); box.appendChild(b); });
  after(p, () => say([pl ? L.many : L.one, wordOf(n, pl), L.whichArt], { queue: true }));
}
function pickChoose(b, n, pl) {
  if (chLock) return;
  const ok = artOf(n, pl);
  if (b.dataset.a === ok) {
    chLock = true; ding(); happy(); b.classList.add('good');
    const bl = $('chBlank'); bl.textContent = ok; bl.className = 'blank filled bg-' + ok;
    const c = rnd(CHEERS); talk(c + ' ' + cap(phrase(n, pl)) + '.', [c, phrase(n, pl)]);
    chIdx++; drawProg($('chProg'), CH_TOTAL, chIdx);
    setTimeout(() => (chIdx >= CH_TOTAL ? win('choose', () => initChoose()) : nextChoose()), 2600);
  } else {
    shake(b);
    const a = b.dataset.a, plA = a.endsWith('s');
    if (plA !== pl) talk(pl ? L.manyNeedS : L.oneNoS);
    else talk(`${L.almostSayIt} ¿${a} ${wordOf(n, pl)}? ${L.soundsOdd}`, [L.almostSayIt, a + ' ' + wordOf(n, pl), L.soundsOdd]);
  }
}

/* ============ 3. Listen and tap ============ */
let lsIdx = 0, lsLock = false, lsTarget = null; const LS_TOTAL = 6;
function initListen(p) { lsIdx = 0; nextListen(p); }
function nextListen(p) {
  lsLock = false; drawProg($('lsProg'), LS_TOTAL, lsIdx);
  const pool = shuffle(NOUNS); const n = pool[0], other = pool[1];
  const pl = Math.random() < 0.5;
  lsTarget = { n, pl };
  const opts = shuffle([{ n, pl }, { n, pl: !pl }, { n: other, pl }, { n: other, pl: !pl }]);
  const box = $('lsPics'); box.innerHTML = '';
  opts.forEach((o) => {
    const b = document.createElement('button'); b.className = 'pic'; b.textContent = picOf(o.n, o.pl);
    b.onclick = () => pickListen(b, o); box.appendChild(b);
  });
  after(p, () => say(phrase(n, pl), { queue: true }));
}
$('speakBtn').onclick = () => lsTarget && say(phrase(lsTarget.n, lsTarget.pl));
function pickListen(b, o) {
  if (lsLock) return;
  const t = lsTarget;
  if (o.n === t.n && o.pl === t.pl) {
    lsLock = true; ding(); happy(); b.classList.add('good');
    const c = rnd(CHEERS); talk(c + ' ' + cap(phrase(t.n, t.pl)) + '.', [c, phrase(t.n, t.pl)]);
    lsIdx++; drawProg($('lsProg'), LS_TOTAL, lsIdx);
    setTimeout(() => (lsIdx >= LS_TOTAL ? win('listen', () => initListen()) : nextListen()), 2400);
  } else {
    shake(b);
    const target = phrase(t.n, t.pl);
    if (o.n === t.n) { const l = o.pl ? L.thereMany : L.thereOne; talk(l + ' ' + target, [l, target]); }
    else talk(`${L.thatIs} ${phrase(o.n, o.pl)}. ${L.listenAgain} ${target}`, [L.thatIs, phrase(o.n, o.pl), L.listenAgain, target]);
  }
}

/* ============ 4. Balloons ============ */
let bTarget = '', bScore = 0, bTimer = null, bPlaying = false; const B_TOTAL = 6;
function initBalloons() {
  bScore = 0; bTarget = rnd(ARTS); bPlaying = false;
  $('target').innerHTML = '';
  const lbl = document.createElement('span'); lbl.textContent = $('target').dataset.label;
  const b = artBtn(bTarget); b.onclick = () => say(bTarget);
  $('target').append(lbl, b);
  drawProg($('bProg'), B_TOTAL, 0);
  $('sky').querySelectorAll('.balloon,.burst').forEach((x) => x.remove());
  $('startBtn').style.display = 'block';
}
$('startBtn').onclick = () => {
  $('startBtn').style.display = 'none'; bPlaying = true;
  say(L.findWith(bTarget));
  spawn(); bTimer = setInterval(spawn, 3000);
};
function stopBalloons() { clearInterval(bTimer); bTimer = null; bPlaying = false; }
const BCOL = ['#ffe0e6', '#fff3c4', '#d9f99d', '#cdeafe', '#ead7ff', '#ffe4cc'];
// balloon size depends on the screen (smaller on mobile)
const bSize = () => ($('sky').clientWidth < 360 ? 130 : $('sky').clientWidth < 520 ? 145 : 160);
function slots() {
  const sky = $('sky'), W = sky.clientWidth, H = sky.clientHeight, S = bSize();
  const cols = Math.max(2, Math.floor(W / (S + 10))), rows = Math.max(2, Math.floor((H - 30) / (S + 25)));
  const cw = W / cols, list = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    list.push({ key: r + '-' + c, left: c * cw + (cw - S) / 2, top: 16 + r * (S + 25) });
  return list;
}
function freeSlot() {
  const used = new Set([...$('sky').querySelectorAll('.balloon')].map((b) => b.dataset.slot));
  const free = slots().filter((s) => !used.has(s.key));
  return free.length ? rnd(free) : null;
}
function spawn() {
  if (!bPlaying) return;
  const slot = freeSlot();
  if (!slot) { // sky full: the oldest wrong balloon flies away
    const wrong = [...$('sky').querySelectorAll('.balloon:not(.leaving)')].find((b) => b.dataset.ok !== '1');
    if (wrong) flyAway(wrong);
    return;
  }
  const wantM = bTarget === 'el' || bTarget === 'los';
  if (Math.random() < 0.5) makeBalloon(rnd(NOUNS.filter((x) => (x.g === 'm') === wantM)), bTarget.endsWith('s'), slot);
  else makeBalloon(rnd(NOUNS), Math.random() < 0.5, slot);
}
function makeBalloon(n, pl, slot) {
  const sky = $('sky'), S = bSize();
  const b = document.createElement('button'); b.className = 'balloon';
  b.style.width = S + 'px'; b.style.height = S + 5 + 'px';
  b.innerHTML = `<span class="e">${picOf(n, pl)}</span><span class="w">${wordOf(n, pl)}</span>`;
  b.style.background = rnd(BCOL); b.style.left = slot.left + 'px'; b.style.top = sky.clientHeight + 20 + 'px';
  b.dataset.slot = slot.key; b.dataset.ok = artOf(n, pl) === bTarget ? '1' : '0';
  b.onclick = () => hitBalloon(b, n, pl);
  sky.appendChild(b);
  const dur = (sky.clientHeight + 20 - slot.top) * 22; // very slow: ~22 ms per pixel
  const anim = b.animate([{ top: sky.clientHeight + 20 + 'px' }, { top: slot.top + 'px' }], { duration: dur, easing: 'ease-out', fill: 'forwards' });
  anim.onfinish = () => { b.style.top = slot.top + 'px'; anim.cancel(); b.classList.add('float'); b.style.animationDelay = -Math.random() * 3 + 's'; };
}
function flyAway(b) {
  b.classList.add('leaving'); b.dataset.slot = 'x'; b.style.pointerEvents = 'none';
  b.animate([{ opacity: 1, top: b.offsetTop + 'px' }, { opacity: 0, top: b.offsetTop - 200 + 'px' }], { duration: 1500, fill: 'forwards' }).onfinish = () => b.remove();
}
function hitBalloon(b, n, pl) {
  if (!bPlaying) return;
  const sky = $('sky'), r = b.getBoundingClientRect(), sr = sky.getBoundingClientRect();
  if (artOf(n, pl) === bTarget) {
    popS();
    const bu = document.createElement('div'); bu.className = 'burst'; bu.textContent = '💥';
    bu.style.left = r.left - sr.left + 40 + 'px'; bu.style.top = r.top - sr.top + 30 + 'px';
    sky.appendChild(bu); setTimeout(() => bu.remove(), 500);
    b.remove(); bScore++; drawProg($('bProg'), B_TOTAL, bScore);
    talk(L.yes + ' ' + cap(phrase(n, pl)) + '.', [L.yes, phrase(n, pl)]);
    if (bScore >= B_TOTAL) { stopBalloons(); setTimeout(() => win('balloons', initBalloons), 1400); }
  } else {
    boop(); b.style.filter = 'grayscale(1)'; b.style.pointerEvents = 'none';
    talk(`${L.oops} ${phrase(n, pl)}. ${L.find(bTarget)}`, [L.oops, phrase(n, pl), L.find(bTarget)]);
    setTimeout(() => flyAway(b), 1800);
  }
}

/* ============ 5. Little houses ============ */
let soList = [], soIdx = 0, soLock = false; const SO_TOTAL = 8;
function initSort(p) {
  soList = shuffle(shuffle(NOUNS).slice(0, SO_TOTAL).map((n, i) => ({ n, pl: i % 2 === 1 }))); soIdx = 0;
  ARTS.forEach((a) => ($('hc-' + a).textContent = ''));
  document.querySelectorAll('.hbtn').forEach((h) => (h.onclick = () => pickSort(h)));
  nextSort(p);
}
function nextSort(p) {
  soLock = false; drawProg($('soProg'), SO_TOTAL, soIdx);
  const { n, pl } = soList[soIdx];
  $('soCard').classList.remove('fly');
  $('soPic').textContent = picOf(n, pl); $('soWord').textContent = wordOf(n, pl);
  $('soCard').onclick = () => say(wordOf(n, pl));
  after(p, () => say([wordOf(n, pl), L.whichHouse], { queue: true }));
}
function pickSort(h) {
  if (soLock) return;
  const { n, pl } = soList[soIdx], ok = artOf(n, pl);
  if (h.dataset.h === ok) {
    soLock = true; ding(); happy(); h.classList.remove('good'); void h.offsetWidth; h.classList.add('good');
    $('soCard').classList.add('fly');
    setTimeout(() => { $('hc-' + ok).textContent += n.e; }, 400);
    const c = rnd(CHEERS); talk(c + ' ' + cap(phrase(n, pl)) + '.', [c, phrase(n, pl)]);
    soIdx++; drawProg($('soProg'), SO_TOTAL, soIdx);
    setTimeout(() => (soIdx >= SO_TOTAL ? win('sort', () => initSort()) : nextSort()), 2300);
  } else {
    shake(h);
    const a = h.dataset.h;
    if (a.endsWith('s') !== pl) talk(pl ? L.manyHouseS : L.oneHouseNoS);
    else talk(`${L.almostSay} ¿${a} ${wordOf(n, pl)}? ${L.soundsGood}`, [L.almostSay, a + ' ' + wordOf(n, pl), L.soundsGood]);
  }
}

/* ============ 6. One and many ============ */
let plList = [], plIdx = 0, plLock = false; const PL_TOTAL = 6;
function initPlural(p) { plList = shuffle(NOUNS).slice(0, PL_TOTAL).map((n, i) => ({ n, toPl: i % 3 !== 2 })); plIdx = 0; nextPlural(p); }
function nextPlural(p) {
  plLock = false; drawProg($('plProg'), PL_TOTAL, plIdx);
  const { n, toPl } = plList[plIdx], fromPl = !toPl;
  const q = toPl ? L.ifMany : L.ifOne;
  $('plFrom').textContent = picOf(n, fromPl); $('plFromTxt').textContent = phrase(n, fromPl);
  $('plTo').textContent = picOf(n, toPl);
  $('plAsk').textContent = '⬇️ ' + q + ' ⬇️';
  const right = phrase(n, toPl);
  const otherArt = { el: 'la', la: 'el', los: 'las', las: 'los' }[artOf(n, toPl)];
  const wrong1 = otherArt + ' ' + wordOf(n, toPl); // wrong article
  const wrong2 = artOf(n, toPl) + ' ' + wordOf(n, !toPl); // word not changed
  const box = $('plOpts'); box.innerHTML = '';
  shuffle([right, wrong1, wrong2]).forEach((t) => {
    const b = document.createElement('button'); b.className = 'phr'; b.textContent = t;
    b.onclick = () => pickPlural(b, t, right); box.appendChild(b);
  });
  $('plFromTxt').onclick = () => say(phrase(n, fromPl));
  $('plAsk').onclick = () => say([phrase(n, fromPl), q]);
  after(p, () => say([phrase(n, fromPl), q], { queue: true }));
}
function pickPlural(b, t, right) {
  if (plLock) return;
  if (t === right) {
    plLock = true; ding(); happy(); b.classList.add('good');
    const c = rnd(CHEERS); talk(c + ' ' + cap(right) + '.', [c, right]);
    plIdx++; drawProg($('plProg'), PL_TOTAL, plIdx);
    setTimeout(() => (plIdx >= PL_TOTAL ? win('plural', () => initPlural()) : nextPlural()), 2300);
  } else {
    shake(b);
    talk(`${L.mmm} ${t}... ${L.notGood}`, [L.mmm, t, L.notGood]);
  }
}

/* ============ 7. Detective Lola ============ */
let deList = [], deIdx = 0, deLock = false; const DE_TOTAL = 8;
function initDetective(p) {
  deList = shuffle(shuffle(NOUNS).slice(0, DE_TOTAL).map((n, i) => {
    const pl = Math.random() < 0.5, right = artOf(n, pl);
    const bad = i % 2 === 0; const said = bad ? rnd(ARTS.filter((a) => a !== right)) : right;
    return { n, pl, said, bad };
  }));
  deIdx = 0;
  $('deYes').onclick = () => pickDet(false); $('deNo').onclick = () => pickDet(true);
  nextDet(p);
}
function nextDet(p) {
  deLock = false; drawProg($('deProg'), DE_TOTAL, deIdx);
  const d = deList[deIdx], said = d.said + ' ' + wordOf(d.n, d.pl);
  $('dePic').textContent = picOf(d.n, d.pl);
  $('deTxt').textContent = said; $('deTxt').style.color = '';
  $('deTxt').onclick = () => say(said);
  $('deOpts').style.display = 'flex'; $('deFix').style.display = 'none';
  after(p, () => say([said, L.saidRight], { queue: true }));
}
function detNext() {
  deIdx++; drawProg($('deProg'), DE_TOTAL, deIdx);
  setTimeout(() => (deIdx >= DE_TOTAL ? win('detective', () => initDetective()) : nextDet()), 2500);
}
function pickDet(saysBad) {
  if (deLock) return;
  const d = deList[deIdx], right = phrase(d.n, d.pl), said = d.said + ' ' + wordOf(d.n, d.pl);
  if (saysBad === d.bad) {
    deLock = true; ding(); happy();
    if (d.bad) { // now let them fix it
      talk(L.caught);
      $('deOpts').style.display = 'none'; const box = $('deFix'); box.innerHTML = ''; box.style.display = 'flex';
      ARTS.forEach((a) => {
        const b = artBtn(a);
        b.onclick = () => {
          if (a === artOf(d.n, d.pl)) {
            ding(); b.classList.add('good'); $('deTxt').textContent = right; $('deTxt').style.color = '#16a34a';
            box.querySelectorAll('button').forEach((x) => (x.onclick = null));
            talk(`${L.thatsIt} ${cap(right)}.`, [L.thatsIt, right]); detNext();
          } else {
            shake(b); const w = a + ' ' + wordOf(d.n, d.pl);
            talk(`¿${w}? ${L.notThat}`, [w, L.notThat]);
          }
        };
        box.appendChild(b);
      });
    } else { talk(`${L.yesRight} ${right}.`, [L.yesRight, right]); detNext(); }
  } else {
    boop();
    if (d.bad) talk(`${L.listenAgain} ${said}. ${L.sure}`, [L.listenAgain, said, L.sure]);
    else { talk(`${L.iThinkRight} ${right}. ${L.listen}`, [L.iThinkRight, right, L.listen]); deLock = true; detNext(); }
  }
}

/* ============ 8. Sentences ============ */
let snList = [], snIdx = 0, snLock = false; const SN_TOTAL = 6;
function initSentence(p) {
  const t = shuffle(SENT);
  snList = shuffle(NOUNS).slice(0, SN_TOTAL).map((n, i) => ({ n, pl: Math.random() < 0.5, t: t[i % t.length] }));
  snIdx = 0; nextSentence(p);
}
const sentStart = (s) => (s.pl && s.t.ap ? s.t.ap : s.t.a);
function nextSentence(p) {
  snLock = false; drawProg($('snProg'), SN_TOTAL, snIdx);
  const s = snList[snIdx];
  $('snPic').textContent = picOf(s.n, s.pl); $('snPic').onclick = () => say(wordOf(s.n, s.pl));
  $('snTxt').innerHTML = `${sentStart(s)} <span class="blank" id="snBlank">__</span> ${wordOf(s.n, s.pl)}${s.t.b}`;
  $('snTxt').onclick = () => say([sentStart(s), wordOf(s.n, s.pl)]);
  const box = $('snOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickSentence(b, s); box.appendChild(b); });
  after(p, () => say([sentStart(s), wordOf(s.n, s.pl), L.missing], { queue: true }));
}
function pickSentence(b, s) {
  if (snLock) return;
  const ok = artOf(s.n, s.pl);
  if (b.dataset.a === ok) {
    snLock = true; ding(); happy(); b.classList.add('good');
    const bl = $('snBlank'); bl.textContent = ok; bl.className = 'blank filled bg-' + ok;
    const c = rnd(CHEERS);
    talk(`${c} ${sentStart(s)} ${phrase(s.n, s.pl)}${s.t.b}`, [c, sentStart(s), phrase(s.n, s.pl)]);
    snIdx++; drawProg($('snProg'), SN_TOTAL, snIdx);
    setTimeout(() => (snIdx >= SN_TOTAL ? win('sentence', () => initSentence()) : nextSentence()), 2800);
  } else {
    shake(b);
    const a = b.dataset.a;
    if (a.endsWith('s') !== s.pl) talk(s.pl ? L.lookMany : L.lookOne);
    else talk(`${L.readWith} ${a}. ${L.soundsGood}`, [L.readWith, a, L.soundsGood]);
  }
}

/* ============ 9. The unicorn and its friends ============ */
let unIdx = 0, unLock = false, unT = null; const UN_TOTAL = 6;
const animalPool = () => NOUNS.filter((n) => ANIMALS.includes(n.s));
const unAsk = (n, pl) => [pl ? L.whereAre : L.whereIs, phrase(n, pl)];
const unAskTxt = (n, pl) => unAsk(n, pl).join(' ') + '?';
function initUnicorn(p) {
  unIdx = 0; for (let i = 0; i < 6; i++) $('rb' + i).classList.remove('on');
  $('uniSvg').classList.remove('fly'); nextUnicorn(p);
}
function nextUnicorn(p) {
  unLock = false; drawProg($('unProg'), UN_TOTAL, unIdx);
  const pool = shuffle(animalPool()), n = pool[0], o = pool[1], pl = Math.random() < 0.5;
  unT = { n, pl };
  $('unTxt').innerHTML = (pl ? L.whereAre : L.whereIs) + ` <span class="hlart bg-${artOf(n, pl)}">${artOf(n, pl)}</span> ${wordOf(n, pl)}?`;
  $('unTxt').onclick = () => say(unAsk(n, pl));
  const box = $('unPics'); box.innerHTML = '';
  shuffle([{ n, pl }, { n, pl: !pl }, { n: o, pl }, { n: o, pl: !pl }]).forEach((x) => {
    const b = document.createElement('button'); b.className = 'pic'; b.textContent = picOf(x.n, x.pl);
    b.onclick = () => pickUnicorn(b, x); box.appendChild(b);
  });
  after(p, () => say([L.uniAsks, ...unAsk(n, pl)], { queue: true }));
}
function pickUnicorn(b, x) {
  if (unLock) return;
  const t = unT;
  if (x.n === t.n && x.pl === t.pl) {
    unLock = true; ding(); happy(); b.classList.add('good');
    const u = $('uniSvg'); u.classList.remove('hop'); void u.offsetWidth; u.classList.add('hop');
    $('rb' + unIdx).classList.add('on');
    const c = rnd(CHEERS), here = t.pl ? L.hereAre : L.hereIs;
    talk(`${c} ${here} ${phrase(t.n, t.pl)}!`, [c, here, phrase(t.n, t.pl)]);
    unIdx++; drawProg($('unProg'), UN_TOTAL, unIdx);
    if (unIdx >= UN_TOTAL) {
      setTimeout(() => { $('uniSvg').classList.add('fly'); tone([523, 659, 784, 988, 1175], 0.12); }, 900);
      setTimeout(() => win('unicorn', () => initUnicorn()), 3200);
    } else setTimeout(nextUnicorn, 2400);
  } else {
    shake(b);
    if (x.n === t.n) { const l = x.pl ? L.readMany : L.readOne; talk(l + ' ' + unAskTxt(t.n, t.pl), [l, ...unAsk(t.n, t.pl)]); }
    else talk(`${L.thatOne} ${phrase(x.n, x.pl)}. ${unAskTxt(t.n, t.pl)}`, [L.thatOne, phrase(x.n, x.pl), ...unAsk(t.n, t.pl)]);
  }
}

/* ============ 10. My body ============ */
let boList = [], boIdx = 0, boLock = false; const BO_TOTAL = 8;
function drawRings(part, cls) {
  const g = $('rings');
  part.r.forEach(([cx, cy, r]) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r); c.setAttribute('class', cls); g.appendChild(c);
  });
}
function initBody(p) { boList = shuffle(BODY).slice(0, BO_TOTAL); boIdx = 0; $('rings').innerHTML = ''; nextBody(p); }
function nextBody(p) {
  boLock = false; drawProg($('boProg'), BO_TOTAL, boIdx);
  const part = boList[boIdx];
  $('rings').querySelectorAll('.ring').forEach((x) => x.remove());
  drawRings(part, 'ring');
  $('boWord').textContent = part.s; const bl = $('boBlank'); bl.className = 'blank'; bl.textContent = '__';
  $('boWord').onclick = () => say(part.s);
  const box = $('boOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickBody(b, part); box.appendChild(b); });
  after(p, () => say([L.glows, part.s, L.whichArt], { queue: true }));
}
function pickBody(b, part) {
  if (boLock) return;
  const right = part.a + ' ' + part.s;
  if (b.dataset.a === part.a) {
    boLock = true; ding(); happy(); b.classList.add('good');
    const bl = $('boBlank'); bl.textContent = part.a; bl.className = 'blank filled bg-' + part.a;
    $('rings').querySelectorAll('.ring').forEach((x) => x.remove()); drawRings(part, 'ringok');
    const c = rnd(CHEERS);
    talk(`${c} ${cap(right)}. ${L.touch} ${right}!`, [c, right, L.touch, right]);
    boIdx++; drawProg($('boProg'), BO_TOTAL, boIdx);
    setTimeout(() => (boIdx >= BO_TOTAL ? win('body', () => initBody()) : nextBody()), 3000);
  } else {
    shake(b);
    const pl = part.a.endsWith('s'), w = b.dataset.a + ' ' + part.s;
    if (b.dataset.a.endsWith('s') !== pl) talk(pl ? L.glowTwo : L.glowOne);
    else talk(`${L.almost} ¿${w}? ${L.sayAloud}`, [L.almost, w, L.sayAloud]);
  }
}

/* ============ start: the browser only lets us talk after the first tap ============ */
show(screenFromUrl());
lastSegs = [L.hello];
preload('es', [L.hello, ...Object.values(L.intros)]);
$('startAll').onclick = () => {
  unlock();
  $('splash').classList.remove('on');
  started = true;
  ding();
  const id = screenFromUrl();
  if (id === 'menu') { current = 'menu'; talk(L.hello); }
  else show(id);
};
// if they turn the sound off while Lola is talking
document.addEventListener('cole:sound', () => { if (!voice.enabled) voiceStop(); });

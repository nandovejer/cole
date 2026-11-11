// Lola's lesson «el, la, los, las» (only in Spanish: Lengua lessons are not translated).
// Each game is a screen with its own URL (#learn, #balloons…), so the back button works.
//
// When Lola speaks (we want the children to READ):
//  - Always: game instructions, "Conoce" (it is the explanation), praise and hints.
//  - Listening games (listen, detective): she says the word, that is the game.
//  - Reading games: she does NOT read the question. Only after 2 mistakes on the same
//    question does she read it to help (and from then on tapping it also reads it).
import { say as voiceSay, stop as voiceStop, voice, audioCtx, unlock, preload } from '../../lib/voice.js';
import * as progress from '../../lib/progress.js';
import { tickle } from '../../lib/tickle.js';
import { pack as K } from './data.js';

const LESSON = 'el-la-los-las';
const LANG = K.lang;
const { ARTS, NOUNS, ANIMALS, BODY, SENT, WHERE, LEARN, L, CHEERS, WINS, artOf, wordOf, picOf, phrase, isPl, otherArt } = K;

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
const pick = (count) => (K.pick ? K.pick(count) : shuffle(NOUNS).slice(0, count));
const $ = (id) => document.getElementById(id);
const say = (segs, opts = {}) => voiceSay(segs, { lang: LANG, ...opts });
const C = (a, w) => a + ' ' + w;

/** Text for the bubble from the phrases (capital letter after . ! ? :). */
function txt(segs) {
  let out = '';
  for (const t of [segs].flat(Infinity)) {
    let s = String(t);
    if (!out || /[.!?:]$/.test(out)) s = s.replace(/\p{L}/u, (c) => c.toUpperCase());
    out += (out ? ' ' : '') + s;
  }
  return out;
}

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

/* ================= progress and reading help ================= */
let mistakes = 0; // in the round (for "no mistakes")
let tries = 0; // in the current question
let question = null; // what Lola would read if help is needed
function round() { mistakes = 0; }
/** New question to READ: Lola does not say it yet. */
function ask(segs) { tries = 0; question = segs; }
const helping = () => tries >= 2 && question;
/** Tapping the word/picture: only reads it once help has been unlocked. */
const helpTap = (segs) => () => { if (tries >= 2) say(segs); };
function right() { ding(); happy(); progress.answer(LESSON, current, true); }
function wrong(b) {
  if (b) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
  boop(); mistakes++; tries++; progress.answer(LESSON, current, false);
}
/** Hint after a mistake; from the 2nd mistake Lola also reads the question. */
function hint(segs) {
  const p = talk(segs);
  if (helping()) later(p, question);
}

/* ================= Lola ================= */
let lastSegs = [];
let seq = 0; // goes up every time Lola starts saying something new
/** Lola says it: shows the text in the bubble and plays the phrases (one mp3 each). */
function talk(segs, display) {
  seq++;
  lastSegs = segs;
  $('bubbleText').textContent = display ?? txt(segs);
  return say(segs);
}
$('bubble').onclick = () => say(lastSegs);
$('lola').onclick = () => { happy(); seq++; tickle(LANG); }; // with the profile name if there is one
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
  progress.win(LESSON, key, mistakes === 0);
  confetti(); tone([523, 659, 784, 1046], 0.14); happy();
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
  if (id !== 'menu') progress.played(LESSON, id);
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
document.addEventListener('click', (e) => { const b = e.target.closest('[data-tag]'); if (b) talk(L.tags[b.dataset.tag]); });
// The top arrow: inside a game it goes back to the lesson's games; in the menu, back to the subject.
$('backBtn')?.addEventListener('click', (e) => {
  if (current !== 'menu') { e.preventDefault(); go('menu'); }
});

function artBtn(a) { const b = document.createElement('button'); b.className = 'art bg-' + a; b.textContent = a; b.dataset.a = a; return b; }
function drawProg(el, total, done) {
  el.innerHTML = '';
  for (let i = 0; i < total; i++) { const d = document.createElement('i'); if (i < done) d.className = 'done'; el.appendChild(d); }
}
/** Says `segs` when `p` finishes, but only if nothing new has been said in the meantime
 *  (if the child taps fast, old phrases do not pile up or overlap). */
function later(p, segs) {
  const my = seq;
  (p || Promise.resolve()).then(() => { if (my === seq) say(segs, { queue: true }); });
}

/* ============ 1. Get to know them (explanation: always with voice) ============ */
const HOUSES = Object.fromEntries(LEARN.rows.flatMap((r) => r.houses).map((h) => [h.k, h]));
let seen = new Set(), learnWon = false;
function initLearn() {
  round(); seen = new Set(); learnWon = false;
  document.querySelectorAll('.house').forEach((el) => {
    el.classList.remove('seen'); let k = 0;
    const h = HOUSES[el.dataset.k];
    el.querySelector('.ex').textContent = h.ex; el.querySelector('.lbl').textContent = h.lbl;
    el.onclick = () => {
      el.classList.add('seen'); seen.add(h.k); happy();
      const i = k++ % 3;
      if (i === 0) {
        el.querySelector('.ex').textContent = h.ex; el.querySelector('.lbl').textContent = h.lbl;
        talk(L.learn[h.k]);
      } else {
        const w = LEARN.ex[h.k][(i - 1) * 2], e = LEARN.ex[h.k][(i - 1) * 2 + 1];
        el.querySelector('.ex').textContent = e; el.querySelector('.lbl').textContent = C(h.a, w);
        talk([C(h.a, w), C(h.a, w)]);
      }
      if (seen.size === Object.keys(HOUSES).length && !learnWon) { learnWon = true; setTimeout(() => win('learn', initLearn), 4500); }
    };
  });
}
$('tip').onclick = () => talk(L.tip);

/* ============ 2. Which one? (reading) ============ */
let chList = [], chIdx = 0, chLock = false; const CH_TOTAL = 8;
function initChoose() {
  round();
  chList = shuffle(pick(CH_TOTAL).map((n, i) => ({ n, pl: i % 2 === 1 })));
  chIdx = 0; nextChoose();
}
function nextChoose() {
  chLock = false; drawProg($('chProg'), CH_TOTAL, chIdx);
  const { n, pl } = chList[chIdx];
  ask([pl ? L.many : L.one, wordOf(n, pl), L.whichArt]);
  $('chPic').textContent = picOf(n, pl); $('chPic').onclick = helpTap(wordOf(n, pl));
  $('chWord').textContent = wordOf(n, pl);
  const bl = $('chBlank'); bl.className = 'blank'; bl.textContent = '__';
  const box = $('chOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickChoose(b, n, pl); box.appendChild(b); });
}
function pickChoose(b, n, pl) {
  if (chLock) return;
  const ok = artOf(n, pl);
  if (b.dataset.a === ok) {
    chLock = true; right(); b.classList.add('good');
    const bl = $('chBlank'); bl.textContent = ok; bl.className = 'blank filled bg-' + ok;
    talk([rnd(CHEERS), phrase(n, pl)]);
    chIdx++; drawProg($('chProg'), CH_TOTAL, chIdx);
    setTimeout(() => (chIdx >= CH_TOTAL ? win('choose', () => initChoose()) : nextChoose()), 2600);
  } else {
    wrong(b);
    const a = b.dataset.a;
    if (isPl(a) !== pl) hint(pl ? L.manyNeedS : L.oneNoS);
    else hint([L.almostSayIt, C(a, wordOf(n, pl)), L.soundsOdd]);
  }
}

/* ============ 3. Listen and tap (listening: Lola says the word) ============ */
let lsIdx = 0, lsLock = false, lsTarget = null; const LS_TOTAL = 6;
function initListen(p) { round(); lsIdx = 0; nextListen(p); }
function nextListen(p) {
  lsLock = false; drawProg($('lsProg'), LS_TOTAL, lsIdx);
  const pool = shuffle(pick(LS_TOTAL)); const n = pool[0], other = pool[1];
  const pl = Math.random() < 0.5;
  lsTarget = { n, pl };
  const opts = shuffle([{ n, pl }, { n, pl: !pl }, { n: other, pl }, { n: other, pl: !pl }]);
  const box = $('lsPics'); box.innerHTML = '';
  opts.forEach((o) => {
    const b = document.createElement('button'); b.className = 'pic'; b.textContent = picOf(o.n, o.pl);
    b.onclick = () => pickListen(b, o); box.appendChild(b);
  });
  later(p, phrase(n, pl));
}
$('speakBtn').onclick = () => lsTarget && say(phrase(lsTarget.n, lsTarget.pl));
function pickListen(b, o) {
  if (lsLock) return;
  const t = lsTarget;
  if (o.n === t.n && o.pl === t.pl) {
    lsLock = true; right(); b.classList.add('good');
    talk([rnd(CHEERS), phrase(t.n, t.pl)]);
    lsIdx++; drawProg($('lsProg'), LS_TOTAL, lsIdx);
    setTimeout(() => (lsIdx >= LS_TOTAL ? win('listen', () => initListen()) : nextListen()), 2400);
  } else {
    wrong(b);
    if (o.n === t.n) talk([o.pl ? L.thereMany : L.thereOne, phrase(t.n, t.pl)]);
    else talk([L.thatIs, phrase(o.n, o.pl), L.listenAgain, phrase(t.n, t.pl)]);
  }
}

/* ============ 4. Balloons (reading: the words on the balloons are not read) ============ */
let bTarget = '', bScore = 0, bTimer = null, bPlaying = false; const B_TOTAL = 6;
function initBalloons() {
  round();
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
  const sky = $('sky'), Wd = sky.clientWidth, H = sky.clientHeight, S = bSize();
  const cols = Math.max(2, Math.floor(Wd / (S + 10))), rows = Math.max(2, Math.floor((H - 30) / (S + 25)));
  const cw = Wd / cols, list = [];
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
    const bad = [...$('sky').querySelectorAll('.balloon:not(.leaving)')].find((b) => b.dataset.ok !== '1');
    if (bad) flyAway(bad);
    return;
  }
  if (Math.random() < 0.5) { // one that is right
    const fits = NOUNS.flatMap((n) => [false, true].map((pl) => ({ n, pl }))).filter((x) => artOf(x.n, x.pl) === bTarget);
    const x = rnd(fits); makeBalloon(x.n, x.pl, slot);
  } else makeBalloon(rnd(NOUNS), Math.random() < 0.5, slot);
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
    popS(); progress.answer(LESSON, current, true);
    const bu = document.createElement('div'); bu.className = 'burst'; bu.textContent = '💥';
    bu.style.left = r.left - sr.left + 40 + 'px'; bu.style.top = r.top - sr.top + 30 + 'px';
    sky.appendChild(bu); setTimeout(() => bu.remove(), 500);
    b.remove(); bScore++; drawProg($('bProg'), B_TOTAL, bScore);
    talk([L.yes, phrase(n, pl)]);
    if (bScore >= B_TOTAL) { stopBalloons(); setTimeout(() => win('balloons', initBalloons), 1400); }
  } else {
    wrong(); b.style.filter = 'grayscale(1)'; b.style.pointerEvents = 'none';
    talk([L.oops, phrase(n, pl), L.find(bTarget)]);
    setTimeout(() => flyAway(b), 1800);
  }
}

/* ============ 5. Little houses (reading) ============ */
let soList = [], soIdx = 0, soLock = false; const SO_TOTAL = 8;
function initSort() {
  round();
  soList = shuffle(pick(SO_TOTAL).map((n, i) => ({ n, pl: i % 2 === 1 }))); soIdx = 0;
  ARTS.forEach((a) => ($('hc-' + a).textContent = ''));
  document.querySelectorAll('.hbtn').forEach((h) => (h.onclick = () => pickSort(h)));
  nextSort();
}
function nextSort() {
  soLock = false; drawProg($('soProg'), SO_TOTAL, soIdx);
  const { n, pl } = soList[soIdx];
  ask([wordOf(n, pl), L.whichHouse]);
  $('soCard').classList.remove('fly');
  $('soPic').textContent = picOf(n, pl); $('soWord').textContent = wordOf(n, pl);
  $('soCard').onclick = helpTap(wordOf(n, pl));
}
function pickSort(h) {
  if (soLock) return;
  const { n, pl } = soList[soIdx], ok = artOf(n, pl);
  if (h.dataset.h === ok) {
    soLock = true; right(); h.classList.remove('good'); void h.offsetWidth; h.classList.add('good');
    $('soCard').classList.add('fly');
    setTimeout(() => { $('hc-' + ok).textContent += n.e; }, 400);
    talk([rnd(CHEERS), phrase(n, pl)]);
    soIdx++; drawProg($('soProg'), SO_TOTAL, soIdx);
    setTimeout(() => (soIdx >= SO_TOTAL ? win('sort', () => initSort()) : nextSort()), 2300);
  } else {
    wrong(h);
    const a = h.dataset.h;
    if (isPl(a) !== pl) hint(pl ? L.manyHouseS : L.oneHouseNoS);
    else hint([L.almostSay, C(a, wordOf(n, pl)), L.soundsGood]);
  }
}

/* ============ 6. One and many (reading) ============ */
let plList = [], plIdx = 0, plLock = false; const PL_TOTAL = 6;
function initPlural() { round(); plList = pick(PL_TOTAL).map((n, i) => ({ n, toPl: i % 3 !== 2 })); plIdx = 0; nextPlural(); }
function nextPlural() {
  plLock = false; drawProg($('plProg'), PL_TOTAL, plIdx);
  const { n, toPl } = plList[plIdx], fromPl = !toPl;
  const q = toPl ? L.ifMany : L.ifOne;
  ask([phrase(n, fromPl), q]);
  $('plFrom').textContent = picOf(n, fromPl); $('plFromTxt').textContent = phrase(n, fromPl);
  $('plTo').textContent = picOf(n, toPl);
  $('plAsk').textContent = '⬇️ ' + q + ' ⬇️';
  const ok = phrase(n, toPl);
  const wrong1 = C(otherArt(n, toPl), wordOf(n, toPl)); // wrong article
  const wrong2 = C(artOf(n, toPl), wordOf(n, !toPl)); // word not changed
  const box = $('plOpts'); box.innerHTML = '';
  shuffle([ok, wrong1, wrong2]).forEach((t) => {
    const b = document.createElement('button'); b.className = 'phr'; b.textContent = t;
    b.onclick = () => pickPlural(b, t, ok); box.appendChild(b);
  });
  $('plFromTxt').onclick = helpTap(phrase(n, fromPl));
  $('plAsk').onclick = helpTap([phrase(n, fromPl), q]);
}
function pickPlural(b, t, ok) {
  if (plLock) return;
  if (t === ok) {
    plLock = true; right(); b.classList.add('good');
    talk([rnd(CHEERS), ok]);
    plIdx++; drawProg($('plProg'), PL_TOTAL, plIdx);
    setTimeout(() => (plIdx >= PL_TOTAL ? win('plural', () => initPlural()) : nextPlural()), 2300);
  } else {
    wrong(b);
    hint([L.mmm, t, L.notGood]);
  }
}

/* ============ 7. Detective Lola (listening: Lola says it, that is the game) ============ */
let deList = [], deIdx = 0, deLock = false; const DE_TOTAL = 8;
function initDetective(p) {
  round();
  deList = shuffle(pick(DE_TOTAL).map((n, i) => {
    const pl = Math.random() < 0.5, ok = artOf(n, pl);
    const bad = i % 2 === 0; const said = bad ? rnd(ARTS.filter((a) => a !== ok)) : ok;
    return { n, pl, said, bad };
  }));
  deIdx = 0;
  $('deYes').onclick = () => pickDet(false); $('deNo').onclick = () => pickDet(true);
  nextDet(p);
}
function nextDet(p) {
  deLock = false; drawProg($('deProg'), DE_TOTAL, deIdx);
  const d = deList[deIdx], said = C(d.said, wordOf(d.n, d.pl));
  $('dePic').textContent = picOf(d.n, d.pl);
  $('deTxt').textContent = said; $('deTxt').style.color = '';
  $('deTxt').onclick = () => say(said);
  $('deOpts').style.display = 'flex'; $('deFix').style.display = 'none';
  later(p, [said, L.saidRight]);
}
function detNext() {
  deIdx++; drawProg($('deProg'), DE_TOTAL, deIdx);
  setTimeout(() => (deIdx >= DE_TOTAL ? win('detective', () => initDetective()) : nextDet()), 2500);
}
function pickDet(saysBad) {
  if (deLock) return;
  const d = deList[deIdx], ok = phrase(d.n, d.pl), said = C(d.said, wordOf(d.n, d.pl));
  if (saysBad === d.bad) {
    deLock = true; right();
    if (d.bad) { // now let them fix it
      talk(L.caught);
      $('deOpts').style.display = 'none'; const box = $('deFix'); box.innerHTML = ''; box.style.display = 'flex';
      ARTS.forEach((a) => {
        const b = artBtn(a);
        b.onclick = () => {
          if (a === artOf(d.n, d.pl)) {
            ding(); b.classList.add('good'); $('deTxt').textContent = ok; $('deTxt').style.color = '#16a34a';
            box.querySelectorAll('button').forEach((x) => (x.onclick = null));
            talk([L.thatsIt, ok]); detNext();
          } else {
            wrong(b);
            talk([C(a, wordOf(d.n, d.pl)), L.notThat]);
          }
        };
        box.appendChild(b);
      });
    } else { talk([L.yesRight, ok]); detNext(); }
  } else {
    wrong();
    if (d.bad) talk([L.listenAgain, said, L.sure]);
    else { talk([L.iThinkRight, ok, L.listen]); deLock = true; detNext(); }
  }
}

/* ============ 8. Sentences (reading) ============ */
let snList = [], snIdx = 0, snLock = false; const SN_TOTAL = 6;
function initSentence() {
  round();
  const t = shuffle(SENT);
  snList = pick(SN_TOTAL).map((n, i) => ({ n, pl: Math.random() < 0.5, t: t[i % t.length] }));
  snIdx = 0; nextSentence();
}
const sentStart = (s) => (s.pl && s.t.ap ? s.t.ap : s.t.a);
function nextSentence() {
  snLock = false; drawProg($('snProg'), SN_TOTAL, snIdx);
  const s = snList[snIdx];
  ask([sentStart(s), wordOf(s.n, s.pl), L.missing]);
  $('snPic').textContent = picOf(s.n, s.pl); $('snPic').onclick = helpTap(wordOf(s.n, s.pl));
  $('snTxt').innerHTML = `${sentStart(s)} <span class="blank" id="snBlank">__</span> ${wordOf(s.n, s.pl)}${s.t.b}`;
  $('snTxt').onclick = helpTap([sentStart(s), wordOf(s.n, s.pl)]);
  const box = $('snOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickSentence(b, s); box.appendChild(b); });
}
function pickSentence(b, s) {
  if (snLock) return;
  const ok = artOf(s.n, s.pl);
  if (b.dataset.a === ok) {
    snLock = true; right(); b.classList.add('good');
    const bl = $('snBlank'); bl.textContent = ok; bl.className = 'blank filled bg-' + ok;
    const c = rnd(CHEERS);
    talk([c, sentStart(s), phrase(s.n, s.pl)], `${c} ${sentStart(s)} ${phrase(s.n, s.pl)}${s.t.b}`);
    snIdx++; drawProg($('snProg'), SN_TOTAL, snIdx);
    setTimeout(() => (snIdx >= SN_TOTAL ? win('sentence', () => initSentence()) : nextSentence()), 2800);
  } else {
    wrong(b);
    const a = b.dataset.a;
    if (isPl(a) !== s.pl) hint(s.pl ? L.lookMany : L.lookOne);
    else hint([L.readWith, a, L.soundsGood]);
  }
}

/* ============ 9. The unicorn and its friends (reading) ============ */
let unIdx = 0, unLock = false, unT = null; const UN_TOTAL = 6;
const animalPool = () => NOUNS.filter((n) => ANIMALS.includes(n.s));
const unAsk = (n, pl) => [pl ? WHERE.many : WHERE.one, phrase(n, pl)];
const unAskTxt = (n, pl) => `${pl ? WHERE.many : WHERE.one} ${phrase(n, pl)}?`;
function initUnicorn() {
  round();
  unIdx = 0; for (let i = 0; i < 6; i++) $('rb' + i).classList.remove('on');
  $('uniSvg').classList.remove('fly'); nextUnicorn();
}
function nextUnicorn() {
  unLock = false; drawProg($('unProg'), UN_TOTAL, unIdx);
  const pool = shuffle(animalPool()), n = pool[0], o = pool[1], pl = Math.random() < 0.5;
  unT = { n, pl };
  ask([L.uniAsks, ...unAsk(n, pl)]);
  $('unTxt').innerHTML = (pl ? WHERE.many : WHERE.one) + ` <span class="hlart bg-${artOf(n, pl)}">${artOf(n, pl)}</span> ${wordOf(n, pl)}?`;
  $('unTxt').onclick = helpTap(unAsk(n, pl));
  const box = $('unPics'); box.innerHTML = '';
  shuffle([{ n, pl }, { n, pl: !pl }, { n: o, pl }, { n: o, pl: !pl }]).forEach((x) => {
    const b = document.createElement('button'); b.className = 'pic'; b.textContent = picOf(x.n, x.pl);
    b.onclick = () => pickUnicorn(b, x); box.appendChild(b);
  });
}
function pickUnicorn(b, x) {
  if (unLock) return;
  const t = unT;
  if (x.n === t.n && x.pl === t.pl) {
    unLock = true; right(); b.classList.add('good');
    const u = $('uniSvg'); u.classList.remove('hop'); void u.offsetWidth; u.classList.add('hop');
    $('rb' + unIdx).classList.add('on');
    talk([rnd(CHEERS), t.pl ? L.hereAre : L.hereIs, phrase(t.n, t.pl)]);
    unIdx++; drawProg($('unProg'), UN_TOTAL, unIdx);
    if (unIdx >= UN_TOTAL) {
      setTimeout(() => { $('uniSvg').classList.add('fly'); tone([523, 659, 784, 988, 1175], 0.12); }, 900);
      setTimeout(() => win('unicorn', () => initUnicorn()), 3200);
    } else setTimeout(nextUnicorn, 2400);
  } else {
    wrong(b);
    // the hint does not read the question: if they need it, help() reads it after 2 mistakes
    if (x.n === t.n) hint(x.pl ? L.lookMany : L.lookOne);
    else hint([L.thatOne, phrase(x.n, x.pl)]);
  }
}

/* ============ 10. My body (reading) ============ */
let boList = [], boIdx = 0, boLock = false; const BO_TOTAL = 8;
function drawRings(part, cls) {
  const g = $('rings');
  part.r.forEach(([cx, cy, r]) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r); c.setAttribute('class', cls); g.appendChild(c);
  });
}
function initBody() { round(); boList = shuffle(BODY).slice(0, BO_TOTAL); boIdx = 0; $('rings').innerHTML = ''; nextBody(); }
function nextBody() {
  boLock = false; drawProg($('boProg'), BO_TOTAL, boIdx);
  const part = boList[boIdx];
  ask([L.glows, part.s, L.whichArt]);
  $('rings').querySelectorAll('.ring').forEach((x) => x.remove());
  drawRings(part, 'ring');
  $('boWord').textContent = part.s; const bl = $('boBlank'); bl.className = 'blank'; bl.textContent = '__';
  $('boWord').onclick = helpTap(part.s);
  const box = $('boOpts'); box.innerHTML = '';
  ARTS.forEach((a) => { const b = artBtn(a); b.onclick = () => pickBody(b, part); box.appendChild(b); });
}
function pickBody(b, part) {
  if (boLock) return;
  const ok = C(part.a, part.s);
  if (b.dataset.a === part.a) {
    boLock = true; right(); b.classList.add('good');
    const bl = $('boBlank'); bl.textContent = part.a; bl.className = 'blank filled bg-' + part.a;
    $('rings').querySelectorAll('.ring').forEach((x) => x.remove()); drawRings(part, 'ringok');
    talk([rnd(CHEERS), ok, ...K.touch(part)]);
    boIdx++; drawProg($('boProg'), BO_TOTAL, boIdx);
    setTimeout(() => (boIdx >= BO_TOTAL ? win('body', () => initBody()) : nextBody()), 3000);
  } else {
    wrong(b);
    const pl = isPl(part.a);
    if (isPl(b.dataset.a) !== pl) hint(pl ? L.glowTwo : L.glowOne);
    else hint([L.almost, C(b.dataset.a, part.s), L.sayAloud]);
  }
}

/* ============ start: the browser only lets us talk after the first tap ============ */
show(screenFromUrl());
lastSegs = L.hello;
preload(LANG, [L.hello, ...Object.values(L.intros)]);
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

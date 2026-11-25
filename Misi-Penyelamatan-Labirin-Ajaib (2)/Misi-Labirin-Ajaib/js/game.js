/* GAME UTAMA - Misi Penyelamatan di Labirin Ajaib */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const T = 32, MOVE_MS = 170;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const { R, D } = Art;

const THEMES = [
  { grass: '#7bc067', sand: '#f3dfae', bushD: '#2f7d3a', bushM: '#4aa14b', bushL: '#7fd36b', berry: '#e8503a' },
  { grass: '#c9b35a', sand: '#f0d2a0', bushD: '#9a4a1f', bushM: '#d0702a', bushL: '#f2a548', berry: '#8b2e2e' }
];
const LEVELS = [
  { title: 'Level 1', name: 'Labirin Sahabat Hewan', theme: 0, map: LEVEL_MAPS[0],
    plan: () => shuffle(['hewan', 'bentuk']),
    intro: 'Bantu Momo si monyet mencari ruangan kelinci. Dekati pintu terkunci, lalu jawab pertanyaan ya!',
    win: 'Kamu berhasil menyelamatkan kelinci!' },
  { title: 'Level 2', name: 'Labirin Tantangan Logika', theme: 1, map: LEVEL_MAPS[1],
    plan: () => shuffle(['pola', 'hitung', Math.random() < .5 ? 'pola' : 'hitung']),
    intro: 'Labirinnya lebih luas! Cari pintu yang benar, lalu selesaikan semua teka-teki.',
    win: 'Hebat! Semua tantangan selesai. Jalan menuju Monster Penjaga terbuka!' },
  { title: 'Level 3', name: 'Gelembung Angka', boss: true,
    intro: 'Monster Penjaga menghadang! Jawab soal tambah-tambahan. Ketuk gelembung yang berisi jawabannya.',
    win: 'Selamat! Kamu berhasil menyelesaikan permainan!' }
];

const cv = $('#cv'), ctx = cv.getContext('2d');
const S = { lv: 0, mode: 'title', stack: [], mist: 0, open: false, moving: false, x: 0, y: 0, tx: 0, ty: 0, t: 0, dir: 'down', pause: false, sc: null, items: [], cage: false, time: 0 };

/* ---------- Tampilan umum ---------- */
function modal(html, cls) { const p = $('#panel'); p.innerHTML = `<div class="scrim"><div class="card ${cls || ''}">${html}</div></div>`; p.hidden = false; return p.firstChild.firstChild; }
function closeModal() { const p = $('#panel'); p.hidden = true; p.innerHTML = ''; S.sc = null; }
function go(fn) { const f = $('#fade'); f.classList.add('on'); setTimeout(() => { fn(); setTimeout(() => f.classList.remove('on'), 200); }, 580); }
let toastT; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3500); }
function btn(label, fn, cls) { const b = document.createElement('button'); b.className = 'btn ' + (cls || ''); b.textContent = label; b.onclick = () => { Snd.sfx('click'); fn(b); }; return b; }
const speakBtn = (text) => btn('Dengarkan lagi', () => Say(text), 'small alt');

/* ---------- Adegan animasi kecil di dalam kartu ---------- */
let sceneBG;
function makeSceneBG() {
  if (sceneBG) return sceneBG;
  sceneBG = Art.mk(192, 112, x => {
    R(x, 0, 0, 192, 112, '#9ad27f');
    for (let i = 0; i < 90; i++) R(x, (i * 53) % 192, (i * 37) % 112, 2, 2, i % 3 ? '#86c46c' : '#b4e39b');
    for (let i = 0; i < 12; i++) { const fx = (i * 41 + 13) % 180, fy = (i * 29 + 20) % 100; R(x, fx, fy, 3, 3, i % 2 ? '#fff' : '#ffd84a'); R(x, fx + 1, fy + 1, 1, 1, '#e8503a'); }
    R(x, 0, 0, 192, 10, '#2f7d3a'); R(x, 0, 102, 192, 10, '#2f7d3a');
    for (let i = 0; i < 14; i++) { D(x, i * 15, 6, 8, '#4aa14b'); D(x, i * 15 + 3, 104, 8, '#4aa14b'); D(x, i * 15 - 2, 3, 4, '#7fd36b'); }
  });
  return sceneBG;
}
function scene(canvas, items, cage) { S.sc = canvas; S.items = items; S.cage = !!cage; }
function drawScene() {
  const c = S.sc; if (!c || !c.isConnected) return;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(makeSceneBG(), 0, 0);
  const f = Math.floor(S.time / 300) % 2;
  S.items.forEach((it, i) => {
    const y = it.y + Math.sin(S.time / 260 + i) * 3;
    const img = it.k === 'm' ? Art.monkey('down', f) : it.k === 'r' ? Art.rabbit(f) : it.k === 'b' ? Art.monster(it.e || 'normal') : it.k === 'd' ? Art.door(false) : Art.base(it.k);
    x.drawImage(img, it.x, y, it.s, it.s);
  });
  if (S.cage) { const r = S.items.find(i => i.k === 'r'); if (r) { x.fillStyle = '#8a9096'; for (let i = 0; i <= 5; i++) x.fillRect(r.x + 2 + i * (r.s - 6) / 5, r.y - 4, 3, r.s + 6); x.fillRect(r.x, r.y - 4, r.s, 3); x.fillRect(r.x, r.y + r.s - 2, r.s, 3); } }
}
const sceneCanvas = () => '<canvas class="sc" width="192" height="112"></canvas>';

/* ---------- Layar judul & prolog ---------- */
function showTitle() {
  S.mode = 'title'; $('#app').classList.remove('boss'); $('#lvl').textContent = 'Misi Penyelamatan di Labirin Ajaib';
  const c = modal(`<h1>Misi Penyelamatan<br>di Labirin Ajaib</h1>${sceneCanvas()}<div class="act"></div>`);
  scene(c.querySelector('canvas'), [{ k: 'm', x: 64, y: 24, s: 64 }, { k: 'r', x: 124, y: 40, s: 44 }]);
  c.querySelector('.act').appendChild(btn('MULAI', () => { Snd.init(); Snd.music(true); go(() => showPrologue(0)); }, 'big'));
}
const PROLOG = [
  { t: 'Halo! Aku Momo si monyet. Aku suka berpetualang!', items: [{ k: 'm', x: 64, y: 26, s: 72 }] },
  { t: 'Oh tidak! Kelinci kecil terjebak di dalam Labirin Ajaib. Dia butuh pertolongan!', items: [{ k: 'r', x: 70, y: 30, s: 60 }], cage: true },
  { t: 'Misimu: cari pintu terkunci, lalu jawab pertanyaan dengan benar!', items: [{ k: 'm', x: 30, y: 30, s: 64 }, { k: 'd', x: 112, y: 26, s: 64 }] },
  { t: 'Ayo bantu Momo menyelamatkan kelinci. Kamu pasti bisa!', items: [{ k: 'm', x: 38, y: 30, s: 60 }, { k: 'r', x: 100, y: 34, s: 52 }] }
];
function showPrologue(i) {
  S.mode = 'prolog'; const p = PROLOG[i];
  const c = modal(`<h2>Cerita Petualangan ${i + 1}/${PROLOG.length}</h2>${sceneCanvas()}<p></p><div class="act"></div>`);
  c.querySelector('p').textContent = p.t; scene(c.querySelector('canvas'), p.items, p.cage);
  const a = c.querySelector('.act'); a.appendChild(speakBtn(p.t));
  if (i > 0) a.appendChild(btn('Kembali', () => showPrologue(i - 1), 'small alt'));
  a.appendChild(i < PROLOG.length - 1 ? btn('Lanjut', () => showPrologue(i + 1)) : btn('Mulai Petualangan', () => go(() => startLevel(0))));
  setTimeout(() => Say(p.t), 500);
}

/* ---------- Level labirin ---------- */
function buildBG(L) {
  const th = THEMES[L.theme], c = document.createElement('canvas'); c.width = S.cols * T; c.height = S.rows * T;
  const x = c.getContext('2d'); let s = 11 + L.theme * 17; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let ty = 0; ty < S.rows; ty++) for (let tx = 0; tx < S.cols; tx++) {
    const ox = tx * T, oy = ty * T;
    if (S.map[ty][tx] === '#') {
      R(x, ox, oy, T, T, th.grass); D(x, ox + 16, oy + 17, 14, th.bushD); D(x, ox + 16, oy + 15, 12, th.bushM);
      for (let k = 0; k < 3; k++) D(x, ox + 8 + (rnd() * 16 | 0), oy + 8 + (rnd() * 14 | 0), 4, th.bushL);
      for (let k = 0; k < 2; k++) R(x, ox + 6 + (rnd() * 20 | 0), oy + 6 + (rnd() * 20 | 0), 3, 3, th.berry);
    } else {
      R(x, ox, oy, T, T, th.sand);
      for (let k = 0; k < 7; k++) R(x, ox + (rnd() * 30 | 0), oy + (rnd() * 30 | 0), 2, 2, 'rgba(160,110,50,.22)');
      if (S.map[ty - 1] && S.map[ty - 1][tx] === '#') R(x, ox, oy, T, 3, 'rgba(0,0,0,.10)');
    }
  }
  return c;
}
function loadLevel(i) {
  S.lv = i; S.mist = 0; const L = LEVELS[i]; $('#lvl').textContent = `${L.title} · ${L.name}`;
  S.stack = []; closeModal();
  if (L.boss) { $('#app').classList.add('boss'); buildArena(); return; }
  $('#app').classList.remove('boss');
  S.map = L.map.map(r => r.split('')); S.rows = S.map.length; S.cols = S.map[0].length;
  S.map.forEach((r, y) => r.forEach((ch, x) => { if (ch === 'P') { S.x = x; S.y = y; S.map[y][x] = '.'; } }));
  S.tx = S.x; S.ty = S.y; S.moving = false; S.open = false; S.dir = 'down';
  cv.width = S.cols * T; cv.height = S.rows * T; ctx.imageSmoothingEnabled = false; S.bg = buildBG(L); fit();
}
function startLevel(i) {
  loadLevel(i); S.mode = 'modal'; const L = LEVELS[i];
  const c = modal(`<h2>${L.title}</h2><h1>${L.name}</h1>${sceneCanvas()}<p></p><div class="act"></div>`);
  c.querySelector('p').textContent = L.intro;
  scene(c.querySelector('canvas'), L.boss ? [{ k: 'b', x: 56, y: 14, s: 84 }] : [{ k: 'm', x: 64, y: 26, s: 70 }]);
  const a = c.querySelector('.act'); a.appendChild(speakBtn(L.title + '. ' + L.name + '. ' + L.intro));
  a.appendChild(btn('Mulai', () => { closeModal(); if (L.boss) { S.mode = 'boss'; battleStart(); } else { S.mode = 'play'; toast('Gunakan tombol arah (atau panah / WASD)'); } }));
  setTimeout(() => Say(L.title + '. ' + L.name + '. ' + L.intro), 600);
}
function fit() {
  const st = $('#stage'); if (!S.cols) return; const w = st.clientWidth - 14, h = st.clientHeight - 14;
  const sc = Math.min(w / cv.width, h / cv.height); cv.style.width = Math.floor(cv.width * sc) + 'px'; cv.style.height = Math.floor(cv.height * sc) + 'px';
}
addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 200));

/* ---------- Kontrol ---------- */
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
const press = d => { S.stack = S.stack.filter(k => k !== d); S.stack.push(d); };
const release = d => { S.stack = S.stack.filter(k => k !== d); };
addEventListener('keydown', e => { const d = KEYMAP[e.key]; if (d) { e.preventDefault(); if (!e.repeat) press(d); } });
addEventListener('keyup', e => { const d = KEYMAP[e.key]; if (d) release(d); });
addEventListener('blur', () => { S.stack = []; });
document.querySelectorAll('.dp').forEach(b => {
  const d = b.dataset.d;
  b.addEventListener('pointerdown', e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (x) {} press(d); b.classList.add('on'); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, () => { release(d); b.classList.remove('on'); }));
  b.addEventListener('contextmenu', e => e.preventDefault());
});
document.addEventListener('touchmove', e => { if (!e.target.closest('.card,#arena')) e.preventDefault(); }, { passive: false });
document.addEventListener('contextmenu', e => e.preventDefault());

/* ---------- Gerakan & tabrakan ---------- */
const tile = (x, y) => S.map[y] && S.map[y][x];
function tryMove(d) {
  S.dir = d; const [dx, dy] = DIRS[d], nx = S.x + dx, ny = S.y + dy, c = tile(nx, ny);
  if (c === undefined || c === '#') return;
  if (c === 'D' && !S.open) { openQuiz(); return; }
  if (c === 'R' && !S.open) return;
  S.tx = nx; S.ty = ny; S.t = 0; S.moving = true; Snd.sfx('step');
}
function update(dt) {
  if (S.mode !== 'play' || S.pause) return;
  if (S.moving) { S.t += dt / MOVE_MS; if (S.t >= 1) { S.x = S.tx; S.y = S.ty; S.moving = false; S.t = 0; if (tile(S.x, S.y) === 'R') arrivedGoal(); } }
  if (!S.moving && S.mode === 'play' && S.stack.length) tryMove(S.stack[S.stack.length - 1]);
}
function render() {
  if (!S.bg || S.mode === 'boss') return;
  const L = LEVELS[S.lv]; ctx.drawImage(S.bg, 0, 0);
  S.map.forEach((r, y) => r.forEach((ch, x) => {
    if (ch === 'D') { ctx.drawImage(Art.door(S.open), x * T, y * T); if (!S.open) { ctx.strokeStyle = `rgba(255,216,74,${.4 + .4 * Math.sin(S.time / 250)})`; ctx.lineWidth = 3; ctx.strokeRect(x * T + 1, y * T + 1, T - 2, T - 2); } }
    if (ch === 'R') {
      if (S.lv === 0) { const by = S.open ? Math.abs(Math.sin(S.time / 220)) * -4 : 0; ctx.drawImage(Art.rabbit(Math.floor(S.time / 300) % 2), x * T, y * T + by, T, T);
        if (!S.open) { ctx.fillStyle = '#8a9096'; for (let i = 0; i <= 5; i++) ctx.fillRect(x * T + 2 + i * 5, y * T + 1, 2, T - 2); ctx.fillRect(x * T + 1, y * T + 1, T - 2, 2); ctx.fillRect(x * T + 1, y * T + T - 3, T - 2, 2); } }
      else { ctx.globalAlpha = .6 + .4 * Math.sin(S.time / 300); ctx.drawImage(Art.gate(), x * T, y * T); ctx.globalAlpha = 1; }
    }
  }));
  const k = S.moving ? Math.min(S.t, 1) : 0, px = (S.x + (S.tx - S.x) * k) * T, py = (S.y + (S.ty - S.y) * k) * T;
  const spr = Art.monkey(S.dir === 'left' ? 'right' : S.dir, S.moving && S.t > .5 ? 1 : 0);
  ctx.save(); if (S.dir === 'left') { ctx.translate(px + T, py); ctx.scale(-1, 1); ctx.drawImage(spr, 0, 0, T, T); } else ctx.drawImage(spr, px, py, T, T); ctx.restore();
}
let last = 0;
function loop(t) { const dt = Math.min(50, t - last); last = t; S.time = t; update(dt); render(); drawScene(); requestAnimationFrame(loop); }

/* ---------- Kuis ---------- */
function choiceBtn(v) {
  const b = document.createElement('button'); b.className = 'choice'; b.dataset.v = v;
  if (Art.draw[v]) { b.appendChild(Art.icon(v, 72)); const s = document.createElement('small'); s.textContent = Art.LABEL[v]; b.appendChild(s); } else b.textContent = v;
  return b;
}
function renderVisual(el, v) {
  if (!v) return;
  const apples = (n, size) => { const g = document.createElement('div'); g.className = 'group'; for (let i = 0; i < n; i++) g.appendChild(Art.icon('apel', size)); return g; };
  if (v.type === 'seq') { v.seq.forEach(c => el.appendChild(Art.icon(c, 46))); const q = document.createElement('div'); q.className = 'qm'; q.textContent = '?'; el.appendChild(q); }
  if (v.type === 'apples') el.appendChild(apples(v.n, 64));
  if (v.type === 'sum') { const op = t => { const s = document.createElement('span'); s.className = 'op'; s.textContent = t; return s; };
    el.append(apples(v.a, 44), op('+'), apples(v.b, 44), op('= ?')); }
}
function openQuiz() {
  S.mode = 'quiz'; S.stack = []; Snd.sfx('click');
  const plan = LEVELS[S.lv].plan(), used = new Set();
  runQuiz(plan, 0, used);
}
function runQuiz(plan, i, used) {
  const q = makeQuestion(plan[i], used);
  const c = modal(`<div class="qhead"><b>Soal ${i + 1} dari ${plan.length}</b><span class="spkh"></span></div><p class="qtext"></p><div class="qvis"></div><div class="choices"></div><div class="fb"></div><div class="act"></div>`, 'quiz');
  c.querySelector('.qtext').textContent = q.text; c.querySelector('.spkh').appendChild(speakBtn(q.text));
  renderVisual(c.querySelector('.qvis'), q.visual);
  const ch = c.querySelector('.choices'), fb = c.querySelector('.fb'), act = c.querySelector('.act'); let done = false;
  q.choices.forEach(v => ch.appendChild(choiceBtn(v)));
  ch.onclick = e => {
    const b = e.target.closest('.choice'); if (!b || done) return;
    if (b.dataset.v === q.answer) {
      done = true; b.classList.add('ok'); Snd.sfx('correct'); fb.className = 'fb'; fb.textContent = 'Hebat sekali! Jawabanmu benar!'; Say('Hebat sekali! Jawabanmu benar!');
      const last = i === plan.length - 1;
      setTimeout(() => act.appendChild(last ? btn('Buka Pintu', () => { closeModal(); openDoor(); }) : btn('Lanjut', () => runQuiz(plan, i + 1, used))), 900);
    } else {
      S.mist++; b.classList.add('no'); Snd.sfx('wrong'); fb.className = 'fb bad'; fb.textContent = 'Coba lagi ya!'; Say('Coba lagi ya!');
      setTimeout(() => b.classList.remove('no'), 600);
    }
  };
  setTimeout(() => Say(q.text), 450);
}
function openDoor() {
  S.open = true; Snd.sfx('door'); toast('Pintu terbuka! Ayo masuk!'); Say('Pintu terbuka! Ayo masuk!');
  setTimeout(() => { if (S.mode === 'quiz') S.mode = 'play'; }, 900);
}

/* ---------- Hadiah bintang ---------- */
const starsFor = m => m === 0 ? 3 : m <= 2 ? 2 : 1;
function reward(title, label, next, items) {
  S.mode = 'modal'; S.stack = []; const n = starsFor(S.mist);
  const star = i => `<svg class="star ${i < n ? 'on' : ''}" style="animation-delay:${.6 + i * .8}s" viewBox="0 0 24 24"><polygon points="12,1.5 15.2,8.3 22.5,9.1 17,14.1 18.6,21.5 12,17.7 5.4,21.5 7,14.1 1.5,9.1 8.8,8.3"/></svg>`;
  const c = modal(`<h2>${title}</h2>${sceneCanvas()}<div class="stars">${[0, 1, 2].map(star).join('')}</div><p>${n === 3 ? 'Sempurna! Tiga bintang!' : n === 2 ? 'Bagus! Dua bintang!' : 'Kamu hebat! Satu bintang!'}</p><div class="act"></div>`, 'reward');
  scene(c.querySelector('canvas'), items);
  Snd.sfx('win'); Say(title);
  for (let i = 0; i < n; i++) setTimeout(() => Snd.sfx('star'), 700 + i * 800);
  const b = btn(label, () => go(next)); b.disabled = true; c.querySelector('.act').appendChild(b);
  setTimeout(() => { b.disabled = false; }, 2000 + n * 600); // mencegah terlewat tidak sengaja
}
function arrivedGoal() {
  S.mode = 'modal'; const L = LEVELS[S.lv]; Snd.sfx('rescue');
  if (S.lv === 0) reward(L.win, 'Lanjut ke Level 2', () => startLevel(1), [{ k: 'm', x: 36, y: 30, s: 64 }, { k: 'r', x: 100, y: 34, s: 56 }]);
  else reward(L.win, 'Lanjut ke Level 3', () => startLevel(2), [{ k: 'm', x: 64, y: 30, s: 64 }, { k: 'd', x: 118, y: 30, s: 60 }]);
}

/* ---------- Level 3: Gelembung Angka ---------- */
const B = { hp: 0, max: 4, q: null, lock: false, used: new Set() };
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/></svg>';
function buildArena() {
  $('#arena').innerHTML = `<div class="hp" id="hp"></div><div class="mwrap"><canvas id="mon" width="32" height="32"></canvas><div class="msp" id="msp"></div></div>
  <div class="qbox"><p id="bq"></p><div class="qvis" id="bvis"></div><span id="bspk"></span></div><div id="bubbles"></div><div id="bact"></div>`;
  drawMon('normal'); B.hp = B.max; renderHP();
}
function drawMon(ex) { const m = $('#mon'); const x = m.getContext('2d'); x.clearRect(0, 0, 32, 32); x.drawImage(Art.monster(ex), 0, 0); }
function renderHP() { $('#hp').innerHTML = Array.from({ length: B.max }, (_, i) => `<span>${HEART.replace('<svg', i < B.hp ? '<svg' : '<svg class="off"')}</span>`).join(''); }
function battleStart() { B.used = new Set(); B.hp = B.max; S.mist = 0; drawMon('normal'); renderHP(); nextProblem(); Snd.sfx('monster'); }
function nextProblem() {
  B.lock = false; const q = makeQuestion('tambah', B.used); B.q = q; $('#bact').innerHTML = ''; $('#msp').classList.remove('on'); drawMon('normal');
  $('#bq').textContent = q.text; const v = $('#bvis'); v.innerHTML = ''; renderVisual(v, q.visual);
  const sp = $('#bspk'); sp.innerHTML = ''; sp.appendChild(speakBtn(q.text));
  const slots = shuffle([2, 22, 42, 60, 78]), bs = $('#bubbles'); bs.innerHTML = '';
  q.choices.forEach((val, i) => {
    const b = document.createElement('button'); b.className = 'bub'; b.dataset.v = val; b.style.left = `${slots[i]}%`; b.style.top = (Math.random() * 45 | 0) + '%';
    b.innerHTML = `<span class="ball" style="animation-delay:-${(Math.random() * 3).toFixed(2)}s">${val}</span>`; bs.appendChild(b);
  });
  bs.onclick = e => { const b = e.target.closest('.bub'); if (b) pickBubble(b); };
  setTimeout(() => Say(q.text), 500);
}
function pickBubble(b) {
  if (B.lock) return;
  if (b.dataset.v !== B.q.answer) { S.mist++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); Snd.sfx('wrong'); Say('Coba lagi ya!'); return; }
  B.lock = true; Snd.sfx('bubble');
  const m = $('#mon').getBoundingClientRect(), r = b.getBoundingClientRect();
  b.style.transition = 'transform .7s ease-in, opacity .7s'; b.style.transform = `translate(${m.left + m.width / 2 - (r.left + r.width / 2)}px,${m.top + m.height / 2 - (r.top + r.height / 2)}px) scale(.3)`; b.style.opacity = '.3';
  setTimeout(() => {
    b.remove(); B.hp--; renderHP(); drawMon('happy'); const mon = $('#mon'); mon.classList.remove('hit'); void mon.offsetWidth; mon.classList.add('hit'); Snd.sfx('monster');
    const sp = $('#msp'); sp.textContent = B.hp > 0 ? 'Hihi, geli!' : 'Aku kalah, hore!'; sp.classList.add('on');
    if (B.hp > 0) { Say('Hebat sekali! Jawabanmu benar!'); setTimeout(() => $('#bact').appendChild(btn('Lanjut', nextProblem)), 700); }
    else { Say('Hebat! Monster Penjaga sudah kalah!'); setTimeout(defeat, 1300); }
  }, 750);
}
function defeat() {
  $('#mon').classList.remove('hit'); $('#mon').classList.add('poof'); Snd.sfx('win');
  setTimeout(() => {
    S.mode = 'modal'; S.lv = 2;
    reward('Selamat! Kamu berhasil menyelesaikan permainan! Kamu berhasil keluar dari Labirin Ajaib!', 'Main Lagi', showTitle, [{ k: 'm', x: 38, y: 30, s: 60 }, { k: 'r', x: 100, y: 34, s: 52 }]);
  }, 1300);
}

/* ---------- Pengaturan suara ---------- */
function openSettings() {
  S.pause = true; S.stack = []; const p = $('#set');
  p.innerHTML = `<div class="scrim"><div class="card"><h2>Pengaturan Suara</h2><div class="row"><span>Pelan</span><input id="vol" type="range" min="0" max="1" step="0.05"><span>Keras</span></div><div class="row"><button class="btn alt" id="mute"></button></div><div class="act"><button class="btn" id="okset">Selesai</button></div></div></div>`;
  p.hidden = false; const vol = $('#vol'), mute = $('#mute'); vol.value = Snd.vol;
  const lab = () => { mute.textContent = Snd.muted ? 'Nyalakan Suara' : 'Matikan Suara'; };
  lab();
  vol.oninput = () => { Snd.setVol(+vol.value); lab(); };
  vol.onchange = () => Snd.sfx('correct');
  mute.onclick = () => { Snd.setMuted(!Snd.muted); lab(); if (!Snd.muted) Snd.sfx('click'); };
  $('#okset').onclick = () => { p.hidden = true; p.innerHTML = ''; S.pause = false; Snd.sfx('click'); };
}
$('#btnSnd').onclick = () => { Snd.init(); openSettings(); };

/* ---------- Mulai ---------- */
window.__game = { S, LEVELS, startLevel, update, press, release }; // untuk pengujian
showTitle(); requestAnimationFrame(loop);
})();

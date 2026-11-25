/* SENI PIXEL ART ORISINAL - semua digambar lewat kode (tanpa file gambar eksternal). */
const Art = (() => {
  const K = '#3b2a20', W = '#fff8ec', O = '#f2a03d', PK = '#f4a6b0';
  const mk = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; fn(x); return c; };
  const R = (x, a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  const D = (x, cx, cy, r, c) => { x.fillStyle = c; for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + r * .5) x.fillRect(Math.round(cx + i), Math.round(cy + j), 1, 1); };
  const poly = (x, pts, c) => { x.fillStyle = c; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fill(); };
  const eyes = (x, y, a = 8, b = 14) => { R(x, a, y, 2, 3, K); R(x, b, y, 2, 3, K); };
  const ball = (c, h) => x => { D(x, 12, 12, 10, K); D(x, 12, 12, 9, c); D(x, 9, 9, 3, h); };
  const star = () => { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 4.8 : 11, a = -Math.PI / 2 + i * Math.PI / 5; p.push([12 + r * Math.cos(a), 13 + r * Math.sin(a)]); } return p; };

  // Ikon 24x24
  const draw = {
    kucing: x => { poly(x, [[4,9],[5,1],[11,6]], K); poly(x, [[20,9],[19,1],[13,6]], K); poly(x, [[5,8],[6,3],[9,6]], O); poly(x, [[19,8],[18,3],[15,6]], O);
      D(x, 12, 14, 9, K); D(x, 12, 14, 8, O); R(x, 11, 6, 2, 3, '#d9822b'); eyes(x, 12); R(x, 11, 16, 2, 1, PK); R(x, 2, 16, 5, 1, K); R(x, 17, 16, 5, 1, K); R(x, 2, 18, 5, 1, K); R(x, 17, 18, 5, 1, K); R(x, 10, 18, 4, 1, K); },
    anjing: x => { R(x, 1, 5, 6, 12, K); R(x, 17, 5, 6, 12, K); R(x, 2, 6, 4, 10, '#6b4226'); R(x, 18, 6, 4, 10, '#6b4226');
      D(x, 12, 14, 9, K); D(x, 12, 14, 8, '#c58b4e'); D(x, 12, 17, 5, '#f1d3a8'); R(x, 10, 15, 4, 2, K); eyes(x, 10); R(x, 11, 19, 2, 3, PK); },
    ayam: x => { poly(x, [[8,5],[10,0],[12,4],[14,0],[16,5]], '#e03a2e'); D(x, 12, 14, 9, K); D(x, 12, 14, 8, W); eyes(x, 11, 7, 15);
      poly(x, [[9,14],[15,14],[12,19]], O); R(x, 11, 19, 2, 3, '#e03a2e'); },
    sapi: x => { R(x, 3, 2, 4, 6, K); R(x, 17, 2, 4, 6, K); R(x, 4, 3, 2, 4, '#e8c79a'); R(x, 18, 3, 2, 4, '#e8c79a');
      D(x, 12, 14, 9, K); D(x, 12, 14, 8, W); R(x, 4, 8, 5, 4, K); R(x, 16, 12, 4, 4, K); R(x, 5, 15, 14, 7, K); R(x, 6, 16, 12, 5, PK); R(x, 9, 18, 2, 2, K); R(x, 13, 18, 2, 2, K); eyes(x, 11, 7, 15); },
    bebek: x => { D(x, 12, 16, 8, K); D(x, 12, 16, 7, '#ffd84a'); D(x, 11, 8, 6, K); D(x, 11, 8, 5, '#ffd84a'); R(x, 14, 8, 9, 4, K); R(x, 14, 8, 8, 3, '#f08a24'); R(x, 8, 6, 2, 2, K); R(x, 5, 15, 6, 4, '#f2c12e'); },
    lingkaran: ball('#3b8fd9', '#8cc7f5'),
    segitiga: x => { poly(x, [[12,1],[23,22],[1,22]], K); poly(x, [[12,6],[19.5,20],[4.5,20]], '#3cb34a'); poly(x, [[12,8],[14,13],[10,13]], '#9be39a'); },
    persegi: x => { R(x, 2, 2, 20, 20, K); R(x, 3, 3, 18, 18, '#e8503a'); R(x, 5, 5, 5, 5, '#f58a7a'); },
    bintang: x => { poly(x, star(), K); x.save(); x.translate(12, 13); x.scale(.82, .82); x.translate(-12, -13); poly(x, star(), '#ffd84a'); x.restore(); },
    merah: ball('#e03a2e', '#f58a7a'), biru: ball('#3b8fd9', '#8cc7f5'), kuning: ball('#ffd84a', '#fff4b0'), hijau: ball('#3cb34a', '#9be39a'),
    // Apel realistis bergaya pixel: gradasi merah, tangkai, daun, kilau & bayangan
    apel: x => {
      R(x, 5, 22, 14, 1, 'rgba(60,35,15,.28)'); R(x, 7, 23, 10, 1, 'rgba(60,35,15,.18)');
      D(x, 8, 13, 6, '#6e0f12'); D(x, 16, 13, 6, '#6e0f12'); D(x, 12, 16, 7, '#6e0f12'); D(x, 12, 12, 8, '#6e0f12'); // siluet gelap
      D(x, 8, 12, 5, '#b8161c'); D(x, 16, 12, 5, '#b8161c'); D(x, 12, 15, 6, '#b8161c'); D(x, 12, 11, 7, '#b8161c');   // merah tua
      D(x, 8, 11, 4, '#dc2f2f'); D(x, 15, 11, 3, '#d42a2a'); D(x, 11, 14, 4, '#dc2f2f');                                // merah tengah
      D(x, 7, 9, 2, '#f0624e'); R(x, 5, 8, 2, 3, '#ffb4a3'); R(x, 6, 7, 1, 1, '#ffffff');                               // cahaya
      R(x, 11, 5, 2, 2, '#6e0f12'); R(x, 11, 2, 2, 5, '#6b4226'); R(x, 11, 2, 1, 4, '#8a5a30');                         // cekungan & tangkai
      poly(x, [[13, 4], [19, 2], [21, 5], [16, 7]], '#2e8b3a'); poly(x, [[13.5, 4.3], [18.5, 3], [19.5, 4.5], [15.5, 6]], '#58c05a'); R(x, 14, 4, 5, 1, '#2e8b3a'); },
    kunci: x => { D(x, 12, 8, 6, '#c9971c'); D(x, 12, 8, 4, '#f4c542'); D(x, 12, 8, 2, '#7a4a21'); R(x, 11, 13, 3, 9, '#c9971c'); R(x, 14, 18, 3, 2, '#c9971c'); R(x, 14, 21, 2, 1, '#c9971c'); }
  };
  const LABEL = { kucing: 'Kucing', anjing: 'Anjing', ayam: 'Ayam', sapi: 'Sapi', bebek: 'Bebek', lingkaran: 'Lingkaran', segitiga: 'Segitiga', persegi: 'Persegi', bintang: 'Bintang', merah: 'Merah', biru: 'Biru', kuning: 'Kuning', hijau: 'Hijau' };
  const cache = {};
  const base = n => cache[n] || (cache[n] = mk(24, 24, draw[n]));
  const icon = (n, size) => { const c = document.createElement('canvas'); c.width = c.height = 24; c.className = 'ico'; c.style.width = c.style.height = size + 'px'; c.getContext('2d').drawImage(base(n), 0, 0); return c; };

  // Karakter 16x16
  const monkeyCache = {};
  function monkey(dir, f) {
    const key = dir + f; if (monkeyCache[key]) return monkeyCache[key];
    const B = '#8b5a2b', T = '#f0cf9f';
    return monkeyCache[key] = mk(16, 16, x => {
      R(x, 3, 14, 10, 2, 'rgba(0,0,0,.2)');
      const tx = dir === 'left' ? 12 : dir === 'right' ? 2 : 12; R(x, tx, 10, 2, 1, B); R(x, tx + (tx > 6 ? 1 : 0), 8, 1, 3, B); R(x, tx + (tx > 6 ? 0 : 0), 7, 2, 1, B);
      R(x, 5, 9, 6, 4, B); R(x, 6, 10, 4, 3, T);
      R(x, 5, 13, 2, f ? 1 : 2, K); R(x, 9, 13, 2, f ? 2 : 1, K);
      D(x, 3, 6, 2, B); D(x, 13, 6, 2, B); R(x, 2, 6, 2, 2, T); R(x, 12, 6, 2, 2, T);
      R(x, 4, 2, 8, 8, B); R(x, 5, 1, 6, 1, B);
      if (dir !== 'up') {
        const s = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
        R(x, 5 + s, 4, 6, 5, T); R(x, 6 + s, 5, 1, 2, K); R(x, 9 + s, 5, 1, 2, K); R(x, 7 + s, 8, 2, 1, K); R(x, 6 + s, 7, 1, 1, PK); R(x, 10 + s, 7, 1, 1, PK);
      }
    });
  }
  const rabbitCache = {};
  function rabbit(f) {
    return rabbitCache[f] || (rabbitCache[f] = mk(16, 16, x => {
      R(x, 3, 14, 10, 2, 'rgba(0,0,0,.2)');
      R(x, 4, 0, 3, 7, K); R(x, 9, 0, 3, 7, K); R(x, 5, 1, 1, 5, PK); R(x, 10, 1, 1, 5, PK); R(x, 4 + f, 0, 3, 1, W);
      R(x, 5, 10, 6, 4, W); R(x, 4, 5, 8, 7, W); R(x, 4, 5, 8, 1, '#ffffff');
      R(x, 5, 7, 1, 2, K); R(x, 10, 7, 1, 2, K); R(x, 7, 9, 2, 1, PK); R(x, 6, 10, 1, 1, K); R(x, 9, 10, 1, 1, K); R(x, 4, 9, 1, 1, PK); R(x, 11, 9, 1, 1, PK);
      R(x, 5, 13, 2, 1, '#e5dccb'); R(x, 9, 13, 2, 1, '#e5dccb');
    }));
  }
  const monCache = {};
  function monster(ex) { // 32x32, ex: 'normal' | 'happy'
    return monCache[ex] || (monCache[ex] = mk(32, 32, x => {
      R(x, 6, 29, 20, 2, 'rgba(0,0,0,.15)');
      R(x, 7, 2, 4, 6, '#d9b25a'); R(x, 21, 2, 4, 6, '#d9b25a'); R(x, 8, 2, 2, 5, '#ffe3a0'); R(x, 22, 2, 2, 5, '#ffe3a0');
      D(x, 16, 18, 13, '#4a3a9e'); D(x, 16, 18, 12, '#8f7ae6'); D(x, 12, 13, 6, '#a99af0'); D(x, 16, 22, 7, '#d8ceff');
      R(x, 8, 28, 6, 3, '#4a3a9e'); R(x, 18, 28, 6, 3, '#4a3a9e');
      D(x, 6, 21, 2, PK); D(x, 26, 21, 2, PK);
      if (ex === 'normal') {
        D(x, 11, 15, 4, K); D(x, 11, 15, 3, W); D(x, 21, 15, 4, K); D(x, 21, 15, 3, W); R(x, 11, 15, 2, 3, K); R(x, 21, 15, 2, 3, K);
        R(x, 12, 23, 8, 1, K); R(x, 11, 22, 1, 1, K); R(x, 20, 22, 1, 1, K);
      } else { // happy / geli
        R(x, 8, 16, 2, 1, K); R(x, 9, 15, 2, 1, K); R(x, 10, 14, 2, 1, K); R(x, 11, 15, 2, 1, K); R(x, 12, 16, 2, 1, K);
        R(x, 18, 16, 2, 1, K); R(x, 19, 15, 2, 1, K); R(x, 20, 14, 2, 1, K); R(x, 21, 15, 2, 1, K); R(x, 22, 16, 2, 1, K);
        R(x, 11, 21, 10, 4, K); R(x, 13, 23, 6, 2, PK); R(x, 10, 20, 1, 1, K); R(x, 21, 20, 1, 1, K);
      }
    }));
  }
  function door(open) {
    return cache['door' + open] || (cache['door' + open] = mk(32, 32, x => {
      if (!open) {
        R(x, 3, 1, 26, 30, '#4a2c12'); R(x, 5, 3, 22, 28, '#8a5628'); for (let i = 0; i < 4; i++) R(x, 5 + i * 6, 3, 1, 28, '#6b4020');
        R(x, 5, 9, 22, 2, '#4a2c12'); R(x, 5, 22, 22, 2, '#4a2c12'); D(x, 16, 17, 5, '#8a6a10'); D(x, 16, 17, 4, '#f4c542'); R(x, 15, 16, 2, 3, K); R(x, 15, 19, 1, 3, K);
      } else {
        R(x, 3, 1, 26, 30, '#4a2c12'); R(x, 5, 3, 22, 28, '#2b1a0d'); R(x, 5, 3, 5, 28, '#8a5628'); R(x, 9, 3, 1, 28, '#4a2c12');
      }
    }));
  }
  function gate() {
    return cache.gate || (cache.gate = mk(32, 32, x => {
      D(x, 16, 16, 14, '#4a3a9e'); D(x, 16, 16, 12, '#8f7ae6'); D(x, 16, 16, 8, '#d8ceff');
      poly(x, star().map(p => [p[0] + 4, p[1] + 3]).map(p => [16 + (p[0] - 16) * .55, 16 + (p[1] - 16) * .55]), '#ffd84a');
    }));
  }
  return { R, D, mk, icon, base, draw, LABEL, monkey, rabbit, monster, door, gate };
})();

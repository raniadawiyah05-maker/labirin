/* =====================================================
   BANK SOAL - edit di sini untuk menambah/mengubah soal
   ===================================================== */
const QUESTION_BANK = {
  // LEVEL 1 - Suara hewan. answer = nama gambar hewan (kucing, anjing, ayam, sapi, bebek)
  hewan: [
    { answer: 'kucing', bunyi: 'meong' },
    { answer: 'anjing', bunyi: 'guk guk' },
    { answer: 'ayam',   bunyi: 'kukuruyuk' },
    { answer: 'sapi',   bunyi: 'moooo' },
    { answer: 'bebek',  bunyi: 'kwek kwek' }
  ],
  // LEVEL 1 - Bentuk geometri (lingkaran, segitiga, persegi, bintang)
  bentuk: [
    { answer: 'lingkaran' }, { answer: 'segitiga' }, { answer: 'persegi' }, { answer: 'bintang' }
  ],
  // LEVEL 2 - Pola warna. seq = pola yang terlihat, answer = warna berikutnya
  // Warna tersedia: merah, biru, kuning, hijau
  pola: [
    { seq: ['merah', 'biru', 'merah'], answer: 'biru' },
    { seq: ['kuning', 'hijau', 'kuning'], answer: 'hijau' },
    { seq: ['biru', 'kuning', 'biru'], answer: 'kuning' },
    { seq: ['hijau', 'merah', 'hijau'], answer: 'merah' },
    { seq: ['merah', 'merah', 'biru', 'merah', 'merah'], answer: 'biru' },
    { seq: ['kuning', 'kuning', 'hijau', 'kuning', 'kuning'], answer: 'hijau' }
  ],
  // LEVEL 2 - Menghitung apel (n = 1 sampai 5)
  hitung: [ { n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 } ],
  // LEVEL 3 - Penjumlahan (jumlah maksimal 10)
  tambah: [
    { a: 1, b: 2 }, { a: 2, b: 2 }, { a: 3, b: 1 }, { a: 2, b: 3 },
    { a: 4, b: 1 }, { a: 3, b: 3 }, { a: 4, b: 3 }, { a: 5, b: 4 }, { a: 5, b: 5 }
  ]
};

/* ---------- Mesin soal (tidak perlu diubah) ---------- */
const KATA_ANGKA = ['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh'];
const WARNA = ['merah', 'biru', 'kuning', 'hijau'];
const _shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* makeQuestion(kategori, used) -> {text, visual, choices[], answer}
   `used` = Set agar soal tidak berulang dalam satu rangkaian. */
function makeQuestion(cat, used) {
  const pool = QUESTION_BANK[cat];
  let fresh = pool.filter((_, i) => !used.has(cat + i));
  if (!fresh.length) { pool.forEach((_, i) => used.delete(cat + i)); fresh = pool.slice(); }
  const item = _shuffle(fresh)[0];
  used.add(cat + pool.indexOf(item));
  let q;
  if (cat === 'hewan' || cat === 'bentuk') {
    const others = _shuffle(pool.map(p => p.answer).filter(a => a !== item.answer)).slice(0, 2);
    q = { text: cat === 'hewan' ? `Hewan apa yang bersuara ${item.bunyi}?` : `Manakah bentuk ${item.answer}?`,
          answer: item.answer, choices: [item.answer, ...others] };
  } else if (cat === 'pola') {
    const others = _shuffle(WARNA.filter(w => w !== item.answer)).slice(0, 2);
    q = { text: 'Lengkapi pola warna ini. Warna apa yang berikutnya?', visual: { type: 'seq', seq: item.seq },
          answer: item.answer, choices: [item.answer, ...others] };
  } else if (cat === 'hitung') {
    const others = _shuffle([1, 2, 3, 4, 5].filter(n => n !== item.n)).slice(0, 2).map(String);
    q = { text: 'Ada berapa apel pada gambar?', visual: { type: 'apples', n: item.n },
          answer: String(item.n), choices: [String(item.n), ...others] };
  } else { // tambah
    const ans = item.a + item.b;
    const others = _shuffle([1,2,3,4,5,6,7,8,9,10].filter(n => n !== ans)).slice(0, 4).map(String);
    q = { text: `${KATA_ANGKA[item.a]} tambah ${KATA_ANGKA[item.b]} sama dengan berapa?`,
          visual: { type: 'sum', a: item.a, b: item.b }, answer: String(ans), choices: [String(ans), ...others] };
  }
  q.choices = _shuffle(q.choices);
  q.cat = cat;
  return q;
}
if (typeof module !== 'undefined') module.exports = { QUESTION_BANK, makeQuestion };

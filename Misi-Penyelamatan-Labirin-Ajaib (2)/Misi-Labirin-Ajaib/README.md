# Misi Penyelamatan di Labirin Ajaib

Game edukatif 2D top-down untuk anak TK A (4-5 tahun). Monyet (Momo) menyelamatkan kelinci di labirin, menjawab kuis, lalu mengalahkan Monster Penjaga dengan Gelembung Angka.

## Teknologi
HTML5 + CSS3 + JavaScript murni (HTML5 Canvas). **Tanpa build, tanpa npm, tanpa server.** Semua gambar dibuat lewat kode (pixel art orisinal) dan semua suara dibuat browser (WebAudio), jadi tidak ada file aset yang bisa rusak atau hilang.

## Struktur Folder
```
index.html          Halaman utama
vercel.json         Pengaturan Vercel
package.json        Penanda proyek (tanpa dependency)
css/style.css       Tampilan, tombol, D-pad, animasi
js/levels.js        Peta labirin Level 1 dan 2  (BISA DIEDIT)
js/questions.js     BANK SOAL                   (BISA DIEDIT)
js/art.js           Gambar pixel art: monyet, kelinci, monster, hewan, bentuk, apel
js/audio.js         Efek suara, musik latar, narasi bahasa Indonesia
js/game.js          Logika game
docs/TUTORIAL.md    Tutorial GitHub + Vercel
```

## Cara Menambah / Mengubah Soal
Buka `js/questions.js`, lihat bagian `QUESTION_BANK`. Contoh menambah soal penjumlahan baru di bagian `tambah`:
`{ a: 2, b: 6 },`  (jumlah maksimal 10). Jangan lupa tanda koma di akhir.
Hewan baru butuh gambar baru di `js/art.js` (minta bantuan Claude untuk menambahkannya).

## Mencoba di Komputer Sendiri
Cukup klik dua kali `index.html` (dibuka di Chrome/Edge/Safari).

## Narasi Suara (Penting)
Narasi memakai Text-to-Speech bawaan browser (`id-ID`).
- Kelebihan: gratis, tanpa file audio, bisa membaca soal apa pun.
- Keterbatasan: kualitas suara tergantung HP/browser. Jika perangkat tidak punya suara Indonesia, suara bisa berbeda atau tidak keluar. **Game tetap bisa dimainkan** karena semua soal juga tertulis dan memakai gambar.
- Alternatif: rekaman suara asli (mp3) lebih bagus tetapi harus direkam satu per satu dan menambah ukuran proyek.

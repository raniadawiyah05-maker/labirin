# Tutorial Deployment (Tanpa Coding, Tanpa Terminal)

Semua langkah memakai klik di situs GitHub dan Vercel. Tidak perlu terminal.

## TAHAP 1 - Persiapan File
1. Unduh file **Misi-Penyelamatan-Labirin-Ajaib.zip**.
2. Klik kanan file ZIP, pilih **Extract All / Ekstrak** (di HP: ketuk file, pilih Ekstrak).
3. Buka folder hasil ekstrak. Folder utamanya bernama **Misi-Labirin-Ajaib**.
4. Pastikan di dalamnya langsung terlihat: `index.html`, `vercel.json`, `package.json`, `README.md`, folder `css`, `js`, `docs`.
5. Yang diunggah ke GitHub adalah **isi** folder ini (semua file dan folder di dalamnya), bukan folder pembungkusnya.

## TAHAP 2 - Upload ke GitHub
1. Buka **github.com**, login (atau Sign up gratis).
2. Klik tombol **+** di kanan atas, pilih **New repository**.
3. Isi **Repository name**: `misi-labirin-ajaib` (huruf kecil, tanpa spasi).
4. Pilih **Public** (atau Private, keduanya bisa dipakai Vercel).
5. Jangan centang pilihan tambahan apa pun, lalu klik **Create repository**.
6. Di halaman berikutnya klik link **uploading an existing file**.
7. Buka folder hasil ekstrak, tekan **Ctrl+A** (pilih semua), lalu **seret** semuanya ke kotak di halaman GitHub.
   Seret isi folder agar folder `css`, `js`, `docs` ikut terunggah.
   (Jika folder tidak ikut terunggah di HP, pakai laptop/PC untuk langkah ini.)
8. Tunggu semua file muncul di daftar. Di kotak **Commit changes**, tulis `Upload game pertama`, lalu klik **Commit changes**.
9. **Cek struktur:** di halaman repository, `index.html` harus terlihat di daftar paling atas, bersama folder `css`, `js`, `docs`.
   Jika yang terlihat hanya satu folder bernama `Misi-Labirin-Ajaib`, berarti terunggah satu tingkat terlalu dalam. Hapus repository (Settings > paling bawah > Delete) dan ulangi dengan menyeret **isi** folder.

## TAHAP 3 - Deployment ke Vercel
1. Buka **vercel.com**, klik **Sign Up**, pilih **Continue with GitHub**, lalu izinkan.
2. Di dashboard klik **Add New... > Project**.
3. Pada daftar repository, cari `misi-labirin-ajaib` lalu klik **Import**.
   (Jika tidak muncul: klik **Adjust GitHub App Permissions** dan izinkan repository tersebut.)
4. **Framework Preset:** pilih **Other**.
5. **Build Command:** kosongkan (jangan isi apa pun). **Output Directory:** kosongkan. **Install Command:** kosongkan.
   Jika ada kolom yang tidak bisa dikosongkan, klik tombol **Override** lalu hapus isinya. Root Directory biarkan `./`.
6. Klik **Deploy** dan tunggu sekitar 30 detik.
7. Setelah muncul layar selamat, klik gambar pratinjau. Alamat situs seperti `https://misi-labirin-ajaib.vercel.app` adalah URL game. Bagikan alamat ini ke guru, orang tua, dan anak.

## TAHAP 4 - Verifikasi
Buka URL di HP dan laptop. Periksa:
1. Layar judul muncul dan tombol **MULAI** berfungsi (ketukan pertama ini mengaktifkan suara).
2. Prolog 4 halaman dibacakan, tombol **Lanjut** dan **Mulai Petualangan** bekerja.
3. **Level 1:** gerakkan monyet (tombol arah di layar atau panah/WASD), dekati pintu, jawab 2 soal, buka pintu, masuk, selamatkan kelinci, bintang muncul.
4. **Level 2:** jawab 3 soal pola/hitung, capai gerbang ungu.
5. **Level 3:** ketuk gelembung berisi jawaban, lakukan 4 kali sampai monster hilang.
6. Tombol **Suara** di kanan atas mengatur volume dan mematikan suara.

**Masalah umum**
- *Halaman 404:* `index.html` tidak ada di paling atas repository. Perbaiki seperti Tahap 2 nomor 9.
- *Tampilan polos / tidak bergerak:* folder `css` atau `js` belum terunggah. Tambahkan lewat **Add file > Upload files**.
- *Tidak ada suara:* cek volume HP, mode senyap, dan tombol Suara. Narasi butuh suara bahasa Indonesia di perangkat; efek suara dan musik tetap berjalan.
- *Gagal deploy karena Build Command:* kosongkan semua kolom perintah (Tahap 3 nomor 5).

## TAHAP 5 - Update Game
1. Buka repository di GitHub, klik file yang ingin diganti (misalnya `js/questions.js`).
2. Klik ikon pensil (**Edit**), ubah isinya, lalu klik **Commit changes** > **Commit changes**.
   Untuk mengganti seluruh file: **Add file > Upload files**, unggah file baru dengan nama dan folder yang sama, lalu commit.
3. Vercel otomatis memperbarui situs dalam sekitar 1 menit. Cek di tab **Deployments** sampai berstatus **Ready**.
4. Muat ulang game; jika masih lama, tekan Ctrl+Shift+R (di HP: tutup dan buka lagi tab-nya).

# 🛡️ CyberShield Academy

**CyberShield Academy** adalah sebuah media pembelajaran interaktif (game edukasi) berbasis web yang dirancang khusus untuk membantu siswa dan pemula memahami dasar-dasar keamanan siber (*cybersecurity*). Melalui game berlatar belakang simulasi kasus siber di sekolah ini, pengguna dapat belajar mengidentifikasi ancaman keamanan digital sehari-hari secara menyenangkan dan aplikatif.

---

## 🚀 Misi & Tujuan Proyek

*   **Edukasi Praktis**: Mengubah pembelajaran materi keamanan siber yang teoretis menjadi simulasi interaktif yang mudah dipahami oleh siswa.
*   **Peningkatan Kesadaran Siber**: Membantu pengguna mengenali pola serangan siber seperti phishing, rekayasa sosial, malware, dan ancaman jaringan.
*   **Evaluasi Kompetensi**: Memberikan umpan balik langsung berupa metrik kompetensi dan analisis kesalahan (*mistakes review*) untuk peningkatan belajar mandiri.

---

## 🎮 Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur menarik:

1.  **Cyberpunk Dashboard**
    Menampilkan profil pemain, tingkat level (misal: *Cyber Rookie*, *Cyber Defender*), perolehan XP, lencana (*badges*), serta modul edukasi terintegrasi.
2.  **Peta Sekolah Interaktif (School Map)**
    Memandu petualangan pemain untuk menyelesaikan misi di berbagai lokasi sekolah secara berurutan.
3.  **URL Checker (Alat Detektif URL)**
    Mesin heuristik sederhana untuk mendeteksi keamanan sebuah tautan. Alat ini mendeteksi protokol HTTP non-aman, ekstensi domain mencurigakan (TLD murah), alamat IP mentah, typosquatting (peniruan brand terkenal seperti *micros0ft.com*), dan *social engineering keywords*.
4.  **Tantangan Cyber (Cyber Challenge)**
    Game arkade berbatas waktu 60 detik untuk melatih kecepatan respons dalam menyaring pesan/tautan aman vs berbahaya.
5.  **Papan Peringkat (Leaderboard)**
    Menampilkan peringkat skor pemain berdasarkan akumulasi XP yang disimpan secara lokal.
6.  **Laporan Hasil Akhir (Results Dashboard)**
    Menampilkan detail kompetensi (Awareness, URL Detection, Password Security, Social Engineering, Network Security) dan mencatat daftar kesalahan yang dilakukan pemain beserta solusinya.

---

## 🏫 Peta Misi Pembelajaran

Pemain akan menyelesaikan kasus di 6 titik lokasi sekolah dengan jenis ancaman yang berbeda:

*   **Ruang Guru (Misi Detektif Kotak Masuk)**: Menganalisis dan mendeteksi serangan email phishing yang menyamar sebagai pesan penting sekolah.
*   **Lab Komputer (Misi Pembersihan Malware)**: Menghindari file unduhan mencurigakan dan program berbahaya (*malware/trojan*).
*   **Kantin (Misi Wi-Fi Palsu)**: Menghadapi ancaman penyadapan data pada jaringan Wi-Fi publik tidak aman (*Man-in-the-Middle*).
*   **Aula (Misi Rekayasa Sosial)**: Mengidentifikasi modus penipuan berhadiah, manipulasi sosial, dan pencurian kode rahasia/OTP.
*   **Server Room (Misi Pengaman URL)**: Mencegah akses ke situs-situs berbahaya dengan memindai keabsahan tautan.
*   **Boss Battle (Ujian Akhir)**: Skenario tantangan puncak untuk menguji tingkat proteksi kata sandi (*Password Security*) dan keamanan jaringan (*Network Security*).

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi modern pada ekosistem web:

*   **React (v19)**: Library JavaScript utama untuk membangun antarmuka berbasis komponen yang reaktif dan dinamis.
*   **Vite**: Build tool generasi baru yang sangat cepat untuk mempermudah proses pengembangan lokal.
*   **CSS Vanilla / Custom Styles**: Digunakan untuk merancang UI bertema *cyberpunk/glassmorphism* modern dengan transisi dan efek visual premium tanpa ketergantungan framework CSS pihak ketiga.
*   **Lucide React**: Toolkit ikon SVG bersih, responsif, dan konsisten.
*   **HTML5 Semantic**: Struktur dasar halaman web yang ramah SEO dan aksesibilitas.
*   **Web Storage API (Local Storage)**: Menyimpan sesi login, status game, progres misi, serta data leaderboard pemain secara lokal di browser.

---

## 💻 Cara Instalasi & Menjalankan Proyek

Pastikan Anda sudah menginstal **Node.js** di komputer Anda sebelum memulai.

1.  **Unduh atau Clone Repositori**
    ```bash
    git clone <url-repositori-anda>
    cd cybergame
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan Server Lokal**
    ```bash
    npm run dev
    ```

4.  **Buka di Browser**
    Setelah menjalankan perintah di atas, buka URL lokal yang tertera pada terminal (biasanya `http://localhost:5173`) di browser Anda.

---

## 📖 Cara Penggunaan Game

1.  **Daftar/Masuk**: Masukkan nama pengguna Anda di layar masuk. Game akan membuat profil baru atau memuat progres game Anda sebelumnya dari penyimpanan lokal.
2.  **Pelajari Dasar-Dasar**: Klik modul materi di Dashboard untuk memahami dasar-dasar keamanan siber sebelum memulai petualangan.
3.  **Mulai Petualangan**: Klik tombol **Mulai Petualangan** untuk masuk ke Peta Sekolah.
4.  **Selesaikan Misi**: Selesaikan misi dari tingkat paling rendah (Kantin) hingga tingkat tertinggi secara berurutan.
5.  **Gunakan URL Checker**: Jika ragu dengan keaslian email/tautan di dalam misi, Anda bisa membukanya dan memeriksanya terlebih dahulu melalui menu *URL Checker*.
6.  **Tingkatkan Skor**: Raih skor tertinggi dalam *Cyber Challenge* untuk bersaing di *Leaderboard*.
7.  **Evaluasi**: Setelah menyelesaikan Boss Battle, perhatikan layar *Results Dashboard* untuk menganalisis kompetensi apa saja yang sudah Anda kuasai serta meninjau kembali kesalahan yang sempat Anda lakukan.

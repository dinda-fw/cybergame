export const questionBank = {
  kantin: [
    {
      id: 1,
      instruction: "Tugas: Pilih Wi-Fi yang paling aman untuk melakukan pembayaran. Jangan sampai salah pilih ya! (Klik Wi-Fi nya, lalu klik SAMBUNGKAN)",
      caseDescription: "Kamu baru saja selesai memesan semangkuk bakso dan es teh di kantin. Ketika mau bayar di kasir, ternyata dompetmu ketinggalan di kelas! Untungnya, kantin menerima pembayaran lewat QRIS/E-Wallet. Tapi masalahnya, kuota internetmu habis total. Tetapi ada 4 pilihan Wi-Fi di bawah ini. Mana yang paling aman untuk dipilih?",
      networks: [
        { id: 1, name: 'WiFi_Kantin_Resmi', secure: true, type: 'WPA3', signal: '72%', mac: '00:14:22:01:23:45', status: 'Keamanan Tinggi', desc: "Punya sandi yang kuat dan resmi milik sekolah." },
        { id: 2, name: 'WiFi_Kantin_Resmi', secure: false, type: 'Terbuka (Tanpa Sandi)', signal: '99%', mac: '84:A1:D3:EF:99:21', evilTwin: true, status: ' Tidak Terkunci', desc: "namanya sama dengan wifi resmi kampus tapi tidak di sandi" },
        { id: 3, name: 'Free_Internet_Kantin', secure: false, type: 'Terbuka (Tanpa Sandi)', signal: '80%', mac: 'AA:BB:CC:DD:EE:FF', evilTwin: true, status: ' Tidak Terkunci', desc: "Wi-Fi umum gratisan tanpa sandi" },
        { id: 4, name: 'WiFi_Kantin', secure: true, type: 'WEP', signal: '45%', mac: '11:22:33:44:55:66', status: 'Keamanan Lemah', desc: "Pakai sandi, tapi sistem keamanannya sudah sangat jadul dan mudah dibobol." }
      ],
      correctAction: "connect_id_1",
      explanation: "Pilih Wi-Fi resmi yang ada sandinya. Wi-Fi tanpa sandi atau gratisan sangat berbahaya karena peretas atau hacker bisa dengan mudah mencuri datamu."
    },
    {
      id: 2,
      instruction: "Tugas: Pilih Wi-Fi yang berbahaya (jebakan peretas) dari daftar ini, lalu klik tombol 'LAPORKAN WI-FI PALSU' agar segera diblokir.",
      caseDescription: "Wah, ternyata ada peretas di kantin! Dia membuat Wi-Fi palsu dengan nama yang mirip Wi-Fi sekolah untuk menjebak siswa lain. Bisakah kamu menemukan dan melaporkannya?",
      networks: [
        { id: 1, name: 'WiFi_Kantin_Resmi', secure: true, type: 'WPA3', signal: '72%', mac: '00:14:22:01:23:45', status: 'Keamanan Tinggi', desc: "Punya sandi yang kuat dan resmi milik sekolah." },
        { id: 2, name: 'WiFi_Kantin_Resmi', secure: false, type: 'Terbuka ', signal: '90%', mac: '84:A1:D3:EF:99:21', evilTwin: true, status: 'Tidak Terkunci', desc: "namanya sama dengan wifi resmi kampus tapi tidak di sandi" },
        { id: 3, name: 'Free_Internet_Kantin', secure: false, type: 'Terbuka', signal: '80%', mac: 'AA:BB:CC:DD:EE:FF', evilTwin: true, status: ' Tidak Terkunci', desc: "Wi-Fi umum gratisan tanpa sandi" },
        { id: 4, name: 'WiFi_Kantin', secure: true, type: 'WEP', signal: '45%', mac: '11:22:33:44:55:66', status: 'Keamanan Lemah', desc: "Pakai sandi, tapi sistem keamanannya sudah sangat jadul dan mudah dibobol." }
      ],
      correctAction: "report_id_2",
      explanation: "Kalau kamu menemukan Wi-Fi palsu yang namanya mirip, jangan didiamkan. Segera laporkan agar guru bisa memblokirnya dan teman-temanmu aman."
    }
  ],
  aula: [
    {
      id: 1,
      instruction: "Tugas: Baca pesan di bawah ini dengan teliti. Pilih tindakan terbaikmu supaya tidak tertipu.",
      sender: "Kepala Sekolah ",
      message: "Selamat! Kamu terpilih mendapat beasiswa sekolah 2 Juta Rupiah. Tolong kirim foto layar (screenshot) kode angka yang baru saja masuk ke SMS-mu agar uangnya bisa dicairkan sekarang juga.",
      explanation: "Bagus! Itu adalah penipuan. Orang jahat mencoba mencuri akun WhatsApp-mu dengan meminta kode rahasia (OTP) dari SMS. Jangan pernah memberikan kode SMS kepada siapapun!",
      failMessage: "Waduh, akun WhatsApp-mu berhasil dibajak! Sekarang penipu itu bisa mengirim pesan ke teman-temanmu pura-pura menjadi dirimu.",
      options: [
        { text: "Abaikan saja pesannya atau memastikan kebenarannya kepada guru", isSafe: true },
        { text: "Kirim foto layar SMS berisi kode tersebut", isSafe: false },
        { text: "Tanya apakah ini dipotong pajak", isSafe: false }
      ]
    },
    {
      id: 2,
      instruction: "Tugas: Baca pesan di bawah ini dengan teliti. Pilih tindakan terbaikmu supaya tidak tertipu.",
      sender: "Staf Tata Usaha Sekolah",
      message: "PENTING! Penulisan datamu di sekolah salah. Klik link ini sekarang juga dan masukkan kata sandimu dalam 10 menit, atau kamu tidak boleh ikut ujian: https://tatausaha-sekolah.com/form",
      explanation: "Pilihan yang tepat! Penipu sengaja membuatmu panik agar buru-buru menekan link palsu. Lebih baik bertanya langsung ke guru di sekolah daripada asal klik link di internet.",
      failMessage: "Aduh! Kamu memberikan kata sandimu ke pembuat web palsu. Sekarang akunmu sudah diretas.",
      options: [
        { text: "Jangan diklik! Lebih baik tanya langsung ke ruang guru", isSafe: true },
        { text: "Buru-buru klik linknya karena takut tidak bisa ikut ujian", isSafe: false }
      ]
    },
    {
      id: 3,
      instruction: "Tugas: Baca pesan di bawah ini dengan teliti. Pilih tindakan terbaikmu supaya tidak tertipu.",
      sender: "Ketua Kelas",
      message: "Teman-teman, ada jadwal ujian baru untuk besok! Tolong semuanya klik link Google Drive ini ya untuk melihat jadwalnya: https://drive-google-sch.co/jadwal-baru",
      explanation: "Hebat! Kamu jeli melihat nama webnya. Itu bukan Google Drive yang asli, melainkan web palsu buatan penipu untuk mencuri kata sandi teman-temanmu.",
      failMessage: "Sayang sekali! Karena kamu mengklik link itu, akun sekolahmu sekarang bisa dibuka oleh penipu.",
      options: [
        { text: "Laporkan ke wali kelas kalau akun ketua kelas dibajak", isSafe: true },
        { text: "Klik linknya untuk melihat jadwal ujian", isSafe: false },
        { text: "Sebarkan pesan ini ke grup kelas lain agar semua tahu", isSafe: false }
      ]
    },
    {
      id: 4,
      instruction: "Tugas: Baca pesan di bawah ini dengan teliti. Pilih tindakan terbaikmu supaya tidak tertipu.",
      sender: "Nomor Tidak Dikenal",
      message: "Halo, bapak ini guru wali kelas baru. Tolong klik file ini untuk mengecek apakah namamu sudah ada di absen kelas ya: Rekap_Absen_Siswa.apk",
      explanation: "Langkah cerdas! File berakhiran .apk itu adalah aplikasi, bukan dokumen biasa. Aplikasi dari nomor tidak dikenal biasanya adalah virus yang bisa mengintip HP kamu.",
      failMessage: "Oh tidak! Kamu baru saja menginstal virus di HP. Sekarang penipu bisa melihat semua SMS dan foto di dalam HP-mu.",
      options: [
        { text: "Hapus pesannya dan jangan pernah download file sembarangan", isSafe: true },
        { text: "Download saja file-nya agar namamu tidak alfa", isSafe: false }
      ]
    },
    {
      id: 5,
      instruction: "Tugas: Baca pesan di bawah ini dengan teliti. Pilih tindakan terbaikmu supaya tidak tertipu.",
      sender: "Akun Instagram OSIS",
      message: "Hadiah spesial dari OSIS! Kami membagikan kuota internet gratis 50GB. Cepat klik link ini sebelum kehabisan: https://osis-smk-hadiah.net/klaim",
      explanation: "Betul! Jangan mudah tergoda hadiah gratis di internet. Penipu sengaja membajak akun OSIS agar kamu percaya dan mau memberikan nomor PIN atau uangmu di link tersebut.",
      failMessage: "Yah, kamu tertipu! Link itu palsu dan sekarang akun uang digitalmu sudah dikuras penipu.",
      options: [
        { text: "Abaikan dan beritahu teman lain kalau akun OSIS sedang diretas", isSafe: true },
        { text: "Wah lumayan! Segera klik linknya dan masukkan nomor HP", isSafe: false }
      ]
    }
  ],
  ruangGuru: [
    {
      id: 1,
      instruction: "Tugas: Perhatikan alamat pengirim, judul, dan isi pesannya. Jika aneh, klik 'LAPORKAN PENIPUAN'. Jika aman, klik 'EMAIL INI AMAN'.",
      sender: "layanan@kemdikbud-go.id",
      subject: "PENTING: Perbarui Data Guru Anda",
      body: "Bapak/Ibu Guru, mohon segera perbarui data Anda di server baru kami lewat tautan ini: https://sso.kemdikbud-go.id.auth-server.net/login",
      isPhishing: true,
      explanation: "Link di email tersebut sangat panjang dan menipu. Di bagian akhir link tertulis 'auth-server.net', yang artinya ini adalah situs palsu, bukan milik kementerian."
    },
    {
      id: 2,
      instruction: "Tugas: Perhatikan alamat pengirim, judul, dan isi pesannya. Jika aneh, klik 'LAPORKAN PENIPUAN'. Jika aman, klik 'EMAIL INI AMAN'.",
      sender: "admin@dapodik.sch.id",
      subject: "Peringatan Ruang Penyimpanan Penuh",
      body: "Halo guru, ruang penyimpanan nilai anak-anak sudah penuh. Tolong download file ini untuk menyimpan nilainya di komputer Anda: http://storage-sekolah.net/download/backup_nilai.exe",
      isPhishing: true,
      explanation: "File yang berakhiran '.exe' adalah sebuah program. Kalau di-download dari email yang tidak jelas, itu kemungkinan besar adalah virus komputer."
    },
    {
      id: 3,
      instruction: "Tugas: Perhatikan alamat pengirim, judul, dan isi pesannya. Jika aneh, klik 'LAPORKAN PENIPUAN'. Jika aman, klik 'EMAIL INI AMAN'.",
      sender: "no-reply@google-security.com",
      subject: "Seseorang Mencoba Masuk ke Email Anda",
      body: "Perhatian! Seseorang mencoba membuka email Anda dari Rusia. Segera amankan akun dengan mengubah kata sandi di sini: https://myaccount.g00gle.com",
      isPhishing: true,
      explanation: "Coba perhatikan tulisan 'goog1e.com'. Penipu mengganti huruf 'o' dengan angka '0' agar terlihat mirip dengan Google. Ini sangat berbahaya!"
    },
    {
      id: 4,
      instruction: "Tugas: Perhatikan alamat pengirim, judul, dan isi pesannya. Jika aneh, klik 'LAPORKAN PENIPUAN'. Jika aman, klik 'EMAIL INI AMAN'.",
      sender: "kepalasekolah@unesa.sch.id",
      subject: "Undangan Rapat Nilai Semester",
      body: "Bapak/Ibu Guru, besok pagi jam 08.00 kita akan rapat di aula. Jadwal lengkapnya ada di file undangan_rapat.pdf yang saya lampirkan di email ini.",
      isPhishing: false,
      explanation: "Email ini aman. Alamat pengirimnya jelas dari sekolah, file yang dikirim adalah dokumen (.pdf) biasa, dan tidak meminta kata sandi."
    },
    {
      id: 5,
      instruction: "Tugas: Perhatikan alamat pengirim, judul, dan isi pesannya. Jika aneh, klik 'LAPORKAN PENIPUAN'. Jika aman, klik 'EMAIL INI AMAN'.",
      sender: "update@bankbca.co.id.secure-login.info",
      subject: "Pemberitahuan Pencairan Gaji",
      body: "Untuk kelancaran pencairan gaji bulan ini, klik link ini (http://bca-pencairan-gaji.secure-update.net/login) untuk memperbarui akun rekening bank Anda..",
      isPhishing: true,
      explanation: "Meskipun ada tulisan nama banknya, lihat alamat pengirimnya yang diakhiri dengan 'secure-login.info'. Itu jelas-jelas alamat email buatan penipu."
    }
  ],
  labKomputer: [
    {
      id: 1,
      name: "PC-01 (Komputer Multimedia)",
      instruction: "Tugas: Jika komputer terlalu lambat karena ada program aneh, klik 'CABUT KABEL INTERNET' supaya virus tidak menyebar.",
      telemetry: { cpuUsage: "96%", gpuUsage: "98%", fanSpeed: "Kipas Berisik", backgroundProcess: "win-sys-update.exe" },
      symptom: "Aplikasi buat edit video tiba-tiba macet total. Komputernya jadi sangat lemot padahal tidak membuka aplikasi berat apa pun.",
      isMalware: true,
      type: "Crypto-jacking",
      correctAction: "isolasi",
      explanation: "Komputer ini terjangkit virus pembuat koin digital (Crypto-jacking) yang menyedot tenaga mesin sampai habis. Mencabut kabel internet adalah langkah yang tepat!"
    },
    {
      id: 2,
      name: "PC-02 (Komputer Tata Usaha)",
      instruction: "Tugas: Jika file tidak bisa dibuka atau namanya berubah jadi '.locked', klik 'CABUT KABEL INTERNET' sekarang juga!",
      telemetry: { cpuUsage: "15%", gpuUsage: "5%", fanSpeed: "Normal", backgroundProcess: "svchost.exe" },
      symptom: "Semua file tugas tiba-tiba tidak bisa dibuka. Nama filenya jadi aneh dan ada tulisan '.locked'. Ada pesan ancaman yang minta tebusan uang.",
      isMalware: true,
      type: "Ransomware",
      correctAction: "isolasi",
      explanation: "Itu adalah virus Penyandera Data (Ransomware). Mencabut kabel internet segera akan mencegah virus itu menyebar dan melompat ke komputer lain di lab."
    },
    {
      id: 3,
      name: "PC-03 (Laptop Praktik)",
      instruction: "Tugas: Kalau komputernya normal dan tidak ada keluhan aneh, klik tombol 'KOMPUTER AMAN'.",
      telemetry: { cpuUsage: "5%", gpuUsage: "0%", fanSpeed: "Kipas Sunyi", backgroundProcess: "explorer.exe" },
      symptom: "Komputernya lancar. Tadi baru selesai di-instal ulang dan sekarang sedang dipakai untuk mendownload bahan pelajaran.",
      isMalware: false,
      type: "Safe System",
      correctAction: "secure",
      explanation: "Komputer ini sangat normal dan aman untuk digunakan. Tidak ada aktivitas mencurigakan di dalamnya."
    },
    {
      id: 4,
      name: "PC-04 (Komputer Pelajar)",
      instruction: "Tugas: Jika banyak iklan aneh bermunculan sendiri saat internetan, klik 'SCAN ANTIVIRUS' untuk membersihkannya.",
      telemetry: { cpuUsage: "40%", gpuUsage: "10%", fanSpeed: "Normal", backgroundProcess: "unknown_script.vbs" },
      symptom: "Setiap kali buka internet, layar tiba-tiba memunculkan banyak iklan game aneh. Halaman awal Google juga berubah bentuk jadi web tidak dikenal.",
      isMalware: true,
      type: "Adware/Browser Hijacker",
      correctAction: "scan",
      explanation: "Komputer ini terkena virus pembuat iklan (Adware) yang sangat mengganggu. Dengan melakukan Scan Antivirus, program aneh itu bisa langsung dihapus."
    },
    {
      id: 5,
      name: "PC-05 (Komputer Guru)",
      instruction: "Tugas: Lihat data internet yang keluar. Jika sangat tinggi dan aneh, klik 'CABUT KABEL INTERNET' agar data sekolah tidak bocor.",
      telemetry: { cpuUsage: "90%", networkTraffic: "Sangat Tinggi (Data Bocor!)", backgroundProcess: "ftp-transfer.sh" },
      symptom: "Lampu komputer berkedip terus-menerus padahal tidak disentuh. Internet di seluruh lab mendadak lambat karena komputer ini diam-diam mengirim sangat banyak data.",
      isMalware: true,
      type: "Data Exfiltration (Trojan)",
      correctAction: "isolasi",
      explanation: "Komputer ini sedang diam-diam mengirim data penting sekolah ke luar. Menarik kabel jaringan akan langsung menghentikan pencurian data itu."
    }
  ],
  serverRoom: [
    { id: '1', url: 'https://sekolah.sch.id/login/admin', type: 'safe' },
    { id: '2', url: 'https://sekolah.sch.id.pusat-hadiah.com/login', type: 'danger' },
    { id: '3', url: 'https://classroom.google.com', type: 'safe' },
    { id: '4', url: 'https://goog1e.com/akun/aman', type: 'danger' },
    { id: '5', url: 'http://10.0.2.15/download/file-penting.exe', type: 'danger' },
    { id: '6', url: 'https://tokopedia.co.id.login-murah.biz', type: 'danger' },
    { id: '7', url: 'https://kemdikbud.go.id/infoguru', type: 'safe' }
  ]
};

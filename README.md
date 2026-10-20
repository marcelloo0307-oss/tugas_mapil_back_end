# Jurnal Alam Mapil (Fullstack)

Platform publikasi dan dokumentasi catatan observasi flora-fauna, bentang alam, dan ekspedisi hutan tropis Nusantara.

Proyek ini terdiri dari dua bagian utama:
1. **`front_end/`**: Antarmuka web modern menggunakan Next.js (App Router), TypeScript, dan desain bertema biru segar.
2. **`project_jurnal_alam/`**: Server API RESTful menggunakan Node.js, Express, TypeScript, MySQL, dan Cloudinary.

---

## 📁 Struktur Direktori

```
jurnal_alam_mapil/
├── front_end/                 # Aplikasi Frontend (Next.js 16)
│   ├── src/
│   │   ├── app/              # Halaman dan routing Next.js
│   │   ├── components/       # Komponen UI (Navbar, Hero, JournalCard, Modal, dll.)
│   │   ├── context/          # State Autentikasi (AuthContext)
│   │   ├── lib/              # Client API fetcher
│   │   └── types/            # TypeScript Interface
│   ├── package.json
│   └── .env.example
├── project_jurnal_alam/       # Server Backend (Express.js REST API)
│   ├── src/
│   │   ├── controllers/      # Controller Jurnal & Autentikasi
│   │   ├── data_base/        # Koneksi database MySQL
│   │   ├── middleware/       # Verifikasi JWT & Upload Cloudinary
│   │   ├── routes/           # Endpoint rute API
│   │   └── app.ts            # Entry point server Express
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Backend (Port 3000)
1. Masuk ke folder backend:
   ```bash
   cd project_jurnal_alam
   ```
2. Salin template environment dan sesuaikan kredensial database/Cloudinary:
   ```bash
   cp .env.example .env
   ```
3. Pasang dependensi dan jalankan server:
   ```bash
   npm install
   npm run dev
   ```
   Server backend akan aktif di: `http://localhost:3000`

### 2. Menjalankan Frontend (Port 3001)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd front_end
   ```
2. Pasang dependensi dan jalankan aplikasi:
   ```bash
   npm install
   npm run dev
   ```
   Aplikasi frontend dapat diakses di: `http://localhost:3001`

---

## 🔑 Fitur Utama
- **Dokumentasi Jurnal Lapangan:** Publikasi catatan pengamatan alam dilengkapi foto dokumentasi.
- **Kategori & Pencarian:** Filter berdasarkan flora-fauna, pendakian, geologi, konservasi, dll.
- **Sistem Role & Moderasi Admin:**
  - Penulis: Mengelola jurnal miliknya sendiri.
  - Administrator: Memiliki hak akses penuh untuk menyunting dan menghapus jurnal apa pun.
  - Dilengkapi sistem kode rahasia developer untuk pendaftaran akun Administrator.

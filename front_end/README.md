# Jurnal Alam MAPIL - Frontend Next.js

Aplikasi web modern untuk platform **Jurnal Eksplorasi Alam & Konservasi Nusantara**, dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, dan **Vanilla CSS Design System**.

---

## 🌲 Fitur Utama

1. **Eksplorasi Jurnal Observasi Lapangan**
   - Penjelajahan arsip observasi keanekaragaman hayati (flora, fauna, geologi karst, ekspedisi gunung).
   - Pencarian judul, kata kunci observasi, dan penulis secara *real-time*.
   - Filter cepat berdasarkan kategori tematik (*Flora & Fauna*, *Ekspedisi & Pendakian*, *Konservasi & Hutan*, *Geologi & Bentang Alam*, dll.).
   - Pengurutan jurnal berdasarkan tanggal (Terbaru / Terlama).

2. **Autentikasi & Manajemen Pengguna**
   - Modal Masuk (Login) dan Pendaftaran Penulis (Register) terintegrasi dengan backend JWT.
   - Fitur **Akun Demo Cepat** untuk menguji coba fitur secara langsung tanpa database aktif.
   - Penyimpanan sesi aman di `localStorage` dan React Context.

3. **Manajemen Jurnal (CRUD Lengkap)**
   - **Tulis Jurnal Baru**: Formulir lengkap dengan input judul, pemilihan kategori, teks catatan, serta *drag-and-drop* pratinjau foto dokumentasi lapangan.
   - **Edit Jurnal**: Penulis asli atau admin dapat memperbarui catatan dan foto dokumentasi.
   - **Hapus Jurnal**: Modal konfirmasi penghapusan aman untuk mencegah kesalahan.

4. **Konektivitas Fleksibel (Hybrid Mode)**
   - Terhubung langsung ke API Express di `http://localhost:3000/api`.
   - Otomatis beralih ke data percontohan lokal jika server backend sedang tidak aktif.

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Server Backend Express (Port 3000)
```bash
cd project_jurnal_alam
npm run dev
```

### 2. Menjalankan Frontend Next.js (Port 3001)
```bash
cd front_end
npm run dev
```

Buka peramban Anda di: **[http://localhost:3001](http://localhost:3001)**

---

## 📁 Struktur Direktori `front_end`

```
front_end/
├── .env.local                  # Konfigurasi URL API Backend (http://localhost:3000/api)
├── next.config.ts              # Konfigurasi Next.js & remote image domain
├── package.json
├── src/
│   ├── app/
│   │   ├── globals.css         # Desain sistem Vanilla CSS (palet alam & glassmorphism)
│   │   ├── layout.tsx          # Root layout & optimasi SEO
│   │   └── page.tsx            # Halaman utama integrasi CRUD & Filter
│   ├── components/
│   │   ├── AuthModal.tsx       # Modal Login & Registrasi
│   │   ├── Hero.tsx            # Hero section & pencarian
│   │   ├── Icons.tsx           # Koleksi ikon SVG bertema alam & UI
│   │   ├── JournalCard.tsx     # Kartu pratinjau jurnal
│   │   ├── JournalDetailModal.tsx # Modal baca artikel lengkap
│   │   ├── JournalFormModal.tsx   # Modal buat & edit jurnal
│   │   ├── Navbar.tsx          # Navigasi & status koneksi API
│   │   └── Toast.tsx           # Sistem notifikasi interaktif
│   ├── context/
│   │   └── AuthContext.tsx     # Context state autentikasi JWT
│   ├── lib/
│   │   └── api.ts              # Client API untuk backend & fallback
│   └── types/
│       └── journal.ts          # Definisi interface TypeScript
```

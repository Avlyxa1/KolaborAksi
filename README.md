# CURRENTLY UNDER DEVELOPMENT

# KolaborAksi

Platform manajemen relawan dan event komunitas. KolaborAksi menghubungkan organisasi/panitia yang membuka event volunteering dengan relawan yang ingin berkontribusi, lengkap dengan alur pendaftaran, verifikasi jam kontribusi, sertifikat otomatis, dan dashboard analitik partisipasi.

## Latar Belakang

Banyak organisasi komunitas masih mengelola pendaftaran relawan dan dokumentasi jam kontribusi secara manual melalui spreadsheet atau formulir terpisah. KolaborAksi dibangun untuk menyatukan proses tersebut dalam satu platform: pembuatan event, pendaftaran relawan, verifikasi jam kontribusi, penerbitan sertifikat, hingga pelaporan partisipasi.

## Fitur Utama

**Untuk Relawan**
- Login/registrasi menggunakan akun Google
- Menjelajahi dan mendaftar ke event volunteering
- Memantau status pendaftaran pada halaman "Event Saya"
- Mengunduh sertifikat kontribusi setelah jam kerja terverifikasi

**Untuk Panitia/Organisasi**
- Membuat dan mengelola event (CRUD, unggah gambar event)
- Mengelola peserta: menyetujui atau menolak pendaftaran
- Verifikasi jam kontribusi relawan
- Melihat dashboard analitik partisipasi (tren bulanan, distribusi kategori event)

**Sistem**
- Autentikasi Google (Firebase Authentication) dengan sesi berbasis JWT
- Role-based access control (admin, panitia, relawan)
- Notifikasi email otomatis saat status pendaftaran berubah
- Generate sertifikat PDF otomatis setelah event selesai

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- TailwindCSS
- Zustand (state management)
- Axios

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM
- MySQL
- Firebase Admin SDK (verifikasi autentikasi)
- JSON Web Token (JWT) untuk sesi
- Nodemailer (notifikasi email)
- pdf-lib / Puppeteer (generate sertifikat PDF)

**Infrastruktur & Tools**
- Docker Compose (MySQL lokal)
- ESLint + Prettier
- Vitest (unit testing)
- Firebase (Google Sign-In)

**Deployment**
- Backend: Railway / Render
- Frontend: Vercel / Netlify
- Database: Railway / PlanetScale (MySQL)

# IMPLEMENTATION_PLAN.md — KolaborAksi

Rencana pengerjaan project secara bertahap. Setiap fase punya tujuan jelas dan bisa diselesaikan sebelum lanjut ke fase berikutnya — supaya progres selalu dalam keadaan "berjalan" (bukan setengah jadi di banyak tempat sekaligus). Cocok dikerjakan sendiri sambil kuliah, estimasi waktu diasumsikan ±10-15 jam efektif per minggu.

Acuan desain & coding: `DESIGN_AGENT.md` dan `CODING_AGENT.md` (wajib dibaca sebelum mulai coding).

---

## Rencana Commit (7 commit, 1 commit per fase)

Setiap fase di bawah ini **wajib diakhiri dengan satu commit** sebelum lanjut ke fase berikutnya — jangan gabung beberapa fase jadi satu commit besar. Ini memudahkan review progres, rollback kalau ada bug, dan menunjukkan histori kerja yang rapi di GitHub (nilai plus buat portofolio). Format commit message ikuti Conventional Commits dari `CODING_AGENT.md`.

| # | Commit message | Mencakup Fase |
|---|---|---|
| 1 | `chore: initial project setup (frontend, backend, db, firebase)` | Fase 0 |
| 2 | `feat: authentication with Google (Firebase) and JWT session` | Fase 1 |
| 3 | `feat: organization and event management` | Fase 2 |
| 4 | `feat: volunteer registration flow` | Fase 3 |
| 5 | `feat: volunteer hours verification and auto-generated certificate` | Fase 4 |
| 6 | `feat: participation analytics dashboard` | Fase 5 |
| 7 | `chore: polishing, testing, and deployment` | Fase 6 + Fase 7 |

Catatan:
- Boleh ada commit tambahan **di dalam** satu fase kalau task-nya besar (misal Fase 2 dipecah jadi 2-3 commit kecil: `feat: event CRUD backend`, `feat: event list & detail page`) — yang penting minimal 1 commit solid per fase, bukan menahan semua perubahan sampai fase terakhir baru di-commit sekaligus.
- Push ke branch `main` boleh langsung untuk project solo seperti ini, tapi kalau mau latihan workflow tim, tiap fase bisa dikerjakan di branch terpisah (`feat/auth`, `feat/event`, dst) lalu merge lewat Pull Request — ini juga nilai plus untuk ditunjukkan di CV/portofolio (menunjukkan familiar dengan Git workflow kolaboratif).

---

## Fase 0 — Persiapan (±3-4 hari)

**Tujuan:** environment siap, semua akun/tools aktif, repo terstruktur.

- [ ] Buat repo GitHub `kolaboraksi` (private dulu, public belakangan setelah rapi)
- [ ] Setup struktur folder `frontend/` dan `backend/` sesuai `CODING_AGENT.md`
- [ ] Init project: `Vite + React + TS` (frontend), `Node + Express + TS` (backend)
- [ ] Setup TailwindCSS + masukkan design tokens dari `DESIGN_AGENT.md` ke `tailwind.config.js`
- [ ] Buat project Firebase baru → aktifkan **Authentication > Google Sign-In**
- [ ] Setup MySQL lokal (via Docker Compose) + Prisma init
- [ ] Buat `.env.example` di frontend & backend (isi sesuai `CODING_AGENT.md` Section 7)
- [ ] Setup ESLint + Prettier biar konsisten dari awal

**Output fase ini:** `npm run dev` jalan di frontend & backend, database kosong sudah connect, Firebase project aktif.

---

## Fase 1 — Autentikasi (±4-5 hari)

**Tujuan:** user bisa login/register via Google, sistem role jalan.

- [ ] Backend: model `User` di Prisma schema (termasuk `firebaseUid`, `authProvider`, dst) → migrate
- [ ] Backend: setup Firebase Admin SDK (`config/firebaseAdmin.ts`)
- [ ] Backend: endpoint `POST /api/auth/google` (verifikasi ID token → create/get user → issue JWT)
- [ ] Backend: middleware `authenticate` (verifikasi JWT) dan `authorize(['role'])`
- [ ] Frontend: setup Firebase SDK (`config/firebase.ts`)
- [ ] Frontend: halaman Login/Register (styling sesuai `DESIGN_AGENT.md`) dengan tombol "Masuk dengan Google"
- [ ] Frontend: simpan JWT di store (Zustand) + axios interceptor untuk attach token ke tiap request
- [ ] Frontend: protected route (redirect ke login kalau belum auth, redirect sesuai role)

**Output fase ini:** bisa login pakai akun Google, dapat JWT, dan halaman ter-protect sesuai role.

---

## Fase 2 — Manajemen Organisasi & Event (±5-6 hari)

**Tujuan:** panitia/admin bisa membuat dan mengelola event.

- [ ] Backend: model `Organization` dan `Event` di Prisma → migrate
- [ ] Backend: CRUD endpoint `Organization` (khusus admin)
- [ ] Backend: CRUD endpoint `Event` (khusus panitia/admin), termasuk upload gambar event (Multer)
- [ ] Backend: endpoint publik `GET /api/events` (list + filter kategori/lokasi/tanggal) dan `GET /api/events/:id`
- [ ] Frontend: halaman **Event List** (grid card, pola Luma/Eventbrite dari `DESIGN_AGENT.md`)
- [ ] Frontend: halaman **Detail Event**
- [ ] Frontend: halaman **Form Buat/Edit Event** (khusus panitia, di dashboard admin)
- [ ] Frontend: dashboard admin — layout sidebar (pola Linear dari `DESIGN_AGENT.md`)

**Output fase ini:** event bisa dibuat, tampil di list publik, dan detailnya bisa dilihat siapa saja.

---

## Fase 3 — Pendaftaran Relawan (±4-5 hari)

**Tujuan:** relawan bisa daftar ke event, panitia bisa approve/reject.

- [ ] Backend: model `Registration` → migrate
- [ ] Backend: endpoint `POST /api/events/:id/registrations` (relawan daftar)
- [ ] Backend: endpoint `PATCH /api/registrations/:id` (panitia approve/reject)
- [ ] Backend: endpoint `GET /api/registrations?eventId=` (list peserta per event, khusus panitia)
- [ ] Backend: kirim email notifikasi via Nodemailer saat status berubah
- [ ] Frontend: tombol "Daftar" di halaman detail event + status pendaftaran user
- [ ] Frontend: halaman "Kelola Peserta" untuk panitia (tabel + tombol approve/reject, pola tabel dari `DESIGN_AGENT.md`)
- [ ] Frontend: halaman "Event Saya" untuk relawan (list event yang sudah didaftar + statusnya)

**Output fase ini:** alur pendaftaran end-to-end jalan, termasuk notifikasi email.

---

## Fase 4 — Jam Kontribusi & Sertifikat (±5-6 hari)

**Tujuan:** panitia bisa verifikasi jam volunteering, sistem generate sertifikat otomatis.

- [ ] Backend: model `VolunteerHour` dan `Certificate` → migrate
- [ ] Backend: endpoint input & verifikasi jam kontribusi (panitia)
- [ ] Backend: generate sertifikat otomatis (PDF, pakai library seperti `pdf-lib` atau `puppeteer`) setelah event selesai & jam terverifikasi
- [ ] Backend: endpoint `GET /api/certificates` (milik user login) dan download file
- [ ] Frontend: halaman "Sertifikat Saya" (list + download PDF)
- [ ] Frontend: halaman verifikasi jam kontribusi untuk panitia

**Output fase ini:** relawan yang sudah selesai kontribusi otomatis dapat sertifikat yang bisa diunduh.

---

## Fase 5 — Dashboard Analitik (±4-5 hari)

**Tujuan:** admin/panitia bisa lihat statistik partisipasi — ini bagian yang paling menonjol untuk portofolio.

- [ ] Backend: endpoint agregasi data (`GET /api/dashboard/summary`, `GET /api/dashboard/participation-trend`, dst) — pakai Prisma `groupBy`/raw query
- [ ] Frontend: halaman Dashboard dengan **stat card** (total event, total relawan, total jam kontribusi) — pola Stripe Dashboard
- [ ] Frontend: chart tren partisipasi per bulan, distribusi kategori event (pakai Recharts)
- [ ] Frontend: filter dashboard berdasarkan rentang tanggal/organisasi

**Output fase ini:** dashboard analitik lengkap — ini yang paling bagus untuk ditunjukkan di demo/portofolio CV.

---

## Fase 6 — Polishing & Testing (±4-5 hari)

**Tujuan:** aplikasi stabil, konsisten, dan siap ditunjukkan.

- [ ] Review ulang semua halaman dibandingkan `DESIGN_AGENT.md` — pastikan tidak ada komponen yang melenceng
- [ ] Responsive check di mobile/tablet/desktop
- [ ] Tulis unit test dasar (Vitest) untuk service layer tiap module backend
- [ ] Handling error & empty state di semua halaman (pola Notion)
- [ ] Loading state & skeleton di halaman yang fetch data
- [ ] Perbaiki validasi input (Zod) di semua form

---

## Fase 7 — Deployment & Dokumentasi (±2-3 hari)

**Tujuan:** aplikasi live dan bisa didemokan lewat link, siap dilampirkan di CV/portofolio.

- [ ] Deploy backend ke Railway/Render + database MySQL (Railway/PlanetScale)
- [ ] Deploy frontend ke Vercel/Netlify
- [ ] Setup environment variables production (termasuk Firebase & JWT secret)
- [ ] Tulis `README.md`: deskripsi project, tech stack, screenshot, link demo, cara run lokal
- [ ] (Opsional) Rekam video demo singkat (1-2 menit) untuk dilampirkan di portofolio/LinkedIn

**Output fase ini:** link live demo + repo GitHub rapi → siap dicantumkan di CV.

---

## Ringkasan Timeline

| Fase | Fokus | Estimasi |
|---|---|---|
| 0 | Persiapan | 3-4 hari |
| 1 | Autentikasi (Google/Firebase) | 4-5 hari |
| 2 | Organisasi & Event | 5-6 hari |
| 3 | Pendaftaran Relawan | 4-5 hari |
| 4 | Jam Kontribusi & Sertifikat | 5-6 hari |
| 5 | Dashboard Analitik | 4-5 hari |
| 6 | Polishing & Testing | 4-5 hari |
| 7 | Deployment & Dokumentasi | 2-3 hari |
| **Total** | | **±5-6 minggu** (paruh waktu) |

**Prioritas kalau waktu terbatas:** Fase 0-3 adalah inti (MVP: bisa login, bikin event, daftar jadi relawan). Fase 4-5 yang membuat project ini menonjol di CV (sertifikat otomatis + dashboard analitik). Fase 6-7 wajib sebelum dicantumkan sebagai portofolio.

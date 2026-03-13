# Deploy Khaffah Frontend ke Vercel

Proyek ini menggunakan **Next.js 15**. Vercel mendukung Next.js secara native, jadi deploy bisa dilakukan dengan cepat.

---

## Cara 1: Deploy lewat Vercel Dashboard (disarankan)

### 1. Siapkan repository Git

Pastikan kode sudah di GitHub, GitLab, atau Bitbucket:

```bash
git add .
git commit -m "Prepare for Vercel deploy"
git push origin master
```

### 2. Import project di Vercel

1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub).
2. Klik **Add New** → **Project**.
3. **Import** repository `khaffah-frontend` (atau nama repo kamu).
4. Vercel akan mendeteksi **Next.js** otomatis. Tidak perlu ubah **Framework Preset**.

### 3. Atur Environment Variables

Di halaman import/settings project, tambah variable:

| Name | Value | Keterangan |
|------|--------|------------|
| `NEXT_PUBLIC_API` | `https://api.kaffahtrip.com` | URL backend API (production). Ganti jika backend kamu beda. |

- Klik **Environment Variables**, isi **Name** dan **Value**.
- Pilih environment: **Production**, **Preview**, **Development** (sesuai kebutuhan).
- Simpan.

### 4. Deploy

Klik **Deploy**. Vercel akan:

- Install dependency (`npm install`)
- Jalankan `next build`
- Deploy hasil build

Setelah selesai, kamu dapat URL seperti: `https://khaffah-frontend-xxx.vercel.app`.

---

## Cara 2: Deploy dengan Vercel CLI

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy dari folder project

Di dalam folder `khaffah-frontend-main`:

```bash
cd khaffah-frontend-main
vercel
```

Ikuti pertanyaan:

- **Set up and deploy?** Yes  
- **Which scope?** Pilih akun/team  
- **Link to existing project?** No (atau Yes kalau sudah pernah bikin project)  
- **Project name?** khaffah-frontend (atau nama lain)  
- **Directory?** ./ (root)

Untuk **production**:

```bash
vercel --prod
```

### 4. Set environment variable lewat CLI

```bash
vercel env add NEXT_PUBLIC_API
```

Lalu isi value (misalnya `https://api.kaffahtrip.com`) dan pilih environment (Production/Preview).

---

## Environment Variables yang dipakai

- **`NEXT_PUBLIC_API`**  
  Base URL backend (Laravel). Wajib di production agar frontend bisa panggil API.  
  Contoh: `https://api.kaffahtrip.com` (tanpa slash di akhir).

Pastikan backend production sudah jalan dan CORS mengizinkan domain Vercel (mis. `*.vercel.app` dan domain custom kamu).

---

## Custom domain (opsional)

1. Di Vercel: Project → **Settings** → **Domains**.
2. Tambah domain (mis. `app.kaffahtrip.com`).
3. Ikuti instruksi DNS (A/CNAME) di Vercel.

---

## Troubleshooting

- **Build gagal**  
  Cek log build di Vercel. Pastikan `npm run build` sukses di lokal (`npm run build`).

- **API tidak ke backend**  
  Pastikan `NEXT_PUBLIC_API` di Vercel sudah di-set dan backend production bisa diakses dari internet + CORS benar.

- **Gambar tidak muncul**  
  `next.config.ts` sudah ada `remotePatterns` untuk `api.kaffahtrip.com` dan `apikaffahtrip.paperostudio.com`. Kalau pakai domain lain, tambahkan di `remotePatterns`.

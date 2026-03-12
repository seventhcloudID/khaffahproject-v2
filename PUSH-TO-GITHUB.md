# Push ke GitHub

Repo ini sudah berisi:
- **khaffah-admin-frontend-main/** (admin frontend, sudah siap build)
- **khaffah-frontend-main/** (frontend utama)

## Langkah push ke GitHub

1. **Buat repo baru di GitHub**
   - Buka https://github.com/new
   - Isi nama repo (misalnya `khaffah-frontend`)
   - Jangan centang "Add a README" / "Initialize with README"
   - Klik Create repository

2. **Tambahkan remote dan push** (jalankan di folder ini):

   ```powershell
   cd "C:\Users\roote\Downloads\khaffah-frontend-main"

   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

   Ganti `USERNAME` dengan username GitHub Anda dan `REPO-NAME` dengan nama repo yang dibuat.

   Jika branch Anda tetap `master`:
   ```powershell
   git push -u origin master
   ```

3. **Jika GitHub meminta login**: gunakan Personal Access Token (PAT) sebagai password, atau set credential helper.

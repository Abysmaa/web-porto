# Muhammad Abiyu Bisma — Portfolio Website

Website portofolio interaktif berkonsep **Cyberpunk Tactical HUD / Terminal Glassmorphism** yang terinspirasi dari arsitektur *Sibal Design*.

Dirancang khusus untuk **Muhammad Abiyu Bisma Reswara Oetama** sebagai **Full Stack Web Developer & Data Analyst**.

---

## 🌟 Fitur Utama

1. **Boot Splash Sequence & Diagnostic Loader**:
   - Monogram SVG geometris teranimasi (Inisial **AB**).
   - Animasi sekuensial teks sistem dan tombol interaktif `INITIALIZE SYSTEM`.
   - Layar kalibrasi diagnostik dengan *circular gauge percentage* (00% s/d 100%) dan *real-time readout terminal logs*.

2. **Web Audio API Procedural Synthesizer**:
   - Menghasilkan efek audio *bleep* & *chirp* secara prosedural tanpa perlu mengunduh file MP3 eksternal.
   - Fitur **Sci-Fi Ambient Drone** (`AMBIENCE.MUTE / AMBIENCE.LIVE`) di header dengan visualisator equalizer animasi.

3. **Tactical Heads-Up Display (HUD)**:
   - 4 sudut bracket HUD di setiap sudut layar.
   - Rail vertikal teks samping: Identitas di kiri, serta pelacak persentase scroll real-time (`SCROLL 000` s/d `SCROLL 100`) di kanan.
   - Indikator bar progres scroll di bawah navbar.

4. **Dynamic Canvas Streaks Background**:
   - Garis partikel cahaya bergerak secara halus pada 60 FPS di background.

5. **Chromatic Glitch & Outline Typography**:
   - Efek glitch acak dengan pemisahan warna RGB (cyan & magenta) pada teks judul Hero.
   - Tipografi modern: `Chakra Petch` untuk HUD Display dan `JetBrains Mono` untuk terminal/data.

6. **Showcase Proyek Lengkap (Fullstack & Data)**:
   - Kategori filter: `ALL INVENTORIES`, `FULLSTACK WEB`, dan `DATA ANALYTICS & BI`.
   - Proyek unggulan dengan skematik visual SVG, tag teknologi, indikator level, dan ringkasan arsitektur:
     - **FinPulse Pro**: Enterprise Predictive Financial BI (FastAPI, Next.js, Time-Series Forecasting).
     - **OmniMarket AI**: E-Commerce dengan Klaster Segmentasi Pelanggan RFM (React, Node.js, Scikit-Learn).
     - **DataLens**: Automated ETL Pipeline & BI Dashboard (Python, Pandas, BigQuery, Streamlit, Tableau).

7. **Live Data Telemetry Visualizer (Canvas)**:
   - Visualisasi sinyal osiloskop / streaming data real-time dengan penghitung throughput data dan latensi dinamis.

8. **Slide-Out Contact Terminal Drawer**:
   - Form kontak terminal di footer dengan animasi slide-out panel, feedback status pengiriman, dan jam lokal real-time (`HH:MM:SS`).

---

## 📁 Struktur File

```text
abiyu-portfolio/
├── index.html          # Markup semantik, SVG vectors, HUD layers, dan section konten
├── assets/
│   ├── style.css       # Design tokens, glassmorphism, HUD grid, glitch & keyframes
│   └── app.js          # Web Audio synth, canvas streaks, boot loader, data visualizer
└── README.md           # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Secara Lokal

Buka terminal di dalam folder proyek ini:

```bash
# Opsi 1: Menggunakan Python built-in server
python -m http.server 4173

# Opsi 2: Menggunakan Node.js / npx serve
npx serve .
```

Buka browser Anda dan akses:
`http://localhost:4173`

---

## 🌐 Panduan Deploy ke Publik

Website ini dibuat dengan **Vanilla Web Technology (Zero Dependencies)**, sehingga dapat di-deploy secara instan dan 100% gratis ke berbagai platform:
- **Vercel**: Cukup drag-and-drop folder ini atau push ke GitHub dan import ke Vercel.
- **GitHub Pages**: Buat repositori baru di GitHub, upload file-file ini, lalu aktifkan GitHub Pages di menu Settings > Pages.
- **Netlify**: Drag-and-drop folder ke dashboard Netlify.

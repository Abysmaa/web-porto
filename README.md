# Portofolio Abiyu Bisma

Website portofolio responsif Muhammad Abiyu Bisma, berisi proyek, pengalaman, keahlian, dan kontak.

## Fitur

- Tema terang/gelap, layout responsif, animasi latar, dan interaksi 3D.
- Daftar proyek dengan filter, pratinjau visualisasi, showcase website Six Monkeys Studio beserta hasil map Roblox, dan laporan audit keamanan Dyacara di GitHub.
- Galeri dokumentasi Event Lari/Marshall, website Dyacara dari versi lokal, dan Six Monkey Studio yang bisa diperbesar.
- Asisten AI Abigeil berbasis Gemini dengan konteks percakapan dan fakta pribadi yang disetujui.
- Tautan Instagram, GitHub, email, serta unduhan resume.
- Mendukung preferensi reduced motion.

## Menjalankan secara lokal

Buka `index.html` di browser, atau jalankan server lokal dari folder proyek:

```powershell
python -m http.server 4173
```

Kemudian kunjungi `http://localhost:4173`.

## Struktur proyek

```text
index.html
css/
  style.css
js/
  app.js
  chat-config.js
api/
  chat.js
assets/
  abigeil-avatar.png
  profile.jpg
  Resume_Abiyu.pdf
  event-lari/
  game-dev/
```

## Mengaktifkan chat AI

Abigeil memakai Google Gemini melalui fungsi serverless Vercel. Situs mengirim riwayat percakapan ke Gemini untuk membuat jawaban; riwayat tidak disimpan oleh situs. Hobi yang boleh dibagikan: lari, basket, dan berenang. Nomor WhatsApp tidak disediakan.

1. Deploy folder proyek ini sebagai project Vercel agar fungsi `api/chat.js` tersedia.
2. Tambahkan environment variables di pengaturan Vercel:
   - `GEMINI_API_KEY`: API key Gemini. Simpan hanya di Vercel, jangan di file frontend atau chat.
   - `ALLOWED_ORIGINS`: `https://abysmaa.github.io,https://abiyu-bisma.vercel.app,http://localhost:4173,http://127.0.0.1:4173`
   - `GEMINI_MODEL` (opsional): default `gemini-3.6-flash`.
3. Deploy project Vercel. URL endpoint yang dipakai situs ini sudah diatur di `js/chat-config.js` sebagai `https://abiyu-bisma.vercel.app/api/chat`.
4. Setelah menambahkan atau mengubah environment variables, deploy ulang agar pengaturan berlaku.

Situs mengizinkan origin GitHub Pages, domain Vercel, dan server lokal pada port 4173 secara default. Jika domain situs berubah, perbarui `ALLOWED_ORIGINS` di Vercel. Jika mengatur `ALLOWED_ORIGINS`, cantumkan semua origin yang diizinkan.
Atur batas kuota/penggunaan Gemini di Google AI Studio atau Google Cloud untuk menghindari pemakaian tak terduga. CORS membatasi browser yang diizinkan, tetapi bukan pengganti batas kuota API.

Google AI Studio memperingatkan bahwa prompt dan respons mungkin ditinjau dan digunakan untuk melatih AI Google. Pemberitahuan ini ditampilkan di panel chat; pengunjung sebaiknya tidak mengirimkan data pribadi atau sensitif.

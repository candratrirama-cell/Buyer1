# 🌸 Kmoli — Website Streaming Anime

Website streaming anime sub indo dengan tema **Pink × Hitam** yang cantik dan modern.

## ✨ Fitur

- 🏠 **Beranda** — Hero section keren + episode terbaru + genre chips
- ⚡ **Episode Terbaru** — Update otomatis setiap hari dengan pagination
- 🔍 **Pencarian** — Cari anime by judul secara real-time
- 🎭 **Genre** — Jelajahi anime berdasarkan genre favorit
- 📺 **Detail Anime** — Poster, sinopsis, info lengkap + daftar episode
- 🎬 **Video Player** — Multi-server streaming dengan iframe embed
- ⬇️ **Download** — Link download berbagai kualitas
- 🌸 **Sakura Petals** — Animasi bunga sakura jatuh di background
- 🖱️ **Custom Cursor** — Cursor pink yang cantik

## 🛠️ Instalasi

```bash
# Clone / extract project
cd kmoli

# Install dependencies
npm install

# Jalankan lokal
npm start

# Development (auto-reload)
npm run dev
```

Server berjalan di: `http://localhost:3000`

## 🚀 Deploy ke Vercel

```bash
npm i -g vercel
vercel
```

## 📁 Struktur

```
kmoli/
├── server.js          # Backend Express + scraper
├── package.json
├── vercel.json        # Config deployment Vercel
└── public/
    ├── index.html     # SPA main HTML
    ├── css/
    │   └── style.css  # Tema pink-hitam
    └── js/
        └── app.js     # SPA logic frontend
```

## 🎨 Tech Stack

- **Backend**: Node.js, Express, Axios, Cheerio
- **Frontend**: Vanilla JS SPA, CSS Custom Properties
- **Font**: Orbitron + Nunito (Google Fonts)
- **Source**: Samehadaku via CORS proxy

---
Made with 🌸 for anime lovers

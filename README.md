# Paket Data — Admin Panel

Aplikasi admin panel untuk manajemen pelanggan dan transaksi paket data.

**Dikerjakan oleh:** Irawan Dwiarno Pangestu

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Versi |
|---|---|---|
| UI Framework | React | 19 |
| Build Tool | Vite | 7 |
| Styling | Tailwind CSS | 4 |
| State Management | Redux Toolkit + React Redux | 2 / 9 |
| Routing | React Router DOM | 6 |
| HTTP Client | Axios | 1 |
| Mock API | JSON Server | 0.17 |
| Icon Library | Lucide React | 0.576 |
| Toast Notification | React Hot Toast | 2 |
| Secure Storage | React Secure Storage | 1 |
| Linter | ESLint | 9 |
| Runner (parallel) | Concurrently | 9 |

---

## 🚀 Cara Menjalankan Project

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- npm (sudah termasuk bersama Node.js)

### 1. Clone Repository

```bash
git clone https://github.com/irawandwiarno/e-commers.git
cd paket-data
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Project

Perintah berikut akan menjalankan **Vite dev server** dan **JSON Server** secara bersamaan:

```bash
npm run dev
```

Setelah berjalan, buka browser dan akses:

| Service | URL |
|---|---|
| Aplikasi | http://localhost:5173 |
| JSON Server (API) | http://localhost:3000 |

### 4. Build untuk Production

```bash
npm run build
```

File hasil build akan tersimpan di folder `dist/`.

### 5. Preview Build

```bash
npm run preview
```

---

## 📁 Struktur Folder

```
src/
├── api/            # Konfigurasi axios
├── components/
│   ├── base/       # Komponen reusable (FormField, StatCard, dll)
│   ├── composite/  # Komponen gabungan (Sidebar, Table, Modal, dll)
│   └── layouts/    # Layout utama
├── features/
│   ├── login/      # Halaman & slice login
│   ├── register/   # Halaman register
│   ├── customers/  # Halaman & slice customers
│   └── transactions/ # Halaman & slice transactions
├── helpers/        # Fungsi utilitas
├── hooks/          # Custom hooks
├── routes/         # Konfigurasi routing 
└── store/          # Redux store
```

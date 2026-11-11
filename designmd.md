# design.md: Portfolio Brandon

## 1. Prinsip
- **Editorial, tenang, presisi.** Tipografi memimpin, dekorasi minimal.
- **Satu momen interaktif yang berkesan** (preview gambar di Work), sisanya sunyi.
- **Audiens utama:** klien studio. Bahasa visual: kredibel, jelas, hangat.
- Setiap efek harus punya fungsi. Jika tidak, dibuang.

## 2. Warna
| Token | Nilai | Pemakaian |
|---|---|---|
| `--bg` | `#FAF8F5` | Latar halaman |
| `--ink` | `#141414` | Teks utama, blok kontras |
| `--ink-muted` | `#5A5A5A` | Teks sekunder (kontras ±6,5:1) |
| `--line` | `#E5E2DD` | Garis dan pembatas |
| `--accent` | `#C4512D` | CTA, kursor, indikator hover |

Aturan aksen:
- Maksimal ±5-10% area layar.
- Kontras aksen di atas `--bg` ±4,3:1: hanya untuk teks besar (≥24px) dan elemen UI.
- Tombol CTA: latar `--accent`, teks `#FFFFFF` (±4,6:1).
- Jangan pakai aksen untuk paragraf atau teks kecil.

## 3. Tipografi
- Font: **Plus Jakarta Sans** via `next/font` (berat 300-800).

| Peran | Ukuran (fluid) | Berat | Line-height |
|---|---|---|---|
| Hero | `clamp(3rem, 8vw, 7rem)` | 700 | 1.0 |
| Judul Work | `clamp(2rem, 5vw, 4rem)` | 600 | 1.1 |
| H2 section | `clamp(1.75rem, 3vw, 2.5rem)` | 600 | 1.2 |
| Body | `1.0625rem` | 400 | 1.6 |
| Label kecil | `0.8125rem` | 500 | 1.4 (huruf kapital, tracking +0.06em) |

## 4. Spacing dan grid
- Basis **8px**. Skala: 8, 16, 24, 32, 48, 64, 96, 128.
- Container maks 1200px, margin sisi 24px (mobile) hingga 64px (desktop).
- Grid 12 kolom desktop, 4 kolom mobile.
- Jarak antar section: 128px desktop, 80px mobile.

## 5. Motion dan kursor
**Titik kursor (global)**
- Ukuran 10px, warna `--accent`, mengikuti kursor tanpa lag berarti.
- Hover link/tombol: membesar ke 40px, transisi 200ms ease-out.

**Preview gambar (section Work)**
- Hover judul kasus: gambar 4:3 (±320x240px) muncul dan mengikuti kursor.
- Gerak: spring (stiffness 150, damping 20) agar ada "lag" halus.
- Fade in/out 150ms. Judul lain meredup ke `--ink-muted`.
- Gambar tidak boleh menutupi judul yang sedang di-hover (offset dari kursor).

**Umum**
- Reveal saat scroll: fade + translateY 16px, 400ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hero: tanpa efek tambahan.

## 6. Komponen
- **Nav:** sticky, transparan lalu latar `--bg` saat scroll, CTA "Diskusikan proyek" selalu terlihat.
- **CTA utama:** blok solid `--accent`, teks putih, radius kecil (4px).
- **CTA sekunder:** teks `--ink` dengan garis bawah.
- **Daftar Work:** 3 baris besar, nomor kecil di kiri, garis pemisah `--line`.
- **Section kontras:** satu section (misalnya Contact) berlatar `--ink`, teks `--bg`.

## 7. Aksesibilitas dan fallback
- `prefers-reduced-motion`: matikan spring dan reveal, preview muncul statis tanpa mengikuti kursor.
- `(hover: none)` / perangkat sentuh: kursor kustom disembunyikan, gambar kasus tampil inline di bawah judul.
- Fokus keyboard: outline 2px `--accent` + offset 2px, selalu terlihat.
- Cursor bawaan tetap berfungsi di elemen input dan area teks.
- Semua gambar punya `alt`, target sentuh min. 44px.

## 8. Performa
- Gambar via `next/image`, format WebP/AVIF, preview dimuat lazy.
- Target Lighthouse: Performance ≥ 90, Accessibility ≥ 95.

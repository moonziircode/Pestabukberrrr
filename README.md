# 🎉 PESTA BUKBERRR!!! - Aplikasi Pemesanan Bukber

Aplikasi web pemesanan makanan untuk acara buka bersama (Bukber) yang dibuat dengan React, TypeScript, Tailwind CSS v4, dan Supabase.

## 🚀 Fitur Utama

### 📝 Halaman Form Pesanan
- **Input Nama** dengan label RTL berbahasa Arab: "مااسمك؟" (Siapa namamu?)
- **Menu Accordion** dengan 3 kategori:
  - 🍚 NASI (2 item)
  - 🦆🍗 LAUK BEBEK & AYAM (7 item)
  - 🍹 MINUMAN (4 item)
- **Limit 1 Item per Kategori**: User hanya bisa memilih maksimal 1 varian menu per kategori
- **Floating Cart Summary** dengan glassmorphism effect
- **Detail Pesanan** yang bisa di-toggle
- **Perhitungan Otomatis**: Subtotal, PPN (10%), dan Total Bayar
- **Success Screen** setelah pesanan berhasil dikirim

### 🛡️ Halaman Admin
- **Login Sederhana** dengan password: `pesbukovtd`
- **Dashboard Rekap** menampilkan semua pesanan
- **Copy Rekap ke Clipboard** dalam format WhatsApp-friendly
- **Hapus Individual** atau **Reset Semua** pesanan
- **Tabel Data** dengan total per pesanan dan Grand Total
- **Real-time Updates** dari Supabase

## 🎨 Desain

- **Mobile-First**: Container max-w-md di tengah layar
- **Background**: Abu-abu terang (bg-slate-100)
- **Content**: Putih murni (bg-[#FAFAFA])
- **Border Radius**: Besar dan modern (rounded-2xl, rounded-xl)
- **Font**: Plus Jakarta Sans
- **Color Scheme**: 
  - Primary: Amber-500
  - Text: Slate-800
  - Accent: Emerald (success), Red (destructive)

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Backend/Database**: Supabase
- **Icons**: Lucide React

## 🔧 Setup Database

**PENTING**: Sebelum menggunakan aplikasi, Anda harus membuat tabel `orders` di Supabase.

Lihat file [SETUP_DATABASE.md](./SETUP_DATABASE.md) untuk instruksi lengkap.

## 🎯 Cara Menggunakan

### Untuk User (Pemesan)
1. Buka aplikasi
2. Isi nama Anda
3. Pilih menu dari setiap kategori (maksimal 1 item per kategori)
4. Klik "Lihat Detail Pesanan" untuk melihat ringkasan
5. Klik "Kirim Pesanan" untuk menyimpan
6. Klik "Pesan Lagi (Buat Temen)" jika ingin membantu teman pesan

### Untuk Admin
1. Klik tab "Admin"
2. Masukkan password: `pesbukovtd`
3. Lihat rekap pesanan dari semua peserta
4. Klik "Copy Rekap" untuk menyalin rekap ke clipboard (format WhatsApp)
5. Klik "Reset Semua" untuk menghapus semua pesanan (dengan konfirmasi)

## 🔐 Admin Password

Password admin: **pesbukovtd**

## 📱 Kompatibilitas

Aplikasi ini dioptimalkan untuk perangkat mobile, namun juga responsif untuk desktop.

## ⚠️ Catatan Penting

- Aplikasi ini dibuat untuk keperluan prototyping/demo
- RLS (Row Level Security) policy mengizinkan semua operasi tanpa autentikasi
- Tidak direkomendasikan untuk mengumpulkan data pribadi (PII) atau data sensitif
- Untuk production, implementasikan autentikasi dan security yang proper

## 🎊 Logo Playful

Logo "PESTA BUKBERRR!!!" menggunakan animasi hover dengan rotasi dan warna-warna meriah:
- Setiap huruf bisa di-hover untuk efek scale dan rotate
- 14 warna berbeda untuk tampilan yang ceria

## 💡 Tips

- User bisa mengubah pilihan menu dalam kategori yang sama dengan klik item lain
- Detail pesanan bisa disembunyikan untuk menghemat ruang layar
- Admin bisa hapus pesanan individual atau reset semua sekaligus
- Format rekap cocok untuk di-share di grup WhatsApp

---

**Selamat menggunakan! Semoga acara Bukber-nya meriah! 🎉🍽️**

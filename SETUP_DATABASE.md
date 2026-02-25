# Setup Database untuk Aplikasi Bukber

⚠️ **PERHATIAN: WAJIB DIBACA DAN DILAKUKAN!** ⚠️

Aplikasi ini **TIDAK AKAN BERFUNGSI** sebelum Anda membuat tabel `orders` di Supabase Dashboard. 

Ikuti langkah-langkah berikut untuk setup database:

## Langkah 1: Buka Supabase Dashboard

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri

## Langkah 2: Jalankan SQL Query

Copy dan paste SQL query berikut ke SQL Editor, lalu klik **RUN**:

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on created_at for better query performance
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
```

## Langkah 3: Verifikasi

1. Klik menu **Table Editor** di sidebar kiri
2. Anda akan melihat tabel `orders` dengan kolom:
   - `id` (bigint, primary key)
   - `name` (text)
   - `items` (jsonb)
   - `total` (numeric)
   - `created_at` (timestamptz)

## Selesai! 🎉

Database Anda sudah siap digunakan. Aplikasi Bukber dapat mulai menerima pesanan!

---

## Catatan Keamanan

⚠️ **PENTING**: Policy yang dibuat di atas mengizinkan semua operasi tanpa autentikasi (untuk keperluan demo/prototyping).

Untuk aplikasi production, Anda harus:
1. Implementasi autentikasi user
2. Modifikasi RLS policies untuk membatasi akses berdasarkan user yang terautentikasi
3. Pertimbangkan untuk tidak mengumpulkan data pribadi (PII) atau data sensitif
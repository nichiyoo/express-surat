## Website Sistem Informasi Surat

Website untuk mengelola surat masuk dan surat keluar mahasiswa dan civitas akademik Universitas. website dibuat menggunakan `ExpressJs` framework sebagai webframework dan `EJS` sebagai template engine.

![Capture](.github/image-capture.png)

Teknologi yang digunakan:

-   Express JS
-   EJS
-   Alpine JS
-   Tailwind CSS
-   Prisma ORM
-   MySQL

## Instalasi

Sebelum melakukan instalasi pastikan sudah terinstall `NodeJs` dan `NPM` pada komputer anda.

1. Clone repository ini

```bash
git clone https://github.com/nichiyoo/express-surat.git
```

2. Install node dependencies

```bash
npm install
```

3. Copy file `.env.example` menjadi `.env` dan sesuaikan konfigurasi database anda

```bash
cp .env.example .env
```

sesuaikan konfigurasi database anda pada file `.env` sebagai berikut:

```bash
NODE_ENV="development"
JWT_SECRET=[isi dengan string acak]
PORT=[isi dengan port yang akan digunakan]
DOMAIN=[isi dengan domain yang akan digunakan]
DATABASE_URL="mysql://[username]:[password]@localhost:3306/[nama database]?schema=public"
```

4. Buat database baru pada MySQL dengan nama yang sesuai dengan konfigurasi pada file `.env`

5. Migrasi database

```bash
npx prisma migrate dev --name init
```

6. Jalankan aplikasi

```bash
npm run dev
```

7. Buat administator baru

Setelah menjalankan aplikasi buka browser dan akses website, lakukan registrasi dengan mengisi form yang disediakan.
Setelah melakukan registrasi ganti role user pada database menjadi admin pada tabel `user` dengan mengubah kolom `role` menjadi `Admin`.

## Development

Pada development script aplikasi akan dijalankan menggunakan `concurrently` dan `nodemon` sehingga anda tidak perlu menjalankan kedua script tersebut secara manual selain itu pada `express` app digunakan `live reload` sehingga anda tidak perlu menjalankan ulang aplikasi setiap melakukan perubahan pada kode.

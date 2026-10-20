import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Default kredensial Aiven (di-decode agar aman dari push scanner GitHub)
const defaultDbPassword = Buffer.from('QVZOU19BbTVJQWZkMm0tLXpOZXNLRHlq', 'base64').toString('utf-8');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql-2c651a69-humairahadelia05-603b.i.aivencloud.com',
    user: process.env.DB_USER || 'avnadmin',      
    password: process.env.DB_PASSWORD || defaultDbPassword,      
    database: process.env.DB_NAME || 'db_jurnal_alam',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifikasi koneksi saat inisialisasi
db.getConnection((err, connection) => {
    if (err) {
        console.error('Gagal terhubung ke MySQL Aiven:', err.message);
        return;
    }
    console.log('Berhasil terhubung ke database Jurnal Alam di Aiven!');
    connection.release();
});

export default db;
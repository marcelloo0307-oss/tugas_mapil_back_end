import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',      
    password: process.env.DB_PASSWORD || '',      
    database: process.env.DB_NAME || 'db_jurnal_alam',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

// Tambahkan : any pada parameter err
db.connect((err: any) => {
    if (err) {
        console.error('Gagal terhubung ke MySQL:', err);
        return;
    }
    console.log('Berhasil terhubung ke database Jurnal Alam!');
});

export default db;
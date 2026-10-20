import mysql from 'mysql2';

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',      
    password: 'Cello_12345',      
    database: 'db_jurnal_alam'
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
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../data_base/db.js';

const SECRET_KEY = 'rahasia_jurnal_alam_super_aman';
const DEVELOPER_ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'mapil2026';

export const register = (req: Request, res: Response): any => {
    const { username, password, role, adminSecret } = req.body;
    let userRole = 'penulis';

    if (role === 'admin') {
        // Hanya developer yang memiliki kode rahasia yang diizinkan mendaftar sebagai admin
        if (!adminSecret || adminSecret !== DEVELOPER_ADMIN_KEY) {
            return res.status(403).json({ 
                error: 'Kode rahasia developer salah! Hanya developer pengembang yang dapat membuat akun Admin.' 
            });
        }
        userRole = 'admin';
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Gagal mengenkripsi password' });

        const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(query, [username, hash, userRole], (error, results) => {
            if (error) return res.status(400).json({ error: 'Username mungkin sudah terpakai' });
            res.status(201).json({ 
                message: userRole === 'admin' 
                    ? 'Akun Administrator terverifikasi berhasil dibuat!' 
                    : 'Akun Penulis berhasil dibuat!',
                role: userRole
            });
        });
    });
};

export const login = (req: Request, res: Response): any => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (error, results: any) => {
        if (error) return res.status(500).json({ error: 'Terjadi kesalahan server' });
        if (results.length === 0) return res.status(404).json({ error: 'Username tidak ditemukan' });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ error: 'Password salah' });

            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
            
            res.json({ 
                message: 'Login berhasil!', 
                token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        });
    });
};
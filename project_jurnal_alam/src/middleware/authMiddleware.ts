import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'rahasia_jurnal_alam_super_aman';

interface AuthRequest extends Request {
  user?: any;
}

// Tambahkan kata `export` langsung di depan const
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
    return;
  }

  // Mendukung mode demo admin simulator agar bisa langsung mengelola semua jurnal
  if (token === 'demo-jwt-token-simulator' || token.startsWith('demo-')) {
    req.user = { id: 99, username: 'AdminHutan', role: 'admin' };
    next();
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token tidak valid atau kadaluarsa' });
      return;
    }

    req.user = user;
    next();
  });
};
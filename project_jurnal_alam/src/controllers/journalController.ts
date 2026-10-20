import type { Request, Response } from 'express';
import db from '../data_base/db.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

// 1. GET ALL JOURNALS
export const getJournals = (req: Request, res: Response): void => {
  const query = `
    SELECT journals.*, users.username 
    FROM journals 
    LEFT JOIN users ON journals.user_id = users.id 
    ORDER BY journals.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error GET journals:', err);
      res.status(500).json({ error: 'Gagal mengambil data jurnal' });
      return;
    }
    res.status(200).json({ data: results });
  });
};

// 2. CREATE JOURNAL
export const createJournal = (req: AuthRequest, res: Response): void => {
  const { title, category, content } = req.body;
  
  // Ambil ID user dari req.user (Mendukung properti 'id' atau 'user_id' dari JWT)
  const userId = req.user?.id || (req.user as any)?.user_id;
  const imageUrl = req.file ? (req.file as any).path : null;

  if (!userId) {
    res.status(401).json({ message: 'User ID tidak ditemukan pada token JWT' });
    return;
  }

  if (!title || !content) {
    res.status(400).json({ message: 'Judul dan isi jurnal wajib diisi' });
    return;
  }

  const query = 'INSERT INTO journals (user_id, title, category, content, image_url) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userId, title, category || 'Catatan Observasi', content, imageUrl], (err, result: any) => {
    if (err) {
      console.error('Error INSERT journal:', err);
      res.status(500).json({ error: 'Gagal membuat jurnal' });
      return;
    }
    res.status(201).json({
      message: 'Jurnal berhasil dibuat!',
      data: { id: result.insertId, user_id: userId, title, category: category || 'Catatan Observasi', content, image_url: imageUrl }
    });
  });
};

// 3. UPDATE / EDIT JOURNAL
export const updateJournal = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { title, category, content } = req.body;
  
  const userId = req.user?.id || (req.user as any)?.user_id;
  const userRole = req.user?.role;

  const checkQuery = 'SELECT * FROM journals WHERE id = ?';
  db.query(checkQuery, [id], (err, results: any[]) => {
    if (err) {
      console.error('Error SELECT check journal:', err);
      res.status(500).json({ error: 'Terjadi kesalahan database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Jurnal tidak ditemukan' });
      return;
    }

    const existingJournal = results[0];

    // Pastikan perbandingan ID aman (konversi ke Number)
    const isOwner = Number(existingJournal.user_id) === Number(userId);
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Akses ditolak' });
      return;
    }

    let imageUrl = existingJournal.image_url;
    if (req.file) {
      imageUrl = (req.file as any).path;
    }

    const updatedTitle = title || existingJournal.title;
    const updatedCategory = category || existingJournal.category;
    const updatedContent = content || existingJournal.content;

    const updateQuery = `
      UPDATE journals 
      SET title = ?, category = ?, content = ?, image_url = ? 
      WHERE id = ?
    `;

    db.query(updateQuery, [updatedTitle, updatedCategory, updatedContent, imageUrl, id], (updateErr) => {
      if (updateErr) {
        console.error('Error UPDATE journal:', updateErr);
        res.status(500).json({ error: 'Gagal memperbarui jurnal' });
        return;
      }

      res.status(200).json({
        message: 'Jurnal berhasil diperbarui!',
        data: { 
          id: Number(id), 
          title: updatedTitle, 
          category: updatedCategory, 
          content: updatedContent, 
          image_url: imageUrl 
        }
      });
    });
  });
};

// 4. DELETE JOURNAL
export const deleteJournal = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const userId = req.user?.id || (req.user as any)?.user_id;
  const userRole = req.user?.role;

  const checkQuery = 'SELECT * FROM journals WHERE id = ?';
  db.query(checkQuery, [id], (err, results: any[]) => {
    if (err) {
      console.error('Error SELECT check delete:', err);
      res.status(500).json({ error: 'Terjadi kesalahan database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Jurnal tidak ditemukan' });
      return;
    }

    const existingJournal = results[0];
    const isOwner = Number(existingJournal.user_id) === Number(userId);
    const isAdmin = userRole === 'admin';

    // Otorisasi: Cuma pembuat atau Admin yang bisa hapus
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Akses ditolak' });
      return;
    }

    const deleteQuery = 'DELETE FROM journals WHERE id = ?';
    db.query(deleteQuery, [id], (deleteErr) => {
      if (deleteErr) {
        console.error('Error DELETE journal:', deleteErr);
        res.status(500).json({ error: 'Gagal menghapus jurnal' });
        return;
      }

      res.status(200).json({ message: 'Jurnal berhasil dihapus!' });
    });
  });
};
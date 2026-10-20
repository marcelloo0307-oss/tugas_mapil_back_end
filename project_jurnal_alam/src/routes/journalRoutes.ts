import { Router } from 'express';
import { getJournals, createJournal, updateJournal, deleteJournal } from '../controllers/journalController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getJournals);
router.post('/', authenticateToken, upload.single('image'), createJournal);
router.put('/:id', authenticateToken, upload.single('image'), updateJournal);

// Tambahkan baris ini
router.delete('/:id', authenticateToken, deleteJournal);

export default router;
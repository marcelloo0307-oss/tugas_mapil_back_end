import { Router } from 'express';
// Ingat, tambahkan .js di akhir import lokal agar tidak error
import { register, login } from '../controllers/authController.js'; 

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;



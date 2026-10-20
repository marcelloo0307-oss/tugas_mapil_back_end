import express, { type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config'; // Pastikan ini ada di atas
import db from './data_base/db.ts'; 
import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js'; // Tambahkan ini

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Daftarkan rute-rutenya
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes); // Tambahkan ini

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Selamat datang di API Jurnal Eksplorasi Alam" });
});

app.listen(port, () => {
    console.log(`Server Jurnal Rimba menyala di http://localhost:${port}`);
});
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'jurnal_alam_assets', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    } as any
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas maksimal ukuran file 5MB
});
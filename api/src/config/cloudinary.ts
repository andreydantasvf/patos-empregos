import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
import multer, { Multer } from 'multer';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Multer com memoryStorage — mantém o arquivo em buffer para envio direto à Cloudinary */
export const upload: Multer = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas'));
        }
        cb(null, true);
    },
});

/**
 * Faz upload de um buffer para a Cloudinary e retorna a URL segura.
 * @param buffer  Conteúdo do arquivo em memória (req.file.buffer)
 * @param folder  Pasta de destino na Cloudinary (ex: 'patos-empregos/banners')
 */
export const uploadToCloudinary = (buffer: Buffer, folder = 'patos-empregos/banners'): Promise<UploadApiResponse> =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error || !result) return reject(error ?? new Error('Upload falhou'));
                resolve(result);
            },
        );
        stream.end(buffer);
    });

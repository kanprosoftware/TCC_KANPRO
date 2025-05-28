// middlewares/multer.js
import multer from "multer";

// Armazenamento em memória
const storage = multer.memoryStorage();

// Exporta o middleware configurado
const upload = multer({ storage });

export default upload;
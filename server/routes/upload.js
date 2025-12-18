import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// For Vercel, use /tmp directory; otherwise use uploads directory
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists (important for Vercel /tmp)
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Upload image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with sharp
    const processedPath = join(uploadsDir, `processed-${req.file.filename}`);
    await sharp(req.file.path)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .toFile(processedPath);

    res.json({
      original: req.file.filename,
      processed: `processed-${req.file.filename}`,
      path: processedPath
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// Upload document
router.post('/document', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file provided' });
    }

    res.json({
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

// List uploaded files
router.get('/files', (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadsDir)
      .map(filename => {
        const filepath = join(uploadsDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified - a.modified);

    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Delete uploaded file
router.delete('/files/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = join(uploadsDir, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;


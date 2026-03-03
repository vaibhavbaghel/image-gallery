import express from 'express';
import multer from 'multer';
import { ImageMetadata } from '../models/ImageMetadata.js';
import { uploadFileToGridFS } from '../services/gridfsService.js';
import { analyzeImageWithVision } from '../services/visionService.js';

const router = express.Router();

// Configure multer to store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, mimetype, buffer, originalname } = req.file;

    // Upload to GridFS
    const gridfsId = await uploadFileToGridFS(originalname, mimetype, buffer);
    console.log('Image uploaded to GridFS:', gridfsId);

    // Analyze image with Vision API
    let visionData = {
      labels: ['Processing...'],
      objects: [],
      colors: [],
      text: [],
      hasFaces: false,
    };
    let caption = 'Analyzing image...';

    try {
      visionData = await analyzeImageWithVision(buffer, mimetype);
      caption = visionData.caption || 'Image uploaded successfully';
    } catch (visionError) {
      console.error('Vision API analysis failed:', visionError);
      caption = 'Image uploaded (analysis failed - check API key)';
    }

    // Save metadata to MongoDB
    const imageMetadata = new ImageMetadata({
      filename: originalname,
      gridfsId,
      originalName: originalname,
      mimetype,
      size: buffer.length,
      caption,
      metadata: {
        labels: visionData.labels || [],
        objects: visionData.objects || [],
        colors: visionData.colors || [],
        text: visionData.text || [],
        faces: visionData.hasFaces || false,
      },
      aiGenerated: true,
    });

    await imageMetadata.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageId: imageMetadata._id,
      filename: originalname,
      caption,
      metadata: imageMetadata.metadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import mongoose from 'mongoose';
import { ImageMetadata } from '../models/ImageMetadata.js';
import { downloadFileFromGridFS, deleteFileFromGridFS } from '../services/gridfsService.js';

const router = express.Router();

// Get all images metadata
router.get('/', async (req, res) => {
  try {
    const images = await ImageMetadata.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific image
router.get('/:id', async (req, res) => {
  try {
    const imageMetadata = await ImageMetadata.findById(req.params.id);
    if (!imageMetadata) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Download image from GridFS
    const imageBuffer = await downloadFileFromGridFS(imageMetadata.gridfsId);
    res.set('Content-Type', imageMetadata.mimetype);
    res.send(imageBuffer);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get image metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const imageMetadata = await ImageMetadata.findById(req.params.id);
    if (!imageMetadata) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(imageMetadata);
  } catch (error) {
    console.error('Get metadata error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update caption
router.put('/:id/caption', async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    const imageMetadata = await ImageMetadata.findByIdAndUpdate(
      req.params.id,
      { caption, captionEdited: true },
      { new: true }
    );

    if (!imageMetadata) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      success: true,
      message: 'Caption updated',
      imageMetadata,
    });
  } catch (error) {
    console.error('Update caption error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update metadata tags
router.put('/:id/metadata', async (req, res) => {
  try {
    const { metadata } = req.body;
    if (!metadata) {
      return res.status(400).json({ error: 'Metadata is required' });
    }

    const imageMetadata = await ImageMetadata.findByIdAndUpdate(
      req.params.id,
      { metadata },
      { new: true }
    );

    if (!imageMetadata) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      success: true,
      message: 'Metadata updated',
      imageMetadata,
    });
  } catch (error) {
    console.error('Update metadata error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const imageMetadata = await ImageMetadata.findByIdAndDelete(req.params.id);
    if (!imageMetadata) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from GridFS
    await deleteFileFromGridFS(imageMetadata.gridfsId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search images by tags
router.get('/search/tags', async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }

    const images = await ImageMetadata.find({
      $or: [
        { 'metadata.labels': tag },
        { 'metadata.objects': tag },
        { caption: { $regex: tag, $options: 'i' } },
      ],
    });

    res.json(images);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import { ImageMetadata } from '../models/ImageMetadata.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Image Gallery API Tests', () => {
  describe('Gallery Routes', () => {
    it('should get all images with empty gallery', async () => {
      const res = await request(app).get('/api/gallery');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return 404 for non-existent image', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/gallery/${fakeId}/metadata`);
      expect(res.status).toBe(404);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Server is running');
    });
  });

  describe('Image Metadata Operations', () => {
    let imageId;

    it('should create image metadata', async () => {
      const metadata = new ImageMetadata({
        filename: 'test.jpg',
        gridfsId: new mongoose.Types.ObjectId(),
        caption: 'Test caption',
        metadata: {
          labels: ['test', 'image'],
          objects: ['object1'],
          colors: ['blue'],
          text: [],
          faces: false,
        },
      });

      const saved = await metadata.save();
      imageId = saved._id;
      expect(saved._id).toBeDefined();
      expect(saved.caption).toBe('Test caption');
    });

    it('should update caption by ID', async () => {
      const updatedCaption = 'Updated caption';
      const updated = await ImageMetadata.findByIdAndUpdate(
        imageId,
        { caption: updatedCaption, captionEdited: true },
        { new: true }
      );

      expect(updated.caption).toBe(updatedCaption);
      expect(updated.captionEdited).toBe(true);
    });

    it('should fetch image by ID', async () => {
      const res = await request(app).get(`/api/gallery/${imageId}/metadata`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(imageId.toString());
    });

    it('should update metadata tags', async () => {
      const newMetadata = {
        labels: ['updated', 'tags'],
        objects: ['new object'],
        colors: ['red', 'green'],
        text: ['some text'],
        faces: true,
      };

      const res = await request(app)
        .put(`/api/gallery/${imageId}/metadata`)
        .send({ metadata: newMetadata });

      expect(res.status).toBe(200);
      expect(res.body.imageMetadata.metadata.labels).toContain('updated');
    });

    it('should search images by tag', async () => {
      const res = await request(app)
        .get('/api/gallery/search/tags')
        .query({ tag: 'updated' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fail search without tag parameter', async () => {
      const res = await request(app).get('/api/gallery/search/tags');
      expect(res.status).toBe(400);
    });
  });

  describe('Upload Route Tests', () => {
    it('should handle missing file gracefully', async () => {
      const res = await request(app)
        .post('/api/upload')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});

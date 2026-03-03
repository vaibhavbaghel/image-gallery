import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gridFSBucket = null;

export function initializeGridFS(connection = null) {
  const db = connection || mongoose.connection;
  if (!gridFSBucket) {
    gridFSBucket = new GridFSBucket(db.getClient().db('image-gallery'));
  }
  return gridFSBucket;
}

export async function uploadFileToGridFS(filename, mimetype, buffer) {
  try {
    if (!gridFSBucket) {
      initializeGridFS();
    }

    const uploadStream = gridFSBucket.openUploadStream(filename, {
      contentType: mimetype,
      metadata: {
        uploadedAt: new Date(),
      },
    });

    return new Promise((resolve, reject) => {
      uploadStream.end(buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(uploadStream.id);
        }
      });
    });
  } catch (error) {
    console.error('GridFS upload error:', error);
    throw error;
  }
}

export async function downloadFileFromGridFS(fileId) {
  try {
    if (!gridFSBucket) {
      initializeGridFS();
    }

    const chunks = [];
    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    return new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      downloadStream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('GridFS download error:', error);
    throw error;
  }
}

export async function deleteFileFromGridFS(fileId) {
  try {
    if (!gridFSBucket) {
      initializeGridFS();
    }

    return new Promise((resolve, reject) => {
      gridFSBucket.delete(fileId, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('GridFS delete error:', error);
    throw error;
  }
}

export async function getFileInfo(fileId) {
  try {
    if (!gridFSBucket) {
      initializeGridFS();
    }

    const files = await gridFSBucket.find({ _id: fileId }).toArray();
    return files.length > 0 ? files[0] : null;
  } catch (error) {
    console.error('GridFS get info error:', error);
    throw error;
  }
}

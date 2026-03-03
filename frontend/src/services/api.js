import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const galleryAPI = {
  // Get all images metadata
  getAllImages: async () => {
    try {
      const response = await api.get('/gallery');
      return response.data;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  },

  // Get specific image
  getImage: async (imageId) => {
    try {
      const response = await api.get(`/gallery/${imageId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  },

  // Get image metadata
  getImageMetadata: async (imageId) => {
    try {
      const response = await api.get(`/gallery/${imageId}/metadata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching image metadata:', error);
      throw error;
    }
  },

  // Update caption
  updateCaption: async (imageId, caption) => {
    try {
      const response = await api.put(`/gallery/${imageId}/caption`, {
        caption,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating caption:', error);
      throw error;
    }
  },

  // Update metadata tags
  updateMetadata: async (imageId, metadata) => {
    try {
      const response = await api.put(`/gallery/${imageId}/metadata`, {
        metadata,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw error;
    }
  },

  // Delete image
  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/gallery/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Search images by tag
  searchByTag: async (tag) => {
    try {
      const response = await api.get('/gallery/search/tags', {
        params: { tag },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching images:', error);
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default api;

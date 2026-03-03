import React, { useState } from 'react';
import { Upload, Button, message, Card, Spin, Progress, Alert } from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { galleryAPI } from '../services/api';
import '../styles/UploadPage.css';

function UploadPage({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      const result = await galleryAPI.uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedImage(result);
      message.success('Image uploaded and analyzed successfully!');

      // Reset form after 2 seconds
      setTimeout(() => {
        setUploadedImage(null);
        setUploadProgress(0);
        onImageUploaded();
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload image. Please check your API key and try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'image',
    multiple: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files');
        return false;
      }
      const isSmall = file.size / 1024 / 1024 < 50;
      if (!isSmall) {
        message.error('Image must be smaller than 50MB');
        return false;
      }
      handleUpload(file);
      return false;
    },
  };

  return (
    <div className="upload-container">
      <Card title="Upload Image" style={{ marginBottom: 24 }}>
        <Alert
          message="AI Analysis"
          description="Your image will be automatically analyzed using Google Cloud Vision API to extract metadata, objects, colors, and generate a caption."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Spin spinning={uploading}>
          <Upload.Dragger
            {...uploadProps}
            disabled={uploading}
            style={{
              padding: '48px 0',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              background: uploading ? '#f5f5f5' : '#fafafa',
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#667eea' }} />
            </p>
            <p className="ant-upload-text">
              Click or drag image to upload
            </p>
            <p className="ant-upload-hint">
              Supported formats: JPG, PNG, GIF, WebP (Max 50MB)
            </p>
          </Upload.Dragger>

          {uploading && uploadProgress > 0 && (
            <div style={{ marginTop: 24 }}>
              <p>Upload Progress: {Math.round(uploadProgress)}%</p>
              <Progress percent={Math.round(uploadProgress)} status="active" />
            </div>
          )}

          {uploadedImage && !uploading && (
            <Card
              style={{ marginTop: 24, background: '#f6ffed', border: '1px solid #b7eb8f' }}
            >
              <div style={{ textAlign: 'center', color: '#52c41a' }}>
                <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16, display: 'block' }} />
                <h3>Image Uploaded Successfully!</h3>
                <p><strong>Filename:</strong> {uploadedImage.filename}</p>
                <p><strong>AI Generated Caption:</strong> {uploadedImage.caption}</p>

                {uploadedImage.metadata && (
                  <div style={{ textAlign: 'left', marginTop: 16, background: 'white', padding: 16, borderRadius: 4 }}>
                    <h4>Extracted Metadata:</h4>
                    {uploadedImage.metadata.labels && uploadedImage.metadata.labels.length > 0 && (
                      <p>
                        <strong>Labels:</strong>{' '}
                        {uploadedImage.metadata.labels.join(', ')}
                      </p>
                    )}
                    {uploadedImage.metadata.objects && uploadedImage.metadata.objects.length > 0 && (
                      <p>
                        <strong>Objects:</strong>{' '}
                        {uploadedImage.metadata.objects.join(', ')}
                      </p>
                    )}
                    {uploadedImage.metadata.colors && uploadedImage.metadata.colors.length > 0 && (
                      <p>
                        <strong>Colors:</strong>{' '}
                        {uploadedImage.metadata.colors.join(', ')}
                      </p>
                    )}
                    {uploadedImage.metadata.faces && (
                      <p>
                        <strong>Faces Detected:</strong> Yes
                      </p>
                    )}
                  </div>
                )}

                <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
                  Redirecting to gallery...
                </p>
              </div>
            </Card>
          )}
        </Spin>
      </Card>

      <Card title="Features">
        <ul>
          <li>✨ Automatic AI analysis using Google Cloud Vision API</li>
          <li>🏷️ Extracted metadata: labels, objects, colors</li>
          <li>📝 Auto-generated captions</li>
          <li>💾 Secure storage using MongoDB GridFS</li>
          <li>✏️ Edit and customize captions</li>
          <li>🔍 Search by tags and metadata</li>
        </ul>
      </Card>
    </div>
  );
}

export default UploadPage;

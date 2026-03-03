import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Tag, Space, message, Popconfirm, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { galleryAPI } from '../services/api';

function ImageCard({ image, onDeleteSuccess }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(image.caption);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load image from backend
    loadImage();
  }, [image._id]);

  const loadImage = async () => {
    try {
      const blob = await galleryAPI.getImage(image._id);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error('Failed to load image:', error);
      message.error('Failed to load image');
    }
  };

  const handleEditCaption = () => {
    setEditing(true);
  };

  const handleSaveCaption = async () => {
    if (!caption.trim()) {
      message.error('Caption cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await galleryAPI.updateCaption(image._id, caption);
      message.success('Caption updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Failed to update caption:', error);
      message.error('Failed to update caption');
      setCaption(image.caption);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCaption(image.caption);
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      await galleryAPI.deleteImage(image._id);
      message.success('Image deleted successfully');
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete image:', error);
      message.error('Failed to delete image');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      hoverable
      className="image-card"
      cover={
        imageUrl ? (
          <img
            alt={image.originalName}
            src={imageUrl}
            className="image-preview"
          />
        ) : (
          <div className="image-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ fontSize: 24 }} />
          </div>
        )
      }
      style={{ margin: 0 }}
    >
      <div className="metadata-section">
        {/* Caption Section */}
        {editing ? (
          <div className="caption-edit-form">
            <Input.TextArea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Edit caption..."
              disabled={loading}
            />
            <Space style={{ marginTop: 8 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveCaption}
                loading={loading}
                size="small"
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                disabled={loading}
                size="small"
              >
                Cancel
              </Button>
            </Space>
          </div>
        ) : (
          <div>
            <p className="caption-content">{caption}</p>
            {image.captionEdited && (
              <Tag color="blue" style={{ marginBottom: 8 }}>
                Edited
              </Tag>
            )}
          </div>
        )}

        {/* Metadata Tags */}
        {image.metadata && image.metadata.labels && image.metadata.labels.length > 0 && (
          <div className="tags-container" style={{ marginTop: 12, marginBottom: 12 }}>
            {image.metadata.labels.slice(0, 5).map((label, idx) => (
              <Tooltip key={idx} title="Search by this tag">
                <Tag color="blue">{label}</Tag>
              </Tooltip>
            ))}
            {image.metadata.labels.length > 5 && (
              <Tag>+{image.metadata.labels.length - 5}</Tag>
            )}
          </div>
        )}

        {/* Objects */}
        {image.metadata && image.metadata.objects && image.metadata.objects.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <small style={{ display: 'block', fontWeight: 600, color: '#667eea', marginBottom: 4 }}>
              Objects
            </small>
            <div className="tags-container">
              {image.metadata.objects.map((obj, idx) => (
                <Tag key={idx} color="cyan">
                  {obj}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {image.metadata && image.metadata.colors && image.metadata.colors.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <small style={{ display: 'block', fontWeight: 600, color: '#666', marginBottom: 4 }}>
              Colors
            </small>
            <div className="tags-container">
              {image.metadata.colors.map((color, idx) => (
                <Tag key={idx} color="volcano">
                  {color}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Info */}
        <div className="metadata-grid">
          <div className="metadata-item">
            <div className="metadata-label">Uploaded</div>
            <div className="metadata-value">{formatDate(image.createdAt)}</div>
          </div>
          {image.metadata?.faces && (
            <div className="metadata-item">
              <div className="metadata-label">Contains</div>
              <div className="metadata-value">👤 Faces</div>
            </div>
          )}
          {image.metadata?.text && image.metadata.text.length > 0 && (
            <div className="metadata-item">
              <div className="metadata-label">Text Found</div>
              <div className="metadata-value">📝 Yes</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Space style={{ marginTop: 16, width: '100%' }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditCaption}
            block
            disabled={editing}
          >
            Edit Caption
          </Button>
          <Popconfirm
            title="Delete Image"
            description="Are you sure you want to delete this image?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} block>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
}

export default ImageCard;

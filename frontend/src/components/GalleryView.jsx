import React, { useState } from 'react';
import { Empty, Row, Col, Input, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import ImageCard from './ImageCard';
import { galleryAPI } from '../services/api';

function GalleryView({ images, loading, onImageDeleted }) {
  const [filteredImages, setFilteredImages] = useState(images);
  const [searchTag, setSearchTag] = useState('');

  const handleSearch = async () => {
    if (!searchTag.trim()) {
      setFilteredImages(images);
      return;
    }

    try {
      const results = await galleryAPI.searchByTag(searchTag);
      setFilteredImages(results);
      message.success(`Found ${results.length} images`);
    } catch (error) {
      message.error('Search failed');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await galleryAPI.deleteImage(imageId);
      message.success('Image deleted successfully');
      onImageDeleted();
    } catch (error) {
      message.error('Failed to delete image');
    }
  };

  const handleClearSearch = () => {
    setSearchTag('');
    setFilteredImages(images);
  };

  React.useEffect(() => {
    setFilteredImages(images);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="empty-state">
        <h2>No images yet</h2>
        <p>Upload your first image to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Input.Group compact style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search by tag, label, or caption..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 'calc(100% - 120px)' }}
          />
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
            Search
          </Button>
          {searchTag && (
            <Button onClick={handleClearSearch}>Clear</Button>
          )}
        </Input.Group>
        {searchTag && (
          <p style={{ color: '#666', fontSize: '12px' }}>
            Showing {filteredImages.length} of {images.length} images
          </p>
        )}
      </div>

      {filteredImages.length === 0 ? (
        <Empty description="No images match your search" />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredImages.map((image) => (
            <Col key={image._id} xs={24} sm={12} md={8} lg={6}>
              <ImageCard
                image={image}
                onDeleteSuccess={onImageDeleted}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default GalleryView;

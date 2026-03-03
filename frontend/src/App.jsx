import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Spin, message, ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import GalleryView from './components/GalleryView';
import UploadPage from './pages/UploadPage';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');

  const refreshGallery = async () => {
    setLoading(true);
    try {
      const { galleryAPI } = await import('./services/api');
      const data = await galleryAPI.getAllImages();
      setImages(data);
    } catch (error) {
      message.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshGallery();
  }, []);

  const handleImageUploaded = () => {
    message.success('Image uploaded successfully!');
    refreshGallery();
    setActiveTab('gallery');
  };

  const handleImageDeleted = () => {
    refreshGallery();
  };

  const tabItems = [
    {
      key: 'gallery',
      label: 'Gallery',
      children: (
        <GalleryView
          images={images}
          loading={loading}
          onImageDeleted={handleImageDeleted}
        />
      ),
    },
    {
      key: 'upload',
      label: 'Upload Image',
      children: (
        <UploadPage onImageUploaded={handleImageUploaded} />
      ),
    },
  ];

  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '0 24px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', color: 'white' }}>
            AI-Powered Image Gallery
          </h1>
        </Header>

        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Spin spinning={loading}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
              />
            </Spin>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          AI Image Gallery ©Vaibhav 
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;

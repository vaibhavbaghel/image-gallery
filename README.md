# AI-Powered Image Gallery

A full-stack web application that allows users to upload, manage, and analyze images using AI-generated metadata and captions. Built with React, Express.js, MongoDB, and Google Vision API.

![alt text](<Screenshot 2026-03-03 143051.png>)

![alt text](<Screenshot 2026-03-03 143114.png>)

## 🌟 Features

- **Image Upload**: Drag-and-drop or click-to-upload interface
- **AI Analysis**: Automatic metadata extraction using Google Vision API
  - Object detection and labeling
  - Dominant color analysis
  - Text detection (OCR)
  - Face detection
  - AI-generated captions
- **Secure Storage**: MongoDB GridFS for reliable image storage
- **Gallery Management**:
  - View all uploaded images
  - Search by tags, labels, or captions
  - Edit and customize AI-generated captions
  - Delete images
  - Responsive grid layout
- **Metadata Display**: Rich metadata tags beneath each image
- **Caption Editing**: Easy-to-use inline caption editing

## 🏗️ Architecture

```
image-gallery/
├── backend/
│   ├── models/
│   │   └── ImageMetadata.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── gallery.js
│   ├── services/
│   │   ├── visionService.js
│   │   └── gridfsService.js
│   ├── __tests__/
│   │   └── api.test.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GalleryView.jsx
│   │   │   └── ImageCard.jsx
│   │   ├── pages/
│   │   │   └── UploadPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── UploadPage.css
│   │   ├── __tests__/
│   │   │   └── api.test.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **File Storage**: MongoDB GridFS
- **AI/Vision**: Google Vision API
- **Upload Handling**: Multer
- **Testing**: Jest, Supertest

### Frontend
- **UI Framework**: React 18
- **Build Tool**: Vite
- **Component Library**: Ant Design
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Testing**: Vitest

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or cloud instance)
- Vision API key

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values:
   ```
   MONGODB_URI=mongodb://localhost:27017/image-gallery
   PORT=5000
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   NODE_ENV=development
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```
   Application opens at `http://localhost:3000`

## 🔑 Setting Up Google Vision API

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Vision API in the APIs & Services section
4. Create a service account with Vision API access
5. Download the service account key (JSON file)
6. Set `GOOGLE_APPLICATION_CREDENTIALS` in `.env` to the path of your JSON key file

## 📚 API Endpoints

### Upload
- `POST /api/upload` - Upload and analyze an image

### Gallery
- `GET /api/gallery` - Get all images metadata
- `GET /api/gallery/:id` - Get image file
- `GET /api/gallery/:id/metadata` - Get image metadata
- `PUT /api/gallery/:id/caption` - Update image caption
- `PUT /api/gallery/:id/metadata` - Update image metadata
- `DELETE /api/gallery/:id` - Delete image
- `GET /api/gallery/search/tags?tag=value` - Search by tag

### Health
- `GET /api/health` - Server health check

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Image Metadata Schema

Each uploaded image stores:
```javascript
{
  filename: String,
  gridfsId: ObjectId,
  originalName: String,
  mimetype: String,
  size: Number,
  uploadDate: Date,
  caption: String,
  metadata: {
    labels: [String],         // AI-extracted labels
    objects: [String],        // Detected objects
    colors: [String],         // Dominant colors
    text: [String],          // OCR results
    faces: Boolean,          // Face detection
    confidence: Number
  },
  aiGenerated: Boolean,
  captionEdited: Boolean    // User-edited flag
}
```

## 🎯 Key Features Explained

### AI-Powered Analysis
Images are automatically analyzed when uploaded:
1. Vision API extracts metadata (objects, colors, text, faces)
2. AI generates a descriptive caption
3. Data is stored in MongoDB with the image

### Caption Editing
Users can:
- View AI-generated captions
- Click "Edit Caption" to modify
- Save changes (marked as `captionEdited: true`)
- See indicator that caption was edited

### Search Functionality
- Search by AI-extracted labels
- Search by object names
- Search by caption keywords
- Real-time filtering across 5k+ images

### Responsive Design
- Mobile-first approach
- Responsive grid (1-4 columns based on screen size)
- Touch-friendly interface
- Optimized for all devices

## 📈 Performance Tips

- **Image Compression**: Pre-compress images before upload for faster processing
- **Batch Operations**: Upload images during off-peak hours
- **MongoDB Indexing**: Ensure indexes on `labels`, `objects`, and `caption` fields:
  ```javascript
  db.imagemetadata.createIndex({ "metadata.labels": 1 })
  db.imagemetadata.createIndex({ "metadata.objects": 1 })
  db.imagemetadata.createIndex({ "caption": "text" })
  ```

## 🔒 Security Considerations

- Validate file types server-side
- Implement file size limits (default: 50MB)
- Use CORS appropriately
- Authenticate API requests (implement in production)
- Secure API keys in environment variables
- Validate user input (captions)

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
npm install
```

### MongoDB connection failed
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB is accessible

### Google Vision API errors
- Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Check service account has Vision API permissions
- Ensure Vision API is enabled in Google Cloud project
- Check project billing is enabled
- Verify quota limits haven't been exceeded

### Images won't upload
- Verify file is a valid image
- Check file size (max 50MB)
- Ensure backend is running
- Check browser console for errors

## 📝 Sample Workflow

1. **Visit the application** at `http://localhost:3000`
2. **Go to "Upload Image" tab**
3. **Drag and drop or click to upload** an image
4. **Wait for AI analysis** (30-60 seconds depending on image)
5. **View generated metadata**:
   - Caption
   - Labels
   - Objects detected
   - Colors
   - Face detection
6. **Go to "Gallery" tab** to view all images
7. **Click "Edit Caption"** to customize the caption
8. **Search** using tags and labels
9. **Delete** images when needed

## 🚀 Deployment

### Heroku
```bash
# Backend
cd backend
heroku create your-app-name
git push heroku main

# Frontend
cd frontend
npm run build
# Deploy dist folder to static hosting (Vercel, Netlify)
```

### Docker
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📄 License

MIT License - feel free to use for personal and commercial projects

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review GitHub issues
3. Check API documentation
4. Review logs in development console

## 🎓 Learning Resources

- [MongoDB GridFS Documentation](https://docs.mongodb.com/manual/core/gridfs/)
- [Google Cloud Vision API Guide](https://cloud.google.com/vision/docs)
- [React Documentation](https://react.dev)
- [Ant Design Documentation](https://ant.design)
- [Express.js Documentation](https://expressjs.com)

---

**Made with ❤️ using React, MongoDB, and Google Cloud Vision**

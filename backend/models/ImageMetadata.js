import mongoose from 'mongoose';

const imageMetadataSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    gridfsId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    originalName: String,
    mimetype: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    caption: {
      type: String,
      default: '',
    },
    metadata: {
      labels: [String],
      objects: [String],
      colors: [String],
      text: [String],
      faces: {
        type: Boolean,
        default: false,
      },
      confidence: Number,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    captionEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema);

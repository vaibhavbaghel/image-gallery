import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

export async function analyzeImageWithVision(imageBuffer, mimeType = 'image/jpeg') {
  try {
    // Prepare the request for Google Vision API
    const request = {
      image: {
        content: imageBuffer,
      },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'OBJECT_LOCALIZATION' },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'TEXT_DETECTION' },
        { type: 'FACE_DETECTION' },
      ],
    };

    // Call Google Vision API
    const [result] = await client.annotateImage(request);

    // Extract labels
    const labels = result.labelAnnotations
      ?.map((label) => label.description)
      .slice(0, 5) || [];

    // Extract objects
    const objects = result.localizedObjectAnnotations
      ?.map((obj) => obj.name)
      .slice(0, 5) || [];

    // Extract text
    const text = result.textAnnotations
      ?.map((t) => t.description)
      .filter((t) => t.length > 1)
      .slice(0, 3) || [];

    // Extract dominant colors
    const colors = result.imagePropertiesAnnotation?.dominantColors?.colors
      ?.map((c) => {
        const rgb = c.color;
        return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
      })
      .slice(0, 3) || [];

    // Check for faces
    const hasFaces = result.faceAnnotations && result.faceAnnotations.length > 0;

    // Generate a caption from labels
    const caption =
      labels.length > 0
        ? `This image contains ${labels.slice(0, 2).join(', ')}.`
        : 'Image analyzed successfully.';

    return {
      caption,
      labels,
      objects,
      colors,
      text,
      hasFaces,
    };
  } catch (error) {
    console.error('Vision API error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

export async function generateCaption(imageBuffer, mimeType = 'image/jpeg') {
  try {
    // Use the analyzeImageWithVision function to get labels, then create a caption
    const analysisData = await analyzeImageWithVision(imageBuffer, mimeType);

    // Generate a more creative caption from the analysis data
    const { labels, text } = analysisData;
    let caption = 'An interesting image.';

    if (labels.length > 0) {
      const mainLabel = labels[0];
      const secondaryLabel = labels[1] || '';

      if (secondaryLabel) {
        caption = `A beautiful ${mainLabel} with ${secondaryLabel} elements.`;
      } else {
        caption = `A stunning photograph of ${mainLabel}.`;
      }
    }

    if (text.length > 0) {
      caption += ` Text found: "${text[0]}"`.substring(0, 100);
    }

    return caption;
  } catch (error) {
    console.error('Caption generation error:', error);
    throw new Error(`Failed to generate caption: ${error.message}`);
  }
}

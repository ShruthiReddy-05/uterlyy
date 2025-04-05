
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import * as tf from '@tensorflow/tfjs-node';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

let model: tf.LayersModel;

/**
 * Load and initialize the TensorFlow.js model
 */
export async function loadModel() {
  try {
    const modelPath = 'file://' + path.join(process.cwd(), 'models/pcos_model/model.json');
    model = await tf.loadLayersModel(modelPath);
    console.log('PCOS detection model loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load PCOS detection model:', error);
    return false;
  }
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(imagePath: string) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'pcos_detection',
    });
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error: any) {
    console.error('Failed to upload to Cloudinary:', error);
    return null;
  }
}

/**
 * Preprocess image for model input
 */
async function preprocessImage(imagePath: string): Promise<tf.Tensor | null> {
  try {
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Decode and resize image to match model input size (assuming 224x224)
    const tfImage = tf.node.decodeImage(imageBuffer);
    const resized = tf.image.resizeBilinear(tfImage, [224, 224]);
    
    // Normalize pixel values to [0,1]
    const normalized = resized.div(255.0);
    
    // Add batch dimension
    const batched = normalized.expandDims(0);
    
    tfImage.dispose();
    resized.dispose();
    normalized.dispose();
    
    return batched;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    return null;
  }
}

/**
 * Detect PCOS using TensorFlow.js model
 */
export async function detectPCOS(imagePath: string) {
  try {
    const tensor = await preprocessImage(imagePath);
    if (!tensor) {
      throw new Error('Failed to preprocess image');
    }

    // Get prediction
    const prediction = model.predict(tensor) as tf.Tensor;
    const pcosLikelihood = parseFloat((await prediction.data())[0] * 100);
    
    // Clean up tensors
    tensor.dispose();
    prediction.dispose();

    return {
      pcosLikelihood: parseFloat(pcosLikelihood.toFixed(2)),
      isPcos: pcosLikelihood > 50
    };
  } catch (error: any) {
    console.error('Error detecting PCOS:', error);
    return null;
  }
}

/**
 * Prepare the directory structure for uploads
 */
export async function prepareModelDirectory() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Uploads directory created');
    }
    
    return true;
  } catch (error) {
    console.error('Error preparing upload directory:', error);
    return false;
  }
}

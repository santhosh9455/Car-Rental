import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary, uploader as realUploader, config } from "cloudinary";


export const cloudinaryConfig = (req, res, next) => {
  if (process.env.API_KEY) {
    config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }
  next();
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const uploader = process.env.API_KEY ? realUploader : {
  upload: async (file, options) => {
    // file is a base64 string like "data:image/jpeg;base64,..."
    // extract base64 part
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.warn("Invalid base64 string");
      return { secure_url: "https://via.placeholder.com/150?text=Mock+Image" };
    }
    const ext = matches[1].split('/')[1] || 'png';
    const base64Data = matches[2];
    
    // ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // use a timestamp to prevent overwriting
    const safeFilename = options?.public_id?.replace(/[^a-zA-Z0-9]/g, '_') || 'uploaded_image';
    const fileName = `${safeFilename}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    // write to disk
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return { secure_url: `${baseUrl}/uploads/${fileName}` };
  }
};

export { uploader, cloudinary };

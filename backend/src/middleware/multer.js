import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';


dotenv.config();
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Cloudinary Storage Engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skyway_uploads', // Cloudinary pe automatic folder ban jayega
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Industry level restriction
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optimization
  },
});

const upload = multer({ storage });
export default upload;
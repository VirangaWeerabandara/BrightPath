require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Validate environment variables
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.tempFilePath,
      {
        ...opts,
        resource_type: "image",
        folder: "BrightPath_Images",
      },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url);
        }
        console.error("Image upload error:", error);
        return reject({ message: error.message });
      }
    );
  });
};

const uploadVideo = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.tempFilePath,
      {
        ...opts,
        resource_type: "video",
        folder: "BrightPath_Videos",
      },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url);
        }
        console.error("Video upload error:", error);
        return reject({ message: error.message });
      }
    );
  });
};

module.exports = { uploadImage, uploadVideo };

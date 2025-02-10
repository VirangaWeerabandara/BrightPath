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

// ... rest of your existing cloudinaryConfig.js code ...

// Function to upload images
const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { ...opts, resource_type: "image" },
      (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.error("Image upload error:", error); // Log full error
        return reject({ message: error.message });
      }
    );
  });
};

// Function to upload videos
const uploadVideo = (video) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      video,
      { ...opts, resource_type: "video" },
      (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.error("Video upload error:", error); // Log full error
        return reject({ message: error.message });
      }
    );
  });
};

// Exporting both uploadImage and uploadVideo
module.exports = {
  uploadImage,

  uploadVideo,

  uploadMultipleImages: async (images) => {
    try {
      const uploads = images.map((base) => uploadImage(base));
      const values = await Promise.all(uploads);
      return { urls: values }; // Return array of URLs in an object
    } catch (err) {
      console.error("Multiple image upload error:", err); // Log full error
      throw err;
    }
  },

  uploadMultipleVideos: async (videos) => {
    try {
      const uploads = videos.map((base) => uploadVideo(base));
      const values = await Promise.all(uploads);
      return { urls: values }; // Return array of URLs in an object
    } catch (err) {
      console.error("Multiple video upload error:", err); // Log full error
      throw err;
    }
  },
};

const {
  uploadImage,
  uploadVideo,
  uploadMultipleImages,
  uploadMultipleVideos,
} = require("../config/cloudinaryConfig");

// Single image upload controller
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }
    const url = await uploadImage(req.body.image);
    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// Multiple images upload controller
const uploadMultipleImagesHandler = async (req, res) => {
  try {
    if (!req.body.images || !Array.isArray(req.body.images)) {
      return res.status(400).json({
        success: false,
        message: "No images provided or invalid format",
      });
    }
    const { urls } = await uploadMultipleImages(req.body.images);
    res.status(200).json({ success: true, urls });
  } catch (error) {
    console.error("Multiple images upload error:", error);
    res.status(500).json({
      success: false,
      message: "Multiple images upload failed",
      error: error.message,
    });
  }
};

// Single video upload controller
const uploadSingleVideo = async (req, res) => {
  try {
    if (!req.body.video) {
      return res.status(400).json({
        success: false,
        message: "No video provided",
      });
    }
    const url = await uploadVideo(req.body.video);
    res.status(200).json({ success: true, url });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message,
    });
  }
};

// Multiple videos upload controller
const uploadMultipleVideosHandler = async (req, res) => {
  try {
    if (!req.body.videos || !Array.isArray(req.body.videos)) {
      return res.status(400).json({
        success: false,
        message: "No videos provided or invalid format",
      });
    }
    const { urls } = await uploadMultipleVideos(req.body.videos);
    res.status(200).json({ success: true, urls });
  } catch (error) {
    console.error("Multiple videos upload error:", error);
    res.status(500).json({
      success: false,
      message: "Multiple videos upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImagesHandler,
  uploadSingleVideo,
  uploadMultipleVideosHandler,
};

const { uploadImage, uploadVideo } = require("../config/cloudinaryConfig");

// Single image upload controller
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }
    const file = req.files.file;
    const url = await uploadImage(file);
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

// Single video upload controller
const uploadSingleVideo = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }
    const file = req.files.file;
    const url = await uploadVideo(file);
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

// Multiple images upload controller
const uploadMultipleImagesHandler = async (req, res) => {
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];
    const urls = await Promise.all(files.map((file) => uploadImage(file)));
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

// Multiple videos upload controller
const uploadMultipleVideosHandler = async (req, res) => {
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json({
        success: false,
        message: "No video files provided",
      });
    }
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];
    const urls = await Promise.all(files.map((file) => uploadVideo(file)));
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
  uploadSingleVideo,
  uploadMultipleImagesHandler,
  uploadMultipleVideosHandler,
};

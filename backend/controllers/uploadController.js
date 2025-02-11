const { uploadImage, uploadVideo } = require("../config/cloudinaryConfig");
const cloudinary = require("cloudinary").v2; // Add this import

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
    const result = await uploadVideo(file);

    // Send only one response with all needed data
    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message,
    });
  }
};

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
    const result = await uploadImage(file);

    // Send only one response with all needed data
    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
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

    const results = await Promise.all(files.map((file) => uploadImage(file)));

    // Format the response with URLs and public IDs
    const formattedResults = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    return res.status(200).json({
      success: true,
      files: formattedResults,
    });
  } catch (error) {
    console.error("Multiple images upload error:", error);
    return res.status(500).json({
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

const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "No public ID provided",
      });
    }

    console.log("Attempting to delete file with publicId:", publicId);

    // Determine resource type based on folder name
    const resourceType = publicId.includes("BrightPath_Videos")
      ? "video"
      : "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Cloudinary delete result:", result);

    if (result.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      throw new Error("Failed to delete file from Cloudinary");
    }
  } catch (error) {
    console.error("File deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "File deletion failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadSingleVideo,
  uploadMultipleImagesHandler,
  uploadMultipleVideosHandler,
  deleteFile,
};

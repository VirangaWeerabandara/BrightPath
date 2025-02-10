const express = require("express");
const {
  uploadSingleImage,
  uploadMultipleImagesHandler,
  uploadSingleVideo,
  uploadMultipleVideosHandler,
} = require("../controllers/uploadController");

const router = express.Router();

// Image upload routes
router.post("/image", uploadSingleImage);
router.post("/images", uploadMultipleImagesHandler);

// Video upload routes
router.post("/video", uploadSingleVideo);
router.post("/videos", uploadMultipleVideosHandler);

module.exports = router;

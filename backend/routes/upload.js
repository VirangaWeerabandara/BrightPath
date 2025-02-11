const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireTeacher = require("../middleware/requireTeacher");
const {
  uploadSingleImage,
  uploadMultipleImagesHandler,
  uploadSingleVideo,
  uploadMultipleVideosHandler,
} = require("../controllers/uploadController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);
router.use(requireTeacher);

// Image upload routes
router.post("/image", uploadSingleImage);
router.post("/images", uploadMultipleImagesHandler);

// Video upload routes
router.post("/video", uploadSingleVideo);
router.post("/videos", uploadMultipleVideosHandler);

module.exports = router;

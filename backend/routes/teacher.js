const express = require("express");
const {
  signupTeacher,
  updateTeacherProfile,
  updateTeacherPassword,
} = require("../controllers/teacherController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public routes
router.post("/signup", signupTeacher);

// Protected routes
router.put("/:id", requireAuth, updateTeacherProfile);

// Add this route with the existing protected routes
router.put("/:id/password", requireAuth, updateTeacherPassword);

module.exports = router;

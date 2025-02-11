const express = require("express");
const {
  signupTeacher,
  updateTeacherProfile,
  updateTeacherPassword,
} = require("../controllers/teacherController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public routes
router.post("/signup/teacher", signupTeacher);

// Protected routes
router.put("/users/:id", requireAuth, updateTeacherProfile);

// Add this route with the existing protected routes
router.put("/users/:id/password", requireAuth, updateTeacherPassword);

module.exports = router;

const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  signupStudent,
  enrollInCourse,
  getEnrolledCourses,
  updateProfile,
} = require("../controllers/studentController");

const router = express.Router();

// Public routes
router.post("/signup", signupStudent);

router.use(requireAuth); // Middleware to protect routes below
router.post("/courses/:courseId/enroll", enrollInCourse);
router.get("/courses/enrolled-courses", getEnrolledCourses);
router.put("/update-profile", updateProfile);
module.exports = router;

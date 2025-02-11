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
router.post("/signup/student", signupStudent);

router.use(requireAuth); // Middleware to protect routes below
router.post("/courses/:courseId/enroll", enrollInCourse);
router.get("/student/enrolled-courses", getEnrolledCourses);
router.put("/student/update-profile", updateProfile);
module.exports = router;

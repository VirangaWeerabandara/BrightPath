const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireTeacherRole = require("../middleware/requireTeacherAuth");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  enrollStudent,
  getTeacherCourseStats,
  getCourseContent,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/courses", getAllCourses);
// Apply authentication middleware to all routes
router.use(requireAuth);

// Teacher-only routes
router.post("/courses/create", requireTeacherRole, createCourse);
router.get(
  "/teacher/courses/:teacherId",
  requireTeacherRole,
  getCoursesByTeacher
);
router.put("/courses/:id", requireTeacherRole, updateCourse);
router.delete("/courses/:id", requireTeacherRole, deleteCourse);
router.get(
  "/teacher/:teacherId/stats",
  requireTeacherRole,
  getTeacherCourseStats
);

// Student accessible routes

router.get("/courses/:id", getCourseById);
router.post("/courses/:id/enroll", enrollStudent);
router.get("/courses/:courseId/content", requireAuth, getCourseContent);
module.exports = router;

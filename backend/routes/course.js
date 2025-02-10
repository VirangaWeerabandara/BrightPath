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
} = require("../controllers/courseController");

const router = express.Router();

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
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);
router.post("/courses/:id/enroll", enrollStudent);

module.exports = router;

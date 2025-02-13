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

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
// Apply authentication middleware to all routes
router.use(requireAuth);

// Teacher-only routes
router.post("/create", requireTeacherRole, createCourse);
router.get("/teacher/:teacherId", requireTeacherRole, getCoursesByTeacher);
router.put("/:id", requireTeacherRole, updateCourse);
router.delete("/:id", requireTeacherRole, deleteCourse);
router.get(
  "/teacher/:teacherId/stats",
  requireTeacherRole,
  getTeacherCourseStats
);

// Student accessible routes
router.post("/:id/enroll", enrollStudent);

module.exports = router;

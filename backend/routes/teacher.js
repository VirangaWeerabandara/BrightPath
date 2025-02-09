const express = require("express");
const { signupTeacher } = require("../controllers/teacherController");

const router = express.Router();

// Public routes
router.post("/signup/teacher", signupTeacher);

module.exports = router;

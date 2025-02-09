const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { signupStudent } = require("../controllers/studentController");

const router = express.Router();

// Public routes
router.post("/signup/student", signupStudent);

module.exports = router;

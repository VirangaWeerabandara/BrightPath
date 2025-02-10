const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");

const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, role } = jwt.verify(token, process.env.SECRET);

    // Check for both student and teacher roles
    if (role === "student") {
      req.user = await Student.findOne({ _id }).select("_id role");
    } else if (role === "teacher") {
      req.user = await Teacher.findOne({ _id }).select("_id role");
    } else {
      throw new Error("Invalid role");
    }

    if (!req.user) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;

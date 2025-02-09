const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");

const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, role } = jwt.verify(token, process.env.SECRET);

    if (role !== "student") {
      throw new Error("Not authorized");
    }

    req.user = await Student.findOne({ _id }).select("_id role");
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;

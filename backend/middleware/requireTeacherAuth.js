const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");

const requireTeacherAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, role } = jwt.verify(token, process.env.SECRET);

    if (role !== "teacher") {
      throw new Error("Not authorized as teacher");
    }

    req.user = await Teacher.findOne({ _id }).select("_id role");
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireTeacherAuth;

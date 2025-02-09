const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (_id, role) => {
  if (!process.env.SECRET) {
    throw new Error("JWT SECRET must be defined in environment variables");
  }
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

const login = async (req, res) => {
  const { email, password, role } = req.body; // Add role to request

  try {
    let user;
    let token;

    // Check role from request
    if (role === "student") {
      user = await Student.login(email, password);
    } else if (role === "teacher") {
      user = await Teacher.login(email, password);
    } else {
      throw Error("Invalid role specified");
    }

    token = createToken(user._id, role);

    res.status(200).json({
      email,
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      ...(role === "teacher" && { nic: user.nic }),
      role,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login };
